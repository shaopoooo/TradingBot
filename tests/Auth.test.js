const Auth = require('../src/api/auth');

describe('Signature Module (HMAC-SHA256)', () => {
    test('Should generate correct signature for Binance example data', () => {
        const queryString = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559';
        const apiSecret = 'NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClg65XAbvqqM6A7H5fATj0j8';
        const expectedSignature = '20fce4e3d01228d2eb1b7816900f698bf90a0cf31165101de156deea66f3b752'; // Verified via OpenSSL

        const signature = Auth.sign(queryString, apiSecret);
        expect(signature).toBe(expectedSignature);
    });

    test('Should match standard RFC 4231 test vector', () => {
        const key = 'key';
        const data = 'The quick brown fox jumps over the lazy dog';
        const expected = 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8';

        const result = Auth.sign(data, key);
        expect(result).toBe(expected);
    });

    test('Should throw error on missing input', () => {
        expect(() => Auth.sign('', 'secret')).toThrow();
        expect(() => Auth.sign('data', '')).toThrow();
    });
});
