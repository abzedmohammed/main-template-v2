import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './paths';

// Guards a route subtree. Unauthenticated users are sent to login; authenticated
// users whose role isn't in `allowedRoles` are sent to the unauthorized page.
// Omit `allowedRoles` to allow any authenticated user.
const ProtectedRoute = ({ allowedRoles }) => {
    const { isActive, userRole } = useSelector((state) => state.auth);

    if (!isActive) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    const roleAllowed =
        !allowedRoles?.length || allowedRoles.includes(userRole?.toUpperCase());

    if (!roleAllowed) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
