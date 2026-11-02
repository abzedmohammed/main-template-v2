import { forgotPasswordAction } from '../../actions/auth';
import { useFormMutation } from '../../hooks';
import { ForgotPasswordFormComponent } from './components';

export default function ForgotPassword() {
    const { form, onFinish, isProcessing } = useFormMutation(forgotPasswordAction);

    return (
        <ForgotPasswordFormComponent
            form={form}
            onFinish={onFinish}
            isProcessing={isProcessing}
        />
    );
}
