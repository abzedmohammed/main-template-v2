import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { TextDynamic } from 'abzed-utils';
import { ROUTES } from '../routes';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { userRole, isActive } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleGoBack = () => {
        if (!isActive) {
            navigate(ROUTES.AUTH.LOGIN);
            return;
        }
        switch (userRole?.toUpperCase()) {
            case 'ADMIN':
                navigate(ROUTES.DASHBOARD);
                break;
            default:
                navigate(ROUTES.HOME);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <TextDynamic
                        tagName="p"
                        text="Loading..."
                        className="text-gray-600 text-sm"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <TextDynamic
                        tagName="h1"
                        text="403"
                        className="text-9xl font-bold text-red-500"
                    />
                    <TextDynamic
                        tagName="h2"
                        text="Access Denied"
                        className="mt-6 text-3xl font-extrabold text-gray-900"
                    />
                    <TextDynamic
                        tagName="p"
                        text="You don't have permission to access this page."
                        className="mt-2 text-sm text-gray-600"
                    />
                    <TextDynamic
                        tagName="p"
                        className="mt-1 text-xs text-gray-500"
                        text={
                            <>
                                Your role:{' '}
                                <span className="font-semibold">
                                    {userRole || 'Unknown'}
                                </span>
                            </>
                        }
                    />
                </div>

                <div className="mt-8 space-y-4">
                    {!isActive ? (
                        <button
                            onClick={handleGoBack}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={handleGoBack}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Go{' '}
                            {userRole?.toUpperCase() === 'ADMIN'
                                ? 'to Dashboard'
                                : 'Home'}
                        </button>
                    )}

                    <button
                        onClick={() => navigate(-1)}
                        className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
