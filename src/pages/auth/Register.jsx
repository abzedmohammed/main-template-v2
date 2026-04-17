import {
    AuthLogoComponent,
    AuthSideComponent,
    RegisterFormComponent,
} from './components';
import { registerAction } from '../../actions/auth';
import { useAuthFormMutation } from './hooks';

export default function Register() {
    const { form, onFinish, isProcessing } = useAuthFormMutation(registerAction, {
        onSuccess: ({ form: currentForm }) => {
            currentForm.resetFields();
        },
    });

    return (
        <div className="auth_main">
            <div className="auth_side_component">
                <AuthSideComponent />
            </div>

            <div className="auth_main_component">
                <AuthLogoComponent>
                    <RegisterFormComponent
                        form={form}
                        onFinish={onFinish}
                        isProcessing={isProcessing}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
