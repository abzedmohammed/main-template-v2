import { adminRoutes } from './adminRoutes';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';

export const ROLE_ROUTE_MAPPING = {
    ADMIN: [...adminRoutes],
};

export const getRoutesForRole = (userRole) => {
    if (!userRole) {
        return [...authRoutes, ...homeRoutes];
    }

    return ROLE_ROUTE_MAPPING[userRole.toUpperCase()] || [...authRoutes, ...homeRoutes];
};
