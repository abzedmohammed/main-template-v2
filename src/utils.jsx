import { onError, onSuccess } from "abzed-utils";
import projectLogo from "./assets/img/logo.png";
import {
    errorNotification,
    successNotification,
} from "./components/notifications/toastNotification";

export const url = import.meta.env.VITE_API_URL;
export const defaultTimer = import.meta.env.VITE_DEFAULT_TIMER;
export const logoutUrl = import.meta.env.VITE_LOGOUT_URL;
export const logo = projectLogo;

export const notifySuccess = (message) => {
    onSuccess(message, successNotification);
};

export const notifyError = (message) => {
    onError(message, errorNotification);
};
