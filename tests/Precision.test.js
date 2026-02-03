const Precision = require('../src/utils/Precision');
const assert = require('assert');

console.log('Running Verification: Precision.js');

try {
    // Test 1: Basic Arithmetic (0.1 + 0.2 = 0.3)
    const sum = Precision.add(0.1, 0.2);
    console.log(`0.1 + 0.2 = ${sum}`);
    assert.strictEqual(sum, '0.3', 'Addition failed: 0.1 + 0.2 should be 0.3');
    console.log('PASS: Basic Arithmetic check');

    // Test 2: Tick Size Truncation
    // Case A: Rounding down price (123.456, tick 0.01) -> 123.45
    const originalPrice = '123.456';
    const tickSize = '0.01';
    const roundedPrice = Precision.roundToTick(originalPrice, tickSize);
    console.log(`Rounding ${originalPrice} with tick ${tickSize} -> ${roundedPrice}`);
    assert.strictEqual(roundedPrice, '123.45', 'RoundToTick failed for 0.01');

    // Case B: Rounding down amount (0.001234, step 0.0001) -> 0.0012
    const amount = '0.001234';
    const stepSize = '0.0001';
    const roundedAmount = Precision.roundToTick(amount, stepSize);
    console.log(`Rounding ${amount} with step ${stepSize} -> ${roundedAmount}`);
    assert.strictEqual(roundedAmount, '0.0012', 'RoundToTick failed for 0.0001');

    console.log('PASS: Tick Size Truncation check');
    console.log('Verification SUCCESS');

} catch (err) {
    console.error('Verification FAILED');
    console.error(err);
    process.exit(1);
}
