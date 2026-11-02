import { Navigate } from 'react-router-dom';
import { accountVerification } from '../../actions/auth';
import { ROUTES } from '../../routes';
import { OTPFormComponent } from './components';
import { useOtpVerificationFlow } from './hooks';

export default function RegistrationVerification() {
    const { userId, ...otp } = useOtpVerificationFlow({
        verifyAction: accountVerification,
    });

    if (!userId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return (
        <OTPFormComponent
            title="Verify your email"
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
