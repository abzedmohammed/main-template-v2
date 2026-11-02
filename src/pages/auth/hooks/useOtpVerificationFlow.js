import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { accountResendOtp } from '../../../actions/auth';
import { useFormMutation } from '../../../hooks';
import { defaultTimer } from '../../../utils';

export const useOtpVerificationFlow = ({ verifyAction }) => {
    const { userId, maskedEmail, otpTimer } = useSelector((state) => state.auth);
    const resendSeconds = otpTimer ?? defaultTimer;

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(resendSeconds);

    const verify = useFormMutation({
        action: verifyAction,
        beforeSubmit: () => Boolean(userId),
        options: { mapValues: () => ({ reqId: userId, otp }) },
    });

    const resend = useFormMutation(accountResendOtp, {
        mapValues: () => ({ reqId: userId }),
        successToast: () => setTimer(resendSeconds),
    });

    const handleResendOtp = useCallback(() => {
        if (!userId || timer > 0 || resend.isProcessing) {
            return;
        }

        resend.onFinish({});
    }, [resend, timer, userId]);

    const handleVerifyOtp = useCallback(() => verify.onFinish({}), [verify]);

    useEffect(() => {
        if (timer <= 0) {
            return undefined;
        }

        const intervalId = setInterval(() => {
            setTimer((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer]);

    return {
        form: verify.form,
        userId,
        maskedEmail,
        timer,
        setOtp,
        handleResendOtp,
        handleVerifyOtp,
        isProcessing: verify.isProcessing || resend.isProcessing,
    };
};
