import { useRouteError } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TextDynamic } from 'abzed-utils';
import StatusPage from './StatusPage';

// 404 — unknown path or /404.
export function NotFound() {
    return (
        <StatusPage
            code="404"
            title="Page Not Found"
            message="The page you’re looking for doesn’t exist or has moved."
        />
    );
}

// 403 — signed in, but the role has no access.
export function Unauthorized() {
    const userRole = useSelector((state) => state.auth.userRole);

    return (
        <StatusPage
            code="403"
            codeColor="#ef4444"
            title="Access Denied"
            message="You don't have permission to access this page."
            footer={
                <TextDynamic
                    tagName="p"
                    color="#6b7280"
                    className="txt_8125"
                    text={
                        <>
                            Your role:{' '}
                            <span className="txt_8125_semi">{userRole || 'Unknown'}</span>
                        </>
                    }
                />
            }
        />
    );
}

// Route `errorElement` — a thrown 404 response or an unexpected render/loader error.
export function ErrorPage() {
    const error = useRouteError();

    if (error?.status === 404) return <NotFound />;

    return (
        <StatusPage
            code="500"
            codeColor="#ef4444"
            title="Something went wrong"
            message="An unexpected error occurred. Please try again."
        />
    );
}
