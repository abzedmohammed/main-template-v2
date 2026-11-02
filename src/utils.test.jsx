import {
    acceptTermsRule,
    confirmPasswordRule,
    defaultTimer,
    fullNameRule,
    passwordStrengthRule,
} from './utils';

// AntD rule validators resolve to accept and reject with the message to show.
const validate = (rule, value) => rule.validator(null, value);

describe('fullNameRule', () => {
    it('accepts two or more names', async () => {
        await expect(validate(fullNameRule, 'Jane Doe')).resolves.toBeUndefined();
        await expect(
            validate(fullNameRule, '  Jane  Mary Doe ')
        ).resolves.toBeUndefined();
    });

    it('rejects a single name', async () => {
        await expect(validate(fullNameRule, 'Jane')).rejects.toThrow(
            'Enter your full name (at least 2 names)'
        );
    });

    it('leaves empty values to the required rule', async () => {
        await expect(validate(fullNameRule, '')).resolves.toBeUndefined();
    });
});

describe('passwordStrengthRule', () => {
    it('accepts a strong password', async () => {
        await expect(
            validate(passwordStrengthRule, 'Password@123')
        ).resolves.toBeUndefined();
    });

    it('rejects a weak password with the policy message', async () => {
        await expect(validate(passwordStrengthRule, 'weak')).rejects.toThrow();
    });

    it('leaves empty values to the required rule', async () => {
        await expect(validate(passwordStrengthRule, '')).resolves.toBeUndefined();
    });
});

describe('confirmPasswordRule', () => {
    const rule = confirmPasswordRule({ getFieldValue: () => 'Password@123' });

    it('accepts a matching confirmation', async () => {
        await expect(validate(rule, 'Password@123')).resolves.toBeUndefined();
    });

    it('rejects a mismatch', async () => {
        await expect(validate(rule, 'Password@124')).rejects.toThrow(
            'Passwords do not match'
        );
    });
});

describe('acceptTermsRule', () => {
    it('accepts a ticked checkbox', async () => {
        await expect(validate(acceptTermsRule, true)).resolves.toBeUndefined();
    });

    it('rejects an unticked checkbox', async () => {
        await expect(validate(acceptTermsRule, false)).rejects.toThrow(
            'Please accept the Terms and Privacy Policy'
        );
    });
});

describe('defaultTimer', () => {
    it('is a positive number of seconds', () => {
        expect(defaultTimer).toBeGreaterThan(0);
    });
});
