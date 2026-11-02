import { AntdForm, DynamicBtn, FormInputEmail } from 'abzed-utils';
import { ROUTES } from '../../../routes';
import { MailSvg } from '../../../svgs';
import AuthCard from './AuthCard';
import AuthLink from './AuthLink';

export default function ForgotPasswordFormComponent({ form, onFinish, isProcessing }) {
    return (
        <AuthCard
            title="Reset your password"
            subtitle="Enter your email and we'll send you a verification code."
            footer={
                <AuthLink
                    prompt="Remember your password?"
                    text="Log in"
                    to={ROUTES.AUTH.LOGIN}
                />
            }
        >
            <AntdForm form={form} handleSubmit={onFinish} formName="forgot-password">
                <div className="w-full fx_col gap-4">
                    <FormInputEmail
                        label="Email"
                        inputName="email"
                        inputClassName="primary_input"
                        placeholder="email@example.com"
                        prefix={<MailSvg className="text-text-muted" />}
                    />
                </div>

                <div className="mt-6">
                    <DynamicBtn
                        loading={isProcessing}
                        type="submit"
                        text="Send code"
                        className="primary_btn"
                        width="100%"
                    />
                </div>
            </AntdForm>
        </AuthCard>
    );
}
