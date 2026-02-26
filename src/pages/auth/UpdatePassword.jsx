import { Form } from 'antd';
import { AuthLogoComponent, PasswordFormComponent } from './components';
import { validatePassword } from 'abzed-utils';
import { notifyError } from '../../utils';
import { updatePasswordAction } from '../../actions/authActions';
import { useAuthFormMutation } from './hooks';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

export default function UpdatePassword() {
    const [form] = Form.useForm();
    const watchedValues = Form.useWatch([], form);

    const { userId } = useSelector((state) => state.auth);

    const { saveMutation: requestMutation, isProcessing } =
        useAuthFormMutation(updatePasswordAction);

    if (!userId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    const onFinish = (values) => {
        const isPasswordValid = validatePassword(values.usrEncryptedPassword);

        if (typeof isPasswordValid === 'string') {
            return notifyError(isPasswordValid);
        }

        if (
            values.usrEncryptedPassword.trim() !== values.usrEncryptedPasswordAlt.trim()
        ) {
            return notifyError('Passwords do not match');
        }

        requestMutation.mutate({
            usrId: userId,
            usrEncryptedPassword: values.usrEncryptedPassword,
        });
    };

    return (
        <div className="auth_main_alt">
            <div className="auth_main_alt_component">
                <AuthLogoComponent>
                    <PasswordFormComponent
                        form={form}
                        onFinish={onFinish}
                        headerText="Create Password"
                        subHeaderText="Let's create a password to secure your account."
                        isProcessing={isProcessing}
                        watchedValues={watchedValues}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
