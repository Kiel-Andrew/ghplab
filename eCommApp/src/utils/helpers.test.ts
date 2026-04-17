import { describe, it, expect } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers.formatPrice', () => {
    it.each([
        [0, '$0.00'],
        [1, '$1.00'],
        [2, '$2.00'],
        [3, '$3.00'],
        [4, '$4.00'],
        [5, '$5.00'],
        [6, '$6.00'],
        [7, '$7.00'],
        [8, '$8.00'],
        [9, '$9.00'],
        [10, '$10.00'],
        [11, '$11.00'],
        [12, '$12.00'],
        [13, '$13.00'],
        [14, '$14.00'],
        [15, '$15.00'],
        [16, '$16.00'],
        [17, '$17.00'],
        [18, '$18.00'],
        [19, '$19.00'],
        [20, '$20.00'],
        [25.5, '$25.50'],
        [30.75, '$30.75'],
        [99.99, '$99.99'],
        [100, '$100.00'],
        [999, '$999.00'],
        [1000, '$1,000.00'],
        [12345, '$12,345.00'],
        [2500000, '$2,500,000.00'],
        [-1, '-$1.00'],
    ])('formats %d as %s', (input, expected) => {
        expect(formatPrice(input)).toBe(expected);
    });
});

describe('helpers.calculateTotal', () => {
    it.each([
        [[], 0],
        [[{ price: 1, quantity: 1 }], 1],
        [[{ price: 2, quantity: 3 }], 6],
        [[{ price: 5, quantity: 2 }], 10],
        [[{ price: 10, quantity: 0 }], 0],
        [[{ price: 0, quantity: 10 }], 0],
        [[{ price: 1.5, quantity: 2 }], 3],
        [[{ price: 2.25, quantity: 4 }], 9],
        [[{ price: 19.99, quantity: 1 }], 19.99],
        [[{ price: 19.99, quantity: 2 }], 39.98],
        [[{ price: 3, quantity: 3 }, { price: 4, quantity: 2 }], 17],
        [[{ price: 1, quantity: 1 }, { price: 1, quantity: 1 }, { price: 1, quantity: 1 }], 3],
        [[{ price: 100, quantity: 1 }, { price: 50, quantity: 2 }], 200],
        [[{ price: 9.99, quantity: 5 }, { price: 0.01, quantity: 1 }], 49.96],
        [[{ price: 12.5, quantity: 8 }], 100],
        [[{ price: 7.5, quantity: 4 }, { price: 2.5, quantity: 4 }], 40],
        [[{ price: 2500, quantity: 2 }, { price: 1250, quantity: 4 }], 10000],
        [[{ price: -10, quantity: 1 }], -10],
        [[{ price: -10, quantity: 1 }, { price: 20, quantity: 1 }], 10],
        [[{ price: 0.1, quantity: 3 }, { price: 0.2, quantity: 2 }], 0.7000000000000001],
    ])('calculates total for %j as %d', (items, expected) => {
        expect(calculateTotal(items)).toBe(expected);
    });
});

describe('helpers.validateEmail', () => {
    it.each([
        'a@b.co',
        'john@example.com',
        'jane.doe@example.com',
        'user+tag@example.com',
        'user_name@example.com',
        'user-name@example.com',
        'u123@example123.com',
        'first.last@sub.domain.com',
        'x@y.zw',
        'abc@domain.io',
        'abc123@domain.dev',
        'abc_def@domain.org',
        'abc-def@domain.net',
        'abc+def@domain.ai',
        'one.two.three@domain.co.uk',
        'local.part@domain.travel',
        'name@company.jobs',
        'name@dept.company.com',
        'n@d.us',
        'long.email.address@long-domain-name.example',
    ])('accepts valid email %s', (email) => {
        expect(validateEmail(email)).toBe(true);
    });

    it.each([
        '',
        'plainaddress',
        '@missinglocal.com',
        'missingatsign.com',
        'missingdomain@',
        'missingdot@domain',
        'a b@domain.com',
        'ab@do main.com',
        'ab@domain .com',
        'ab@@domain.com',
        'ab@',
        '@domain.com',
        'ab@.com',
        'ab@com',
        'ab@domain,com',
        'ab@domain/com',
        'ab@domain',
        'ab@domain.',
        ' space@domain.com',
        'space@domain.com ',
        'ab\t@domain.com',
    ])('rejects invalid email %s', (email) => {
        expect(validateEmail(email)).toBe(false);
    });
});
