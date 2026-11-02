import flags from 'react-phone-number-input/flags';
import { Form } from 'antd';
import {
    AntdForm,
    DynamicBtn,
    FormInput,
    FormInputCheckbox,
    FormInputEmail,
    FormInputPassword,
    FormInputPhone,
} from 'abzed-utils';
import { ROUTES } from '../../../routes';
import { KeySvg, LockSvg, MailSvg, UserSvg } from '../../../svgs';
import {
    acceptTermsRule,
    confirmPasswordRule,
    fullNameRule,
    passwordStrengthRule,
} from '../../../utils';
import AuthCard from './AuthCard';
import AuthLink from './AuthLink';
import PasswordChecklist from './PasswordChecklist';

export default function RegisterFormComponent({ form, onFinish, isProcessing }) {
    const password = Form.useWatch('password', form) || '';

    return (
        <AuthCard
            title="Create an account"
            subtitle="Fill in your details to get started."
            footer={
                <AuthLink
                    prompt="Already have an account?"
                    text="Log in"
                    to={ROUTES.AUTH.LOGIN}
                />
            }
        >
            <AntdForm form={form} handleSubmit={onFinish} formName="register">
                <div className="w-full fx_col gap-4">
                    <FormInput
                        label="Full name"
                        inputName="fullName"
                        inputClassName="primary_input"
                        placeholder="Jane Doe"
                        prefix={<UserSvg className="text-text-muted" />}
                        extraRules={[fullNameRule]}
                    />

                    <FormInputEmail
                        label="Email"
                        inputName="email"
                        inputClassName="primary_input"
                        placeholder="email@example.com"
                        prefix={<MailSvg className="text-text-muted" />}
                    />

                    <FormInputPhone
                        label="Phone number"
                        inputName="phone"
                        inputClassName="primary_input"
                        placeholder="+254 7XX XXX XXX"
                        flags={flags}
                    />

                    <FormInputPassword
                        label="Password"
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

                    <FormInputCheckbox
                        inputName="agreement"
                        className="primary_checkbox"
                        label="I agree to the Terms of Service and Privacy Policy"
                        required={false}
                        extraRules={[acceptTermsRule]}
                    />
                </div>

                <div className="mt-6">
                    <DynamicBtn
                        loading={isProcessing}
                        type="submit"
                        text="Create account"
                        className="primary_btn"
                        width="100%"
                    />
                </div>
            </AntdForm>
        </AuthCard>
    );
}
