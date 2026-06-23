import { createHashRouter } from 'react-router-dom';
import { getRoutesForRole } from './roleBasedRoutes';
import { ROUTES } from './paths';
import { NotFound, Unauthorized } from '../pages';

// Append the shared fallback routes (unauthorized page + 404 catch-all) to any
// route tree, so every router variant handles them identically.
const withFallbacks = (routes) => [
    ...routes,
    { path: ROUTES.UNAUTHORIZED, element: <Unauthorized /> },
    { path: ROUTES.NOT_FOUND, element: <NotFound /> },
    { path: '*', element: <NotFound /> },
];

// Router scoped to a signed-in user's role.
export const createRoleBasedRouter = (userRole) =>
    createHashRouter(withFallbacks(getRoutesForRole(userRole)));

// Default router for signed-out users (public auth + home routes).
export const router = createHashRouter(withFallbacks(getRoutesForRole()));
