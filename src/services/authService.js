import { logoutStateFn } from '../features/auth/authSlice';
import { logoutUrl } from '../utils';
import { ROUTES } from '../routes';
import { tokenService } from './tokenService';

export const authService = {
    logout({ dispatch, redirect = true }) {
        tokenService.clear();
        dispatch(logoutStateFn());

        if (redirect) {
            window.location.assign(logoutUrl);
        }
    },
    redirectToDashboard({ navigate, replace = true }) {
        if (navigate) {
            navigate(ROUTES.DASHBOARD, { replace });
            return;
        }

        window.location.replace(`/#${ROUTES.DASHBOARD}`);
    },
};
