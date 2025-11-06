import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
	const { isActive } = useSelector((state) => state.auth);

	useEffect(() => {}, [isActive]);

	return isActive ? <Outlet /> : <Navigate to='/auth/login' replace />;
};

export default ProtectedRoute;
