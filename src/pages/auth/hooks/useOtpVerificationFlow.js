import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDynamicMutation } from 'abzed-utils';
import { accountResendOtp } from '../../../actions/auth';
import { defaultTimer } from '../../../utils';

export const useOtpVerificationFlow = ({ verifyAction }) => {
    const { userId } = useSelector((state) => state.auth);

    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(defaultTimer);

    const { mutate: verifyOtp, isPending: isVerifying } =
        useDynamicMutation(verifyAction);
    const { mutate: resendOtp, isPending: isResending } =
        useDynamicMutation(accountResendOtp);

    useEffect(() => {
        if (timer <= 0) {
            return undefined;
        }

        const intervalId = setInterval(() => {
            setTimer((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer]);

    const handleResendOtp = useCallback(() => {
        if (!userId || timer > 0 || isResending) {
            return;
        }

        resendOtp(
            { usrId: userId },
            {
                onSuccess: () => {
                    setTimer(defaultTimer);
                },
            }
        );
    }, [isResending, resendOtp, timer, userId]);

    const handleVerifyOtp = useCallback(() => {
        if (!userId) {
            return;
        }

        verifyOtp({
            usrId: userId,
            usrOTP: otp,
        });
    }, [otp, userId, verifyOtp]);

    return {
        userId,
        timer,
        setOtp,
        handleResendOtp,
        handleVerifyOtp,
        isProcessing: isVerifying || isResending,
    };
};
