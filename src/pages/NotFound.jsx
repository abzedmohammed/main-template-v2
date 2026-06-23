import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DynamicBtn, TextDynamic } from 'abzed-utils';
import { ROUTES } from '../routes';

const NotFound = () => {
    const navigate = useNavigate();
    const { isActive, userRole } = useSelector((state) => state.auth);

    const handleGoHome = () => {
        if (!isActive) {
            navigate(ROUTES.AUTH.LOGIN);
            return;
        }
        navigate(userRole?.toUpperCase() === 'ADMIN' ? ROUTES.DASHBOARD : ROUTES.HOME);
    };

    return (
        <div className="min-h-screen fx_center bg-gray-50 px-4 py-12">
            <div className="fx_col_center w-full max-w-md gap-8 text-center">
                <div className="fx_col_center gap-2">
                    <TextDynamic
                        tagName="h1"
                        text="404"
                        color="#1f2937"
                        className="txt_3_5_bold"
                    />
                    <TextDynamic
                        tagName="h2"
                        text="Page Not Found"
                        color="#111827"
                        className="txt_1_5_bold"
                    />
                    <TextDynamic
                        tagName="p"
                        text="The page you’re looking for doesn’t exist or has moved."
                        color="#4b5563"
                        className="txt_875"
                    />
                </div>

                <div className="fx_col w-full gap-3">
                    <DynamicBtn
                        type="button"
                        text={isActive ? 'Go Home' : 'Login'}
                        onClick={handleGoHome}
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

export default NotFound;
