import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { hasRouteAccess } from '../routes/roleBasedRoutes';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
	const { userRole, isActive } = useSelector((state) => state.auth);
	const location = useLocation();

	// If user is not authenticated, redirect to login
	if (!isActive) {
		return <Navigate to="/auth/login" replace />;
	}

	// If no specific roles are required, allow access
	if (allowedRoles.length === 0) {
		return children;
	}

	// Check if user's role is in allowed roles
	const hasAccess = allowedRoles.includes(userRole?.toUpperCase()) || 
					 hasRouteAccess(userRole, location.pathname);

	// If user doesn't have access, show 404 or unauthorized page
	if (!hasAccess) {
		return <Navigate to="/404" replace />;
	}

	return children;
};

export default RoleBasedRoute;
