import projectLogo from './assets/img/logo.png';
import {
    errorNotification,
    successNotification,
} from './components/notifications/toastNotification';

export const url = import.meta.env.VITE_API_URL;
export const logoutUrl = import.meta.env.VITE_LOGOUT_URL;
export const logo = projectLogo;
export const defaultTimer = Number.parseInt(import.meta.env.VITE_DEFAULT_TIMER, 10) || 10;

export const notifySuccess = (message) => {
    successNotification(message);
};

export const notifyError = (message) => {
    errorNotification(message);
};
