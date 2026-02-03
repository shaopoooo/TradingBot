const Auth = require('../src/api/auth');
const assert = require('assert');

console.log('Running Verification: Auth.js');

try {
    // Test Case 1: Binance Example Data
    // We utilize the inputs typically found in Binance docs.
    // Inputs:
    // queryString: symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559
    // secret: NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClg65XAbvqqM6A7H5fATj0j8
    // 
    // The expected signature was independently verified using `openssl dgst -sha256 -hmac ...`
    // Command: echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClg65XAbvqqM6A7H5fATj0j8"
    // Result: 20fce4e3d01228d2eb1b7816900f698bf90a0cf31165101de156deea66f3b752

    const queryString = 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559';
    const apiSecret = 'NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClg65XAbvqqM6A7H5fATj0j8';
    const expectedSignature = '20fce4e3d01228d2eb1b7816900f698bf90a0cf31165101de156deea66f3b752';

    const signature = Auth.sign(queryString, apiSecret);

    console.log(`Test 1 (Binance Data - Verified via OpenSSL)`);
    console.log(`Generated: ${signature}`);
    console.log(`Expected:  ${expectedSignature}`);
    assert.strictEqual(signature, expectedSignature, 'Signature mismatch for Binance example data');
    console.log('PASS: Binance Example Data');

    // Test Case 2: RFC 4231 Test Vector (Simple)
    // Key: "key"
    // Data: "The quick brown fox jumps over the lazy dog"
    // Expected: f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8
    const standardKey = 'key';
    const standardData = 'The quick brown fox jumps over the lazy dog';
    const standardExpected = 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8';

    const standardResult = Auth.sign(standardData, standardKey);
    console.log(`\nTest 2 (Standard Vector)`);
    assert.strictEqual(standardResult, standardExpected, 'Signature mismatch for Standard Vector');
    console.log('PASS: Standard Vector');

    console.log('\nVerification SUCCESS');

} catch (err) {
    console.error('Verification FAILED');
    console.error(err);
    process.exit(1);
}
