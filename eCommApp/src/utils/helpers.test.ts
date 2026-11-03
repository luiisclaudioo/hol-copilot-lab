import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers', () => {
    it('formats prices as US currency', () => {
        expect(formatPrice(12.5)).toBe('$12.50');
        expect(formatPrice(0)).toBe('$0.00');
    });

    it('calculates the total for multiple items', () => {
        expect(calculateTotal([
            { price: 10, quantity: 2 },
            { price: 2.5, quantity: 4 }
        ])).toBe(30);
        expect(calculateTotal([])).toBe(0);
    });

    it('validates email addresses', () => {
        expect(validateEmail('luis@example.com')).toBe(true);
        expect(validateEmail('invalid-email')).toBe(false);
        expect(validateEmail('missing@domain')).toBe(false);
    });
});
