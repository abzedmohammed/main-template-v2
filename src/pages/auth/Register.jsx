import { Form } from 'antd';
import {
    AuthLogoComponent,
    AuthSideComponent,
    RegisterFormComponent,
} from './auth_components';
import { useDynamicMutation } from 'abzed-utils';
import { registerAction } from '../../actions/authActions';
import { notifyError } from '../../utils';

export default function Register() {
    const [form] = Form.useForm();

    const requestMutation = useDynamicMutation({
        mutationFn: registerAction.mutationFn,
        onError: notifyError,
        onSuccess: registerAction.onSuccess,
    });

    const onFinish = (params) => {
        requestMutation.mutate({ ...params, form });
    };

    return (
        <div className="auth_main">
            <div className="auth_side_component">
                <AuthSideComponent />
            </div>

            <div className="auth_main_component">
                <AuthLogoComponent>
                    <RegisterFormComponent
                        form={form}
                        onFinish={onFinish}
                        isProcessing={requestMutation.isPending}
                    />
                </AuthLogoComponent>
            </div>
        </div>
    );
}
