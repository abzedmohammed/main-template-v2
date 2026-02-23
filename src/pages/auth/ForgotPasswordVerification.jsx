import { Form } from 'antd';
import { forgotPasswordVerificationAction } from '../../actions/authActions';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { AuthLogoComponent, OTPFormComponent } from './auth_components';
import { useOtpVerificationFlow } from './hooks/useOtpVerificationFlow';

export default function ForgotPasswordVerification() {
    const [form] = Form.useForm();

    const { userId, timer, setOtp, handleResendOtp, handleVerifyOtp, isProcessing } =
        useOtpVerificationFlow({
            verifyAction: forgotPasswordVerificationAction,
        });

    if (!userId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return (
        <div className="auth_main_alt">
            <div className="auth_main_alt_component">
                <AuthLogoComponent>
                    <OTPFormComponent
                        form={form}
                        setOtp={setOtp}
                        onFinish={handleVerifyOtp}
                        isProcessing={isProcessing}
                        handleResendOtp={handleResendOtp}
                        timer={timer}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
