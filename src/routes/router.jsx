import { createHashRouter } from 'react-router-dom';
import { getRoutesForRole } from './roleBasedRoutes';
import { Unauthorized } from '../pages';

const unauthorizedElement = <Unauthorized />;

// Create a function to generate router based on user role
export const createRoleBasedRouter = (userRole) => {
    const allowedRoutes = getRoutesForRole(userRole);

    // Add the unauthorized route to all routers
    const routesWithUnauthorized = [
        ...allowedRoutes,
        {
            path: '/404',
            element: unauthorizedElement,
        },
        {
            path: '/unauthorized',
            element: unauthorizedElement,
        },
        {
            path: '*',
            element: unauthorizedElement,
        },
    ];

    return createHashRouter(routesWithUnauthorized);
};

// Default router for when user role is not available
const normalUser = getRoutesForRole();

export const router = createHashRouter([
    ...normalUser,
    {
        path: '/404',
        element: unauthorizedElement,
    },
    {
        path: '/unauthorized',
        element: unauthorizedElement,
    },
    {
        path: '*',
        element: unauthorizedElement,
    },
]);
