#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

// Data key for per-address balance storage
#[contracttype]
pub enum DataKey {
    Balance(Address),
    TokenAddress,
}

#[contract]
pub struct DepositContract;

#[contractimpl]
impl DepositContract {
    /// Initialize the contract with the native XLM token address
    /// Call this once after deploying the contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `token_address` - The address of the native XLM token contract (SAC)
    pub fn initialize(env: Env, token_address: Address) {
        // Only allow initialization once
        if env.storage().instance().has(&DataKey::TokenAddress) {
            panic!("Contract already initialized");
        }
        env.storage().instance().set(&DataKey::TokenAddress, &token_address);
    }

    /// Deposit XLM tokens into the contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `depositor` - The wallet address of the depositor
    /// * `amount` - The amount of XLM to deposit (in stroops, 1 XLM = 10^7 stroops)
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

        // Get token contract address
        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("Contract not initialized");

        // Create token client
        let token_client = token::Client::new(&env, &token_address);

        // Transfer XLM from depositor to this contract
        let contract_address = env.current_contract_address();
        token_client.transfer(&depositor, &contract_address, &amount);

        // Get current balance for depositor (default to 0 if not exists)
        let key = DataKey::Balance(depositor.clone());
        let current_balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);

        // Calculate new balance
        let new_balance = current_balance + amount;

        // Store new balance
        env.storage().persistent().set(&key, &new_balance);

        // Extend TTL to prevent archival
        env.storage().persistent().extend_ttl(&key, 50, 100);
        env.storage().instance().extend_ttl(50, 100);

        new_balance
    }

    /// Withdraw XLM tokens from the contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    /// * `withdrawer` - The wallet address of the withdrawer
    /// * `amount` - The amount of XLM to withdraw (in stroops)
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

        // Get token contract address
        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("Contract not initialized");

        // Create token client
        let token_client = token::Client::new(&env, &token_address);

        // Transfer XLM from contract to withdrawer
        let contract_address = env.current_contract_address();
        token_client.transfer(&contract_address, &withdrawer, &amount);

        // Calculate new balance
        let new_balance = current_balance - amount;

        // Store new balance
        env.storage().persistent().set(&key, &new_balance);

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
    /// The balance of the address in stroops
    pub fn get_balance(env: Env, address: Address) -> i128 {
        let key = DataKey::Balance(address);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Get the token address used by this contract
    ///
    /// # Arguments
    /// * `env` - The contract environment
    ///
    /// # Returns
    /// The token contract address
    pub fn get_token(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("Contract not initialized")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{token::StellarAssetClient, Env};

    #[test]
    fn test_deposit_and_withdraw() {
        let env = Env::default();
        env.mock_all_auths();

        // Deploy the contract
        let contract_id = env.register(DepositContract, ());
        let client = DepositContractClient::new(&env, &contract_id);

        // Create a token admin and deploy a token contract (simulating XLM SAC)
        let admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract_v2(admin.clone());
        let token_address = token_contract_id.address();
        let token_admin_client = StellarAssetClient::new(&env, &token_address);

        // Initialize the deposit contract with the token address
        client.initialize(&token_address);

        // Create a user
        let user = Address::generate(&env);

        // Mint some tokens to the user (simulating they have XLM)
        token_admin_client.mint(&user, &1000);

        // Test deposit
        let balance = client.deposit(&user, &100);
        assert_eq!(balance, 100);

        // Test get_balance
        let balance = client.get_balance(&user);
        assert_eq!(balance, 100);

        // Test withdraw
        let balance = client.withdraw(&user, &30);
        assert_eq!(balance, 70);

        // Verify final balance
        let balance = client.get_balance(&user);
        assert_eq!(balance, 70);
    }

    #[test]
    #[should_panic(expected = "Insufficient balance")]
    fn test_withdraw_insufficient_balance() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(DepositContract, ());
        let client = DepositContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token_contract_id = env.register_stellar_asset_contract_v2(admin.clone());
        let token_address = token_contract_id.address();
        let token_admin_client = StellarAssetClient::new(&env, &token_address);

        client.initialize(&token_address);

        let user = Address::generate(&env);
        token_admin_client.mint(&user, &1000);

        // Deposit
        client.deposit(&user, &50);

        // Try to withdraw more than balance
        client.withdraw(&user, &100);
    }
}
