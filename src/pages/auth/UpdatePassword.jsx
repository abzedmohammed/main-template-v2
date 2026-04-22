import { Form } from 'antd';
import { AuthLogoComponent, PasswordFormComponent } from './components';
import { validatePassword } from 'abzed-utils';
import { onError } from '../../utils';
import { updatePasswordAction } from '../../actions/auth';
import { useAuthFormMutation } from './hooks';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

export default function UpdatePassword() {
    const { userId } = useSelector((state) => state.auth);

    const { form, onFinish, isProcessing } = useAuthFormMutation({
        action: updatePasswordAction,
        options: {
            mapValues: (values) => ({
                usrId: userId,
                usrEncryptedPassword: values.usrEncryptedPassword,
            }),
        },
        beforeSubmit: (values) => {
            const isPasswordValid = validatePassword(values.usrEncryptedPassword);

            if (typeof isPasswordValid === 'string') {
                onError(isPasswordValid);
                return false;
            }

            if (
                values.usrEncryptedPassword.trim() !==
                values.usrEncryptedPasswordAlt.trim()
            ) {
                onError('Passwords do not match');
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
