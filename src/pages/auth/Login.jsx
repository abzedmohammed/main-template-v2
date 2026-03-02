import { AuthLogoComponent, AuthSideComponent, LoginFormComponent } from './components';
import { loginAction } from '../../actions/authActions';
import { useAuthFormMutation } from './hooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutStateFn } from '../../features/auth/authSlice';
import { tokenService } from '../../services/tokenService';

export default function Login() {
    const dispatch = useDispatch();

    const { form, onFinish, isProcessing } = useAuthFormMutation(loginAction);

    useEffect(() => {
        tokenService.clear();
        dispatch(logoutStateFn());
    }, [dispatch]);

    return (
        <div className="auth_main">
            <div className="auth_side_component">
                <AuthSideComponent />
            </div>

            <div className="auth_main_component">
                <AuthLogoComponent>
                    <LoginFormComponent
                        form={form}
                        onFinish={onFinish}
                        isProcessing={isProcessing}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
