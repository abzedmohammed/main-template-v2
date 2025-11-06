import { Form } from 'antd';
import { AuthLogoComponent, PasswordFormComponent } from './auth_components';
import { useDynamicMutation, validatePassword } from "abzed-utils";
import { notifyError } from '../../utils';
import { updatePasswordAction } from '../../actions/authActions';
import { useSelector } from 'react-redux';

export default function UpdatePassword() {
	const [form] = Form.useForm();
	const watchedValues = Form.useWatch([], form);

	const { userId } = useSelector((state) => state.auth);

	const requestMutation = useDynamicMutation({
		mutationFn: updatePasswordAction.mutationFn,
		onError: notifyError,
		onSuccess: updatePasswordAction.onSuccess,
	});

	async function onFinish(values) {
		let isPasswordValid = validatePassword(values.usrEncryptedPassword);

		if (typeof isPasswordValid === 'string') {
			return notifyError(isPasswordValid);
		}

		if (values.usrEncryptedPassword.trim() !== values.usrEncryptedPasswordAlt.trim()) {
			return notifyError('Passwords do not match');
		}

		requestMutation.mutate({
			usrId: userId,
			usrEncryptedPassword: values.usrEncryptedPassword,
		});
	}

	return (
		<div className='w-full h-screen fx_center logo_bg'>
			<div className='w-full md:w-96.5 h-full fx_center pt-[6.26rem] pb-[1.88rem]'>
				<AuthLogoComponent
					component={
						<PasswordFormComponent
							form={form}
							onFinish={onFinish}
							headerText={'Create Password'}
							subHeaderText={
								"Let's create a password to secure your account."
							}
							isProcessing={requestMutation.isPending}
							watchedValues={watchedValues}
						/>
					}
				/>
			</div>
		</div>
	);
}
