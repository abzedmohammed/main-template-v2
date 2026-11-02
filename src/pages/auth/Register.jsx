import { registerAction } from '../../actions/auth';
import { useFormMutation } from '../../hooks';
import { RegisterFormComponent } from './components';

// Send exactly the sign_up contract — confirmPassword stays client-side.
const toPayload = ({ fullName, phone, email, password, agreement }) => ({
    fullName,
    phone,
    email,
    password,
    agreement,
});

export default function Register() {
    const { form, onFinish, isProcessing } = useFormMutation(registerAction, {
        mapValues: toPayload,
    });

    return (
        <RegisterFormComponent
            form={form}
            onFinish={onFinish}
            isProcessing={isProcessing}
        />
    );
}
