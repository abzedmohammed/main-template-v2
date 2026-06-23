import { Unauthorized } from '../pages';
import { adminRoutes } from './adminRoutes';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';

export const ROLE_ROUTE_MAPPING = {
    ADMIN: [...adminRoutes],
};

// Authenticated users whose role has no route tree are locked out — every path
// renders Unauthorized. (Unauthenticated users get the public routes instead.)
const lockedOutRoutes = [{ path: '*', element: <Unauthorized /> }];

export const getRoutesForRole = (userRole) => {
    if (!userRole) {
        return [...authRoutes, ...homeRoutes];
    }

    return ROLE_ROUTE_MAPPING[userRole.toUpperCase()] ?? lockedOutRoutes;
};
