import { Form } from 'antd';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { accountVerification } from '../../actions/authActions';
import { AuthLogoComponent, OTPFormComponent } from './auth_components';
import { useOtpVerificationFlow } from './hooks/useOtpVerificationFlow';

export default function RegistrationVerificationEmail() {
    const [form] = Form.useForm();

    const { userId, timer, setOtp, handleResendOtp, handleVerifyOtp, isProcessing } =
        useOtpVerificationFlow({
            verifyAction: accountVerification,
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
                        otpText="Enter the code sent to your email"
                        verificationText="Verify Email"
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
