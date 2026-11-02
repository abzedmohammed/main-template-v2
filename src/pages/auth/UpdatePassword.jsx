import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { updatePasswordAction } from '../../actions/auth';
import { useFormMutation } from '../../hooks';
import { ROUTES } from '../../routes';
import { PasswordFormComponent } from './components';

export default function UpdatePassword() {
    const reqId = useSelector((state) => state.auth.userId);

    const { form, onFinish, isProcessing } = useFormMutation(updatePasswordAction, {
        mapValues: ({ password }) => ({ reqId, password }),
    });

    if (!reqId) {
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    return (
        <PasswordFormComponent
            form={form}
            onFinish={onFinish}
            isProcessing={isProcessing}
        />
    );
}
