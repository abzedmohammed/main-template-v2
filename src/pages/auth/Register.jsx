import { RegisterFormComponent } from './components';
import { registerAction } from '../../actions/auth';
import { useFormMutation } from '../../hooks';

export default function Register() {
    const { form, onFinish, isProcessing } = useFormMutation(registerAction, {
        mapValues: (values) => {
            const payload = { ...values };
            delete payload.confirmPassword;
            return payload;
        },
        successToast: ({ form: currentForm }) => {
            currentForm.resetFields();
        },
    });

    return (
        <main className="auth_card">
            <RegisterFormComponent
                form={form}
                onFinish={onFinish}
                isProcessing={isProcessing}
            />
        </main>
    );
}
