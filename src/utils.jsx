import projectLogo from './assets/img/logo.png';
import projectLogoMark from './assets/img/logo.png';
import {
    errorNotification,
    infoNotification,
    successNotification,
} from './components/notifications';
import { validatePassword } from 'abzed-utils';

export const url = import.meta.env.VITE_API_URL;
export const logoutUrl = import.meta.env.VITE_LOGOUT_URL;
export const logo = projectLogo;
export const logoMark = projectLogoMark;
export const defaultTimer = Number.parseInt(import.meta.env.VITE_DEFAULT_TIMER, 10) || 10;


const readEnvNumber = (key, fallback) => {
    const value = Number.parseInt(import.meta.env[key], 10);
    return Number.isFinite(value) ? value : fallback;
};

export const sessionIdleTimeoutMinutes = readEnvNumber(
    'VITE_SESSION_IDLE_TIMEOUT_MINUTES',
    15
);
export const sessionMaxDurationMinutes = readEnvNumber(
    'VITE_SESSION_MAX_DURATION_MINUTES',
    60
);
export const sessionAbsoluteMaxMinutes = readEnvNumber(
    'VITE_SESSION_ABSOLUTE_MAX_MINUTES',
    240
);
export const sessionWarningCountdownSeconds = readEnvNumber(
    'VITE_SESSION_WARNING_COUNTDOWN_SECONDS',
    60
);
export const sessionExpiryCountdownSeconds = readEnvNumber(
    'VITE_SESSION_EXPIRY_COUNTDOWN_SECONDS',
    30
);

export const successToast = (message) => {
    successNotification(message);
};

export const infoToast = (message) => {
    infoNotification(message);
};

export const errorToast = (message) => {
    errorNotification(message);
};

export const fullNameRule = {
    validator: (_, value) => {
        if (!value) return Promise.resolve(); // `required` handles empty
        const parts = value.trim().split(/\s+/).filter(Boolean);
        return parts.length >= 2
            ? Promise.resolve()
            : Promise.reject(new Error('Enter your full name (at least 2 names)'));
    },
};

export const passwordStrengthRule = {
    validator: (_, value) => {
        if (!value) return Promise.resolve(); // `required` handles empty
        const result = validatePassword(value);
        return result === true ? Promise.resolve() : Promise.reject(new Error(result));
    },
};

export const confirmPasswordRule = ({ getFieldValue }) => ({
    validator(_, value) {
        if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords do not match'));
    },
});

export const acceptTermsRule = {
    validator: (_, value) =>
        value
            ? Promise.resolve()
            : Promise.reject(new Error('Please accept the Terms and Privacy Policy')),
};
