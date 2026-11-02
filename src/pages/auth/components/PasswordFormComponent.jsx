import { Form } from 'antd';
import { AntdForm, DynamicBtn, FormInputPassword } from 'abzed-utils';
import { ROUTES } from '../../../routes';
import { KeySvg, LockSvg } from '../../../svgs';
import { confirmPasswordRule, passwordStrengthRule } from '../../../utils';
import AuthCard from './AuthCard';
import AuthLink from './AuthLink';
import PasswordChecklist from './PasswordChecklist';

export default function PasswordFormComponent({ form, onFinish, isProcessing }) {
    const password = Form.useWatch('password', form) || '';

    return (
        <AuthCard
            title="Create a new password"
            subtitle="Choose a strong password to secure your account."
            footer={
                <AuthLink
                    prompt="Remember your password?"
                    text="Log in"
                    to={ROUTES.AUTH.LOGIN}
                />
            }
        >
            <AntdForm form={form} handleSubmit={onFinish} formName="update-password">
                <div className="w-full fx_col gap-4">
                    <FormInputPassword
                        label="New password"
                        inputName="password"
                        inputClassName="primary_input"
                        placeholder="••••••••"
                        prefix={<KeySvg className="text-text-muted" />}
                        extraRules={[passwordStrengthRule]}
                    />

                    <FormInputPassword
                        label="Confirm password"
                        inputName="confirmPassword"
                        inputClassName="primary_input"
                        placeholder="••••••••"
                        prefix={<LockSvg className="text-text-muted" />}
                        extraRules={[confirmPasswordRule]}
                    />

                    <PasswordChecklist password={password} />
                </div>

                <div className="mt-6">
                    <DynamicBtn
                        loading={isProcessing}
                        type="submit"
                        text="Update password"
                        className="primary_btn"
                        width="100%"
                    />
                </div>
            </AntdForm>
        </AuthCard>
    );
}
