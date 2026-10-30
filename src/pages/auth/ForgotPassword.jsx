import { ForgotPasswordFormComponent } from './components';
import { forgotPasswordAction } from '../../actions/auth';
import { useFormMutation } from '../../hooks';

export default function ForgotPassword() {
    const { form, onFinish, isProcessing } = useFormMutation(forgotPasswordAction);

    return (
        <main className="auth_card">
            <ForgotPasswordFormComponent
                form={form}
                onFinish={onFinish}
                isProcessing={isProcessing}
            />
        </main>
    );
}
