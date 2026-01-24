#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

// Storage key for total deposits
const TOTAL: Symbol = symbol_short!("TOTAL");

// Data key for per-address balance storage
#[contracttype]
pub enum DataKey {
    Balance(Address),
}

#[contract]
pub struct DepositContract;

#[contractimpl]
impl DepositContract {
    /// Deposit funds into the contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `depositor` - The wallet address of the depositor
    /// * `amount` - The amount to deposit
    ///
    /// # Returns
    /// The new balance of the depositor
    pub fn deposit(env: Env, depositor: Address, amount: i128) -> i128 {
        // Require authorization from the depositor
        depositor.require_auth();

        // Validate amount is positive
        if amount <= 0 {
            panic!("Deposit amount must be positive");
        }

        // Get current balance for depositor (default to 0 if not exists)
        let key = DataKey::Balance(depositor.clone());
        let current_balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);

        // Calculate new balance
        let new_balance = current_balance + amount;

        // Store new balance
        env.storage().persistent().set(&key, &new_balance);

        // Update total deposits
        let total: i128 = env.storage().instance().get(&TOTAL).unwrap_or(0);
        env.storage().instance().set(&TOTAL, &(total + amount));

        // Extend TTL to prevent archival
        env.storage().persistent().extend_ttl(&key, 50, 100);
        env.storage().instance().extend_ttl(50, 100);

        new_balance
    }

    /// Withdraw funds from the contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `withdrawer` - The wallet address of the withdrawer (must have deposited previously)
    /// * `amount` - The amount to withdraw
    ///
    /// # Returns
    /// The remaining balance of the withdrawer
    pub fn withdraw(env: Env, withdrawer: Address, amount: i128) -> i128 {
        // Require authorization from the withdrawer
        withdrawer.require_auth();

        // Validate amount is positive
        if amount <= 0 {
            panic!("Withdraw amount must be positive");
        }

        // Get current balance for withdrawer
        let key = DataKey::Balance(withdrawer.clone());
        let current_balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);

        // Check sufficient balance
        if current_balance < amount {
            panic!("Insufficient balance");
        }

        // Calculate new balance
        let new_balance = current_balance - amount;

        // Store new balance
        env.storage().persistent().set(&key, &new_balance);

        // Update total deposits
        let total: i128 = env.storage().instance().get(&TOTAL).unwrap_or(0);
        env.storage().instance().set(&TOTAL, &(total - amount));

        // Extend TTL to prevent archival
        env.storage().persistent().extend_ttl(&key, 50, 100);
        env.storage().instance().extend_ttl(50, 100);

        new_balance
    }

    /// Get the balance of a specific address
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `address` - The wallet address to check
    ///
    /// # Returns
    /// The balance of the address
    pub fn get_balance(env: Env, address: Address) -> i128 {
        let key = DataKey::Balance(address);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Get the total deposits in the contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    ///
    /// # Returns
    /// The total amount deposited
    pub fn get_total(env: Env) -> i128 {
        env.storage().instance().get(&TOTAL).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_deposit() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(DepositContract, ());
        let client = DepositContractClient::new(&env, &contract_id);

        let depositor = Address::generate(&env);

        // Test deposit
        let balance = client.deposit(&depositor, &100);
        assert_eq!(balance, 100);

        // Test second deposit
        let balance = client.deposit(&depositor, &50);
        assert_eq!(balance, 150);

        // Test get_balance
        let balance = client.get_balance(&depositor);
        assert_eq!(balance, 150);

        // Test get_total
        let total = client.get_total();
        assert_eq!(total, 150);
    }

    #[test]
    fn test_withdraw() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(DepositContract, ());
        let client = DepositContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        // Deposit first
        client.deposit(&user, &100);

        // Test withdraw
        let balance = client.withdraw(&user, &30);
        assert_eq!(balance, 70);

        // Verify balance
        let balance = client.get_balance(&user);
        assert_eq!(balance, 70);

        // Verify total
        let total = client.get_total();
        assert_eq!(total, 70);
    }

    #[test]
    #[should_panic(expected = "Insufficient balance")]
    fn test_withdraw_insufficient_balance() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(DepositContract, ());
        let client = DepositContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        // Deposit
        client.deposit(&user, &50);

        // Try to withdraw more than balance
        client.withdraw(&user, &100);
    }

    #[test]
    fn test_multiple_users() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(DepositContract, ());
        let client = DepositContractClient::new(&env, &contract_id);

        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);

        // User 1 deposits
        client.deposit(&user1, &100);

        // User 2 deposits
        client.deposit(&user2, &200);

        // Verify individual balances
        assert_eq!(client.get_balance(&user1), 100);
        assert_eq!(client.get_balance(&user2), 200);

        // Verify total
        assert_eq!(client.get_total(), 300);

        // User 1 withdraws
        client.withdraw(&user1, &50);

        // Verify updated balances
        assert_eq!(client.get_balance(&user1), 50);
        assert_eq!(client.get_total(), 250);
    }
}
