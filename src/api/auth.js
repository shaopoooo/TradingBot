const crypto = require('crypto');

class Auth {
    /**
     * HMAC-SHA256 signature generation
     * @param {string} queryString - The query string to sign (e.g. "param1=value1&param2=value2")
     * @param {string} apiSecret - The API secret key
     * @returns {string} - The hex-encoded signature
     */
    static sign(queryString, apiSecret) {
        if (!queryString || !apiSecret) {
            throw new Error('Missing queryString or apiSecret for signature');
        }
        return crypto
            .createHmac('sha256', apiSecret)
            .update(queryString)
            .digest('hex');
    }
}

module.exports = Auth;
