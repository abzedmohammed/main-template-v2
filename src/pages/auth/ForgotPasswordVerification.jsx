import { Navigate } from 'react-router-dom';
import { forgotPasswordVerificationAction } from '../../actions/auth';
import { ROUTES } from '../../routes';
import { OTPFormComponent } from './components';
import { useOtpVerificationFlow } from './hooks';

export default function ForgotPasswordVerification() {
    const { userId, ...otp } = useOtpVerificationFlow({
        verifyAction: forgotPasswordVerificationAction,
    });

    if (!userId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return (
        <OTPFormComponent
            title="Reset your password"
            form={otp.form}
            setOtp={otp.setOtp}
            onFinish={otp.handleVerifyOtp}
            isProcessing={otp.isProcessing}
            handleResendOtp={otp.handleResendOtp}
            timer={otp.timer}
            maskedEmail={otp.maskedEmail}
        />
    );
}
