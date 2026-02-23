#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec};

// ---------------------------------------------------------------------------
// Data Types
// ---------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Deposit {
    pub amount: i128,
    pub date: u64,
}

#[contracttype]
pub enum DataKey {
    Deposits(Address),
    TokenAddress,
    ProjectWallet,
}

// ---------------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------------

#[contract]
pub struct SubscriptionContract;

#[contractimpl]
impl SubscriptionContract {
    /// Initialize the contract with the token (native XLM SAC) and project wallet.
    /// Can only be called once.
    pub fn initialize(env: Env, token: Address, project_wallet: Address) {
        if env.storage().instance().has(&DataKey::TokenAddress) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::TokenAddress, &token);
        env.storage()
            .instance()
            .set(&DataKey::ProjectWallet, &project_wallet);
    }

    /// Transfer XLM to the project wallet and record the deposit — single transaction.
    pub fn deposit(env: Env, wallet: Address, amount: i128, date: u64) {
        wallet.require_auth();

        // Transfer XLM from wallet to project wallet via SAC
        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("not initialized");
        let project_wallet: Address = env
            .storage()
            .instance()
            .get(&DataKey::ProjectWallet)
            .expect("not initialized");

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&wallet, &project_wallet, &amount);

        // Record the deposit
        let key = DataKey::Deposits(wallet.clone());

        let mut deposits: Vec<Deposit> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Vec::new(&env));

        deposits.push_back(Deposit { amount, date });

        env.storage().persistent().set(&key, &deposits);

        env.storage()
            .persistent()
            .extend_ttl(&key, 3_153_600, 6_307_200);

        env.events().publish(
            (Symbol::new(&env, "deposit"), wallet),
            (amount, date),
        );
    }

    /// Return the full deposit history for a wallet.
    pub fn get_deposits(env: Env, wallet: Address) -> Vec<Deposit> {
        let key = DataKey::Deposits(wallet);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Return the date of the most recent deposit for a wallet.
    /// Panics if no deposits exist.
    pub fn get_last_subscription_date(env: Env, wallet: Address) -> u64 {
        let key = DataKey::Deposits(wallet);
        let deposits: Vec<Deposit> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Vec::new(&env));

        if deposits.is_empty() {
            panic!("no deposits found for wallet");
        }

        deposits.last().unwrap().date
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_deposit_and_retrieve() {
        let env = Env::default();
        env.mock_all_auths();

        // Register a mock token contract
        let token_admin = Address::generate(&env);
        let token_address = env.register_stellar_asset_contract_v2(token_admin.clone());
        let token_client = token::StellarAssetClient::new(&env, &token_address.address());

        let contract_id = env.register(SubscriptionContract, ());
        let client = SubscriptionContractClient::new(&env, &contract_id);

        let project_wallet = Address::generate(&env);
        let wallet = Address::generate(&env);
        let now: u64 = 1_700_000_000;

        // Initialize
        client.initialize(&token_address.address(), &project_wallet);

        // Mint tokens to wallet
        token_client.mint(&wallet, &10_000_000);

        // First deposit
        client.deposit(&wallet, &1_000_000_i128, &now);

        // Second deposit
        client.deposit(&wallet, &2_000_000_i128, &(now + 86_400));

        // Verify deposits recorded
        let deposits = client.get_deposits(&wallet);
        assert_eq!(deposits.len(), 2);
        assert_eq!(deposits.get(0).unwrap().amount, 1_000_000_i128);
        assert_eq!(deposits.get(1).unwrap().amount, 2_000_000_i128);

        // Verify XLM transferred to project wallet
        let balance_client = token::Client::new(&env, &token_address.address());
        assert_eq!(balance_client.balance(&project_wallet), 3_000_000);

        // Verify last subscription date
        let last_date = client.get_last_subscription_date(&wallet);
        assert_eq!(last_date, now + 86_400);
    }

    #[test]
    fn test_get_deposits_empty() {
        let env = Env::default();
        let contract_id = env.register(SubscriptionContract, ());
        let client = SubscriptionContractClient::new(&env, &contract_id);

        let wallet = Address::generate(&env);
        let deposits = client.get_deposits(&wallet);
        assert_eq!(deposits.len(), 0);
    }

    #[test]
    #[should_panic(expected = "no deposits found for wallet")]
    fn test_get_last_date_empty_panics() {
        let env = Env::default();
        let contract_id = env.register(SubscriptionContract, ());
        let client = SubscriptionContractClient::new(&env, &contract_id);

        let wallet = Address::generate(&env);
        client.get_last_subscription_date(&wallet);
    }
}
