import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { DynamicBtn, TextDynamic } from 'abzed-utils';
import { ROUTES } from '../routes';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { userRole, isActive } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);

        return () => clearTimeout(timer);
    }, []);

    const handleGoBack = () => {
        if (!isActive) {
            navigate(ROUTES.AUTH.LOGIN);
            return;
        }
        navigate(userRole?.toUpperCase() === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen fx_center bg-gray-50">
                <div className="fx_col_center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
                    <TextDynamic
                        tagName="p"
                        text="Loading..."
                        color="#4b5563"
                        className="txt_875"
                    />
                </div>
            </div>
        );
    }

    const primaryLabel = !isActive
        ? 'Login'
        : userRole?.toUpperCase() === 'ADMIN'
          ? 'Go to Dashboard'
          : 'Go Home';

    return (
        <div className="min-h-screen fx_center bg-gray-50 px-4 py-12">
            <div className="fx_col_center w-full max-w-md gap-8 text-center">
                <div className="fx_col_center gap-2">
                    <TextDynamic
                        tagName="h1"
                        text="403"
                        color="#ef4444"
                        className="txt_3_5_bold"
                    />
                    <TextDynamic
                        tagName="h2"
                        text="Access Denied"
                        color="#111827"
                        className="txt_1_5_bold"
                    />
                    <TextDynamic
                        tagName="p"
                        text="You don't have permission to access this page."
                        color="#4b5563"
                        className="txt_875"
                    />
                    <TextDynamic
                        tagName="p"
                        color="#6b7280"
                        className="txt_8125"
                        text={
                            <>
                                Your role:{' '}
                                <span className="txt_8125_semi">
                                    {userRole || 'Unknown'}
                                </span>
                            </>
                        }
                    />
                </div>

                <div className="fx_col w-full gap-3">
                    <DynamicBtn
                        type="button"
                        text={primaryLabel}
                        onClick={handleGoBack}
                        className="primary_btn"
                        width="100%"
                    />
                    <DynamicBtn
                        type="button"
                        text="Go Back"
                        onClick={() => navigate(-1)}
                        className="cancel_btn"
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
