import { Form } from 'antd';
import { PasswordFormComponent } from './components';
import { validatePassword } from 'abzed-utils';
import { infoToast } from '../../utils';
import { updatePasswordAction } from '../../actions/auth';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { useFormMutation } from '../../hooks';

export default function UpdatePassword() {
    const { userId } = useSelector((state) => state.auth);

    const { form, onFinish, isProcessing } = useFormMutation({
        action: updatePasswordAction,
        options: {
            mapValues: (values) => ({
                reqId: userId,
                password: values.password,
            }),
        },
        beforeSubmit: (values) => {
            const isPasswordValid = validatePassword(values.password);

            if (typeof isPasswordValid === 'string') {
                infoToast(isPasswordValid);
                return false;
            }

            if (values.password.trim() !== values.confirmPassword?.trim()) {
                infoToast('Passwords do not match');
                return false;
            }

            return true;
        },
    });
    
    const watchedValues = Form.useWatch([], form);

    if (!userId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return (
        <main className="auth_card">
            <PasswordFormComponent
                form={form}
                onFinish={onFinish}
                headerText="Create Password"
                subHeaderText="Let's create a password to secure your account."
                isProcessing={isProcessing}
                watchedValues={watchedValues}
            />
        </main>
    );
}
