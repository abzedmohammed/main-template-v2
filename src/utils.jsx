import projectLogo from './assets/img/logo.png';
import { onError as onErrorBase, onSuccess as onSuccessBase } from 'abzed-utils';
import {
    errorNotification,
    infoNotification,
    successNotification,
} from './components/notifications/toastNotification';

export const url = import.meta.env.VITE_API_URL;
export const logoutUrl = import.meta.env.VITE_LOGOUT_URL;
export const logo = projectLogo;
export const defaultTimer = Number.parseInt(import.meta.env.VITE_DEFAULT_TIMER, 10) || 10;

export const onSuccess = (message) => {
    onSuccessBase(message, successNotification);
};

export const onInfo = (message) => {
    onSuccessBase(message, infoNotification);
};

export const onError = (message) => {
    onErrorBase(message, errorNotification);
};

export const notifySuccess = onSuccess;
export const notifyError = onError;
