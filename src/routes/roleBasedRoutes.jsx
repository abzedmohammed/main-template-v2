import { Unauthorized } from '../pages';
import { exampleRoutes } from './exampleRoutes';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';

export const ROLE_ROUTE_MAPPING = {
    ADMIN: [...exampleRoutes],
    USER: [...exampleRoutes],
};

const lockedOutRoutes = [{ path: '*', element: <Unauthorized /> }];

export const getRoutesForRole = (userRole) => {
    if (!userRole) {
        return [...authRoutes, ...homeRoutes];
    }

    return ROLE_ROUTE_MAPPING[userRole.toUpperCase()] ?? lockedOutRoutes;
};
