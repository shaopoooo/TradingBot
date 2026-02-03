const Decimal = require('decimal.js');

// Configuration from PROJECT_RULES.md
// Precision: 20, Rounding: ROUND_HALF_UP (4)
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

class Precision {
    static add(a, b) {
        return new Decimal(a).plus(b).toString();
    }

    static sub(a, b) {
        return new Decimal(a).minus(b).toString();
    }

    static mul(a, b) {
        return new Decimal(a).times(b).toString();
    }

    static div(a, b) {
        return new Decimal(a).div(b).toString();
    }

    /**
     * Round value to a specific tick size or step size.
     * @param {string|number} value - The value to round
     * @param {string|number} tickSize - The minimum unit (e.g., 0.01, 0.00001)
     * @param {number} roundingMode - Optional, defaults to ROUND_DOWN (1) for safety in trading
     * @returns {string} - The rounded value as string
     */
    static roundToTick(value, tickSize, roundingMode = Decimal.ROUND_DOWN) {
        const val = new Decimal(value);
        const tick = new Decimal(tickSize);

        // algorithm: val.div(tick).round(mode).times(tick)
        // using the specified rounding mode for the division/integer step
        return val.div(tick).toDecimalPlaces(0, roundingMode).times(tick).toString();
    }

    /**
     * Assert equality with existing Decimal configuration
     */
    static equals(a, b) {
        return new Decimal(a).equals(b);
    }
}

module.exports = Precision;
