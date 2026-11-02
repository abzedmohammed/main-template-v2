import { AntdForm, DynamicBtn, FormInputEmail, FormInputPassword } from 'abzed-utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';
import { KeySvg, MailSvg } from '../../../svgs';
import AuthCard from './AuthCard';
import AuthLink from './AuthLink';

export default function LoginFormComponent({ form, onFinish, isProcessing }) {
    return (
        <AuthCard
            title="Welcome back"
            subtitle="Log in to your account to continue."
            footer={
                <AuthLink
                    prompt="Don't have an account?"
                    text="Sign up"
                    to={ROUTES.AUTH.REGISTER}
                />
            }
        >
            <AntdForm form={form} handleSubmit={onFinish} formName="login">
                <div className="w-full fx_col gap-4">
                    <FormInputEmail
                        label="Email"
                        inputName="email"
                        inputClassName="primary_input"
                        placeholder="email@example.com"
                        prefix={<MailSvg className="text-text-muted" />}
                    />

                    <FormInputPassword
                        label="Password"
                        inputName="secret"
                        inputClassName="primary_input"
                        placeholder="••••••••"
                        prefix={<KeySvg className="text-text-muted" />}
                    />

                    <div className="fx justify-end">
                        <Link
                            to={ROUTES.AUTH.FORGOT_PASSWORD}
                            className="auth_link txt_875"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="mt-6">
                    <DynamicBtn
                        loading={isProcessing}
                        type="submit"
                        text="Log in"
                        className="primary_btn"
                        width="100%"
                    />
                </div>
            </AntdForm>
        </AuthCard>
    );
}
