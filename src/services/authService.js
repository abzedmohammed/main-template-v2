import { logoutStateFn } from '../features/auth/authSlice';
import { logoutUrl } from '../utils';
import { ROUTES } from '../routes';
import { tokenService } from './tokenService';
import { resetStateObj } from '../features/global/globalSlice';

export const authService = {
    logout({ dispatch, redirect = true }) {
        tokenService.clear();
        dispatch(logoutStateFn());
        dispatch(resetStateObj());

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
