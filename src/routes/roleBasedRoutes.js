import { adminRoutes } from "./adminRoutes";
import { authRoutes } from "./authRoutes";
import { homeRoutes } from "./homeRoutes";

export const ROLE_ROUTE_MAPPING = {
	ADMIN: [...adminRoutes],
};

export const getRoutesForRole = (userRole) => {
	if (!userRole) {
		return [...authRoutes, ...homeRoutes];
	}

	return ROLE_ROUTE_MAPPING[userRole.toUpperCase()] || [...authRoutes];
};

export const hasRouteAccess = (userRole, routePath) => {
	const allowedRoutes = getRoutesForRole(userRole);

	const checkRouteAccess = (routes, path) => {
		return routes.some((route) => {
			if (route.path === path) return true;
			if (route.children) {
				return checkRouteAccess(route.children, path);
			}
			return false;
		});
	};

	return checkRouteAccess(allowedRoutes, routePath);
};
