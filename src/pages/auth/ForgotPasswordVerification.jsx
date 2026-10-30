import { Form } from 'antd';
import { forgotPasswordVerificationAction } from '../../actions/auth';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { OTPFormComponent } from './components';
import { useOtpVerificationFlow } from './hooks/useOtpVerificationFlow';

export default function ForgotPasswordVerification() {
    const [form] = Form.useForm();

    const {
        userId,
        maskedEmail,
        timer,
        setOtp,
        handleResendOtp,
        handleVerifyOtp,
        isProcessing,
    } = useOtpVerificationFlow({
        verifyAction: forgotPasswordVerificationAction,
    });

    if (!userId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return (
        <OTPFormComponent
            form={form}
            setOtp={setOtp}
            onFinish={handleVerifyOtp}
            isProcessing={isProcessing}
            handleResendOtp={handleResendOtp}
            timer={timer}
            maskedEmail={maskedEmail}
            title="Verify your identity"
        />
    );
}
