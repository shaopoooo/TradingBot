const axios = require('axios');
const Auth = require('./auth');
const logger = require('../utils/Logger');
require('dotenv').config();

class BinanceClient {
    constructor(baseURL = 'https://api.binance.com') {
        this.baseURL = baseURL;
        this.apiKey = process.env.BINANCE_API_KEY;
        this.apiSecret = process.env.BINANCE_API_SECRET;

        // Initialize axios instance with default config
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'X-MBX-APIKEY': this.apiKey,
                'Content-Type': 'application/json'
            }
        });

        // Add interceptor for error logging
        this.client.interceptors.response.use(
            response => response,
            error => {
                const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
                logger.error(`Binance API Error: ${errorMsg}`);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Send a signed GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     */
    async privateGet(endpoint, params = {}) {
        if (!this.apiKey || !this.apiSecret) {
            throw new Error('API Key and Secret are required for private endpoints');
        }

        const timestamp = Date.now();
        const queryString = new URLSearchParams({ ...params, timestamp }).toString();
        const signature = Auth.sign(queryString, this.apiSecret);

        const fullQuery = `${queryString}&signature=${signature}`;

        try {
            const response = await this.client.get(`${endpoint}?${fullQuery}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Fetch current account balances
     * @returns {Promise<Array>} - List of non-zero assets e.g. [{ asset: 'BTC', free: '0.01', locked: '0.00' }]
     */
    async getBalances() {
        try {
            logger.info('Fetching account balances...');
            const data = await this.privateGet('/api/v3/account');

            // Filter only non-zero balances for cleaner output
            const balances = data.balances.filter(b => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0);

            logger.info(`Fetched ${balances.length} active balances.`);
            return balances;
        } catch (error) {
            logger.error(`Failed to fetch balances: ${error.message}`);
            throw error;
        }
    }
}

module.exports = BinanceClient;
