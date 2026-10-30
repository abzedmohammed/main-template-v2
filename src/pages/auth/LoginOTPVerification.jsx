import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { accountVerification } from '../../actions/auth';
import { OTPFormComponent } from './components';
import { useOtpVerificationFlow } from './hooks/useOtpVerificationFlow';

export default function LoginOTPVerification() {
     const {
        form,
        userId,
        maskedEmail,
        timer,
        setOtp,
        handleResendOtp,
        handleVerifyOtp,
        isProcessing,
    } = useOtpVerificationFlow({ verifyAction: accountVerification });

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
            title="Secure Your Sanctuary"
        />
    );
}
