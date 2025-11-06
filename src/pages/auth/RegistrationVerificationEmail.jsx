import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { defaultTimer, notifyError, notifySuccess } from '../../utils';
import { accountResendOtp, accountVerification } from '../../actions/authActions';
import { useDynamicMutation } from "abzed-utils";
import { useSelector } from 'react-redux';
import { AuthLogoComponent, OTPFormComponent } from './auth_components';

export default function RegistrationVerificationEmail() {
	const [form] = Form.useForm();

	const { userId } = useSelector((state) => state.auth);

	const [timer, setTimer] = useState(defaultTimer);
	const [otp, setotp] = useState('');

	const requestMutation = useDynamicMutation({
		mutationFn: accountVerification.mutationFn,
		onError: notifyError,
		onSuccess: accountVerification.onSuccess,
	});

	const mutationAlt = useDynamicMutation({
		mutationFn: accountResendOtp.mutationFn,
		onSuccess: () => {
			setTimer(defaultTimer);
			notifySuccess('OTP sent successfully');
		},
		onError: notifyError,
	});

	const handleResendOtp = () => {
		mutationAlt.mutate({
			usrId: userId,
		});
	};

	async function onFinish() {
		requestMutation.mutate({
			usrId: userId,
			usrOTP: otp,
		});
	}

	useEffect(() => {
		let interval = null;

		if (timer > 0) {
			interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [timer]);

	// if (!userId) return <Navigate to={'/auth/login'} />;

	return (
		<div className="auth_main_alt">
            <div className="auth_main_alt_component">
                <AuthLogoComponent
                    component={
                        <OTPFormComponent
                            form={form}
                            setotp={setotp}
                            onFinish={onFinish}
                            isProcessing={
                                requestMutation.isPending ||
                                mutationAlt.isPending
                            }
                            handleResendOtp={handleResendOtp}
                            timer={timer}
							otpText='Enter the code sent to your email'
							verificationText='Verify Email'
                        />
                    }
                />
            </div>
        </div>
	);
}
