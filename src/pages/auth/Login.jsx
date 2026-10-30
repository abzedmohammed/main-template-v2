import { LoginFormComponent } from './components';
import { loginAction } from '../../actions/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutStateFn } from '../../features/auth/authSlice';
import { tokenService } from '../../services/tokenService';
import { useFormMutation } from '../../hooks';

export default function Login() {
    const dispatch = useDispatch();

    const { form, onFinish, isProcessing } = useFormMutation(loginAction);

    useEffect(() => {
        tokenService.clear();
        dispatch(logoutStateFn());
    }, [dispatch]);

    return (
        <main className="auth_card">
            <LoginFormComponent
                form={form}
                onFinish={onFinish}
                isProcessing={isProcessing}
            />
        </main>
    );
}
