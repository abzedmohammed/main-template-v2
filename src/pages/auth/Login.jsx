import {
    AuthLogoComponent,
    AuthSideComponent,
    LoginFormComponent,
} from './auth_components';
import { Form } from 'antd';
import { useDynamicMutation } from 'abzed-utils';
import { loginAction } from '../../actions/authActions';
import { notifyError } from '../../utils';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutStateFn } from '../../features/auth/authSlice';
import { tokenService } from '../../services/tokenService';

export default function Login() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const requestMutation = useDynamicMutation({
        mutationFn: loginAction.mutationFn,
        onError: notifyError,
        onSuccess: loginAction.onSuccess,
    });

    const onFinish = (params) => {
        requestMutation.mutate(params);
    };

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
                        isProcessing={requestMutation.isPending}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
