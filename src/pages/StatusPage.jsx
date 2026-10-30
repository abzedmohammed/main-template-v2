import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DynamicBtn, TextDynamic } from 'abzed-utils';
import { ROUTES } from '../routes';

// Where "home" is for the current visitor: login when signed out, the dashboard for admins.
const getHomeTarget = ({ isActive, userRole }) => {
    if (!isActive) return { path: ROUTES.AUTH.LOGIN, label: 'Login' };
    if (userRole?.toUpperCase() === 'ADMIN') {
        return { path: ROUTES.DASHBOARD, label: 'Go to Dashboard' };
    }
    return { path: ROUTES.HOME, label: 'Go Home' };
};

// Shared full-screen shell for the 403 / 404 / error pages.
export default function StatusPage({
    code,
    codeColor = '#1f2937',
    title,
    message,
    footer,
}) {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const home = getHomeTarget(auth);

    return (
        <div className="min-h-screen fx_center bg-gray-50 px-4 py-12">
            <div className="fx_col_center w-full max-w-md gap-8 text-center">
                <div className="fx_col_center gap-2">
                    <TextDynamic
                        tagName="h1"
                        text={code}
                        color={codeColor}
                        className="txt_3_5_bold"
                    />
                    <TextDynamic
                        tagName="h2"
                        text={title}
                        color="#111827"
                        className="txt_1_5_bold"
                    />
                    <TextDynamic
                        tagName="p"
                        text={message}
                        color="#4b5563"
                        className="txt_875"
                    />
                    {footer}
                </div>

                <div className="fx_col w-full gap-3">
                    <DynamicBtn
                        type="button"
                        text={home.label}
                        onClick={() => navigate(home.path)}
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
}
