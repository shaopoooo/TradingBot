const BinanceClient = require('../src/api/BinanceClient');
const assert = require('assert');
const logger = require('../src/utils/Logger');

async function runMockTest() {
    console.log('--- RUNNING MOCK TEST ---');
    // Mock specific methods to avoid real API calls
    const mockClient = new BinanceClient();

    // Overwrite the privateGet method to simulate API response
    mockClient.privateGet = async (endpoint) => {
        console.log(`[MOCK] Calling ${endpoint}`);
        if (endpoint === '/api/v3/account') {
            return {
                makerCommission: 15,
                takerCommission: 15,
                buyerCommission: 0,
                sellerCommission: 0,
                commissionRates: { maker: '0.00150000', taker: '0.00150000', buyer: '0.00000000', seller: '0.00000000' },
                canTrade: true,
                canWithdraw: true,
                canDeposit: true,
                brokered: false,
                requireSelfTradePrevention: false,
                updateTime: 123456789,
                accountType: 'SPOT',
                balances: [
                    { asset: 'BTC', free: '0.00100000', locked: '0.00000000' },
                    { asset: 'LTC', free: '0.00000000', locked: '0.00000000' },
                    { asset: 'ETH', free: '0.00000000', locked: '0.10000000' },
                    { asset: 'USDT', free: '100.00000000', locked: '50.00000000' }
                ],
                permissions: ['SPOT']
            };
        }
        throw new Error('Unknown endpoint mock');
    };

    try {
        // Test getBalances filtering logic
        const balances = await mockClient.getBalances();

        // Assertions
        assert.strictEqual(balances.length, 3, 'Should verify only non-zero balances are returned (BTC, ETH, USDT)');

        const btc = balances.find(b => b.asset === 'BTC');
        assert.ok(btc, 'BTC should be present');
        assert.strictEqual(btc.free, '0.00100000');

        const ltc = balances.find(b => b.asset === 'LTC');
        assert.strictEqual(ltc, undefined, 'LTC (zero balance) should be filtered out');

        console.log('PASS: Balance filtering logic');
        console.log('MOCK TEST SUCCESS');

    } catch (err) {
        console.error('MOCK TEST FAILED');
        console.error(err);
        process.exit(1);
    }
}

async function runLiveTest() {
    console.log('\n--- RUNNING LIVE TEST (Real API) ---');
    console.log('Reading credentials from .env...');

    // Check if keys are present (basic check)
    if (!process.env.BINANCE_API_KEY || process.env.BINANCE_API_KEY.includes('your_api_key')) {
        console.error('SKIP: BINANCE_API_KEY is missing or default in .env');
        return;
    }

    const client = new BinanceClient();

    try {
        console.log('Connecting to Binance API...');
        const balances = await client.getBalances();

        console.log('SUCCESS! Real Connection Established.');
        console.log('Account Overview (Non-zero balances):');
        if (balances.length === 0) {
            console.log('(No assets with balance > 0 found)');
        } else {
            console.table(balances);
        }
        console.log('LIVE TEST SUCCESS');

    } catch (error) {
        console.error('LIVE TEST FAILED');
        console.error('Please check your API Key, Secret, and Network/IP permissions.');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
}

// Main Execution
(async () => {
    // Always run mock test
    await runMockTest();

    // Run live test only if flag is present
    if (process.argv.includes('--live')) {
        await runLiveTest();
    } else {
        console.log('\n[INFO] Skipping live test. Use --live to run real API verification.');
    }
})();
