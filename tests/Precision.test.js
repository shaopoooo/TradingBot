const Precision = require('../src/utils/Precision');

describe('Precision Core', () => {
    test('Basic Arithmetic (0.1 + 0.2 = 0.3)', () => {
        const sum = Precision.add(0.1, 0.2);
        expect(sum).toBe('0.3');
    });

    test('Tick Size Truncation - Price', () => {
        // Rounding down price (123.456, tick 0.01) -> 123.45
        const originalPrice = '123.456';
        const tickSize = '0.01';
        const roundedPrice = Precision.roundToTick(originalPrice, tickSize);
        expect(roundedPrice).toBe('123.45');
    });

    test('Tick Size Truncation - Amount', () => {
        // Rounding down amount (0.001234, step 0.0001) -> 0.0012
        const amount = '0.001234';
        const stepSize = '0.0001';
        const roundedAmount = Precision.roundToTick(amount, stepSize);
        expect(roundedAmount).toBe('0.0012');
    });
});
