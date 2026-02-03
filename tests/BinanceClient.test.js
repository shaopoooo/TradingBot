const BinanceClient = require('../src/api/BinanceClient');
const nock = require('nock');
const logger = require('../src/utils/Logger');

// Configuration
const BASE_URL = 'https://api.binance.com';

describe('BinanceClient', () => {
    let client;

    beforeAll(() => {
        // Create client instance (API key from env or mock)
        process.env.BINANCE_API_KEY = 'test_key';
        process.env.BINANCE_API_SECRET = 'test_secret';
        client = new BinanceClient(BASE_URL);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    test('Should filter zero balances correctly', async () => {
        // Mock response
        const mockResponse = {
            balances: [
                { asset: 'BTC', free: '0.00100000', locked: '0.00000000' },
                { asset: 'LTC', free: '0.00000000', locked: '0.00000000' },
                { asset: 'ETH', free: '0.00000000', locked: '0.10000000' },
                { asset: 'USDT', free: '100.00000000', locked: '50.00000000' }
            ]
        };

        // Setup Nock
        nock(BASE_URL)
            .get('/api/v3/account')
            .query(true) // match all query params (timestamp, signature)
            .reply(200, mockResponse);

        const balances = await client.getBalances();

        expect(balances).toHaveLength(3);
        const assets = balances.map(b => b.asset);
        expect(assets).toContain('BTC');
        expect(assets).toContain('ETH');
        expect(assets).toContain('USDT');
        expect(assets).not.toContain('LTC');
    });

    test('Should handle API errors gracefully', async () => {
        nock(BASE_URL)
            .get('/api/v3/account')
            .query(true)
            .reply(401, { code: -2015, msg: 'Invalid API-key, IP, or permissions for action.' });

        await expect(client.getBalances()).rejects.toThrow();
    });

    /**
     * Live API Verification
     * Run with: npm run test:live
     * or jest -t "Real API Verification"
     */
    describe('Real API Verification', () => {
        // Skip if not explicitly requested or if keys are missing
        const runLive = process.argv.includes('--live') || process.env.RUN_LIVE_TEST === 'true';

        // Dynamic skip
        (runLive ? test : test.skip)('Should connect to real Binance API', async () => {
            console.log('Connecting to Real Binance API...');

            // Re-instantiate to ensure we pick up real env vars if changed
            const liveClient = new BinanceClient();

            if (!process.env.BINANCE_API_KEY || process.env.BINANCE_API_KEY === 'test_key') {
                console.warn('Skipping live test: Invalid or Missing API Key in .env');
                return;
            }

            try {
                const balances = await liveClient.getBalances();
                console.log('Live Connection Success. Balances:', balances.length);
                expect(Array.isArray(balances)).toBe(true);
            } catch (error) {
                console.error('Live Connection Failed:', error.message);
                throw error;
            }
        });
    });
});
