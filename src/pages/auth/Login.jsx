import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../actions/auth';
import { logoutStateFn } from '../../features/auth/authSlice';
import { useFormMutation } from '../../hooks';
import { tokenService } from '../../services/tokenService';
import { LoginFormComponent } from './components';

export default function Login() {
    const dispatch = useDispatch();
    const { form, onFinish, isProcessing } = useFormMutation(loginAction);

    useEffect(() => {
        tokenService.clear();
        dispatch(logoutStateFn());
    }, [dispatch]);

    return (
        <LoginFormComponent form={form} onFinish={onFinish} isProcessing={isProcessing} />
    );
}
