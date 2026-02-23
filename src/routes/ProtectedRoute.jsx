import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './paths';

const ProtectedRoute = () => {
    const { isActive } = useSelector((state) => state.auth);

    return isActive ? <Outlet /> : <Navigate to={ROUTES.AUTH.LOGIN} replace />;
};

export default ProtectedRoute;
