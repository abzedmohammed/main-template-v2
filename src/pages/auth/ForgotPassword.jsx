import { Form } from 'antd';
import {
	AuthLogoComponent,
	ForgotPasswordFormComponent,
} from './auth_components';
import { useDynamicMutation } from "abzed-utils";
import { forgotPasswordAction } from '../../actions/authActions';
import { notifyError } from '../../utils';

export default function ForgotPassword() {

	const [form] = Form.useForm();

	const requestMutation = useDynamicMutation({
		mutationFn: forgotPasswordAction.mutationFn,
		onError: notifyError,
		onSuccess: forgotPasswordAction.onSuccess,
	});

	async function onFinish(params) {
		requestMutation.mutate(params);
	}

	return (
		<div className='auth_main_alt'>
			<div className='auth_main_alt_component'>
				<AuthLogoComponent
					component={
						<ForgotPasswordFormComponent
							form={form}
							onFinish={onFinish}
							isProcessing={requestMutation.isPending}
						/>
					}
				/>
			</div>
		</div>
	);
}
