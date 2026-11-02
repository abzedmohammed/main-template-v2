import { logoutStateFn } from '../features/auth/authSlice';
import { logoutUrl } from '../utils';
// From paths, not the routes barrel: the barrel loads the router, which loads this file (cycle).
import { ROUTES } from '../routes/paths';
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
