import { AuthLogoComponent, ForgotPasswordFormComponent } from './components';
import { forgotPasswordAction } from '../../actions/authActions';
import { useAuthFormMutation } from './hooks';

export default function ForgotPassword() {
    const { form, onFinish, isProcessing } = useAuthFormMutation(forgotPasswordAction);

    return (
        <div className="auth_main_alt">
            <div className="auth_main_alt_component">
                <AuthLogoComponent>
                    <ForgotPasswordFormComponent
                        form={form}
                        onFinish={onFinish}
                        isProcessing={isProcessing}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
