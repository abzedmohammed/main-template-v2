import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import './App.css';
import './text.css';
import './antd.css';
import { router, createRoleBasedRouter } from './routes/router';

const App = () => {
	const { userRole, isActive } = useSelector((state) => state.auth);

	const dynamicRouter = useMemo(() => {
		if (isActive && userRole) {
			return createRoleBasedRouter(userRole);
		}
		return router;
	}, [userRole, isActive]);

	return <RouterProvider router={dynamicRouter} />;
};

export default App;
