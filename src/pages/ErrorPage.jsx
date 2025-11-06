import { useRouteError } from 'react-router-dom';
import ErrorPage404 from './ErrorPage404';
import SystemErrorPage from './SystemErrorPage';
import { HomeLayout } from '../components/layout';

export default function ErrorPage() {
	const error = useRouteError();

	if (error.status === 404) {
		return (
			<>
				<HomeLayout />
				<ErrorPage404 />
			</>
		);
	}

	return (
		<>
			<HomeLayout />
			<SystemErrorPage />
		</>
	);
}
