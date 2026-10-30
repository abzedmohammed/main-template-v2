import flags from 'react-phone-number-input/flags';

import {
    FormInput,
    FormInputCheckbox,
    FormInputEmail,
    FormInputPassword,
    FormInputPhone,
    AntdForm,
    DynamicBtn,
    TextDynamic,
} from 'abzed-utils';
import { Link } from 'react-router-dom';
import { KeySvg, LockSvg, MailSvg, UserSvg } from '../../../svgs';
import { ROUTES } from '../../../routes';
import { Form } from 'antd';
import { acceptTermsRule, confirmPasswordRule, fullNameRule, passwordStrengthRule } from '../../../utils';
import PasswordChecklist from './PasswordChecklist';

const stopToggle = (e) => e.stopPropagation();

const termsLabel = (
    <span>
        I agree to the{' '}
        <Link
            to={ROUTES.TERMS}
            target="_blank"
            rel="noreferrer"
            className="sanctuary_link font-semibold"
            onClick={stopToggle}
        >
            Terms of Service
        </Link>{' '}
        and{' '}
        <Link
            to={ROUTES.PRIVACY}
            target="_blank"
            rel="noreferrer"
            className="sanctuary_link font-semibold"
            onClick={stopToggle}
        >
            Privacy Policy
        </Link>
    </span>
);

export default function RegisterFormComponent({ form, onFinish, isProcessing }) {
    const password = Form.useWatch('password', form) || '';

    return (
        <div className="p-6 fx_col gap-6">
            <div className="fx_col_center text-center gap-1">
                <TextDynamic
                    tagName="h1"
                    text="Create Account"
                    className="txt_1_875_bold"
                />
                <TextDynamic
                    tagName="p"
                    text="Join AbzedConnect to start building your digital sanctuary."
                    className="txt_9375"
                    color="var(--color-text-muted)"
                />
            </div>

            <AntdForm form={form} handleSubmit={onFinish} formName="register">
                <div className="w-full fx_col gap-4">
                    <FormInput
                        label="Full Name"
                        inputName="fullName"
                        inputClassName="primary_input"
                        placeholder="Enter your full name"
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
                        label="Phone Number"
                        inputName="phone"
                        inputClassName="primary_input"
                        placeholder="+254 7XX XXX XXX"
                        prefix={<MailSvg className="text-text-muted" />}
                        flags={flags}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInputPassword
                            label="Password"
                            inputName="password"
                            inputClassName="primary_input"
                            placeholder="••••••••"
                            prefix={<KeySvg className="text-text-muted" />}
                            extraRules={[passwordStrengthRule]}
                        />

                        <FormInputPassword
                            label="Confirm"
                            inputName="confirmPassword"
                            inputClassName="primary_input"
                            placeholder="••••••••"
                            prefix={<LockSvg className="text-text-muted" />}
                            extraRules={[confirmPasswordRule]}
                        />
                    </div>

                    <PasswordChecklist password={password} />

                    <FormInputCheckbox
                        inputName="agreement"
                        className="sanctuary_checkbox"
                        label={termsLabel}
                        required={false}
                        extraRules={[acceptTermsRule]}
                    />
                </div>

                <div className="mt-5">
                    <DynamicBtn
                        loading={isProcessing}
                        type="submit"
                        text="Create Account"
                        className="primary_btn"
                        width="100%"
                    />
                </div>
            </AntdForm>

            <div className="text-center">
                <TextDynamic
                    text={
                        <span>
                            Already have an account?{' '}
                            <Link
                                to={ROUTES.AUTH.LOGIN}
                                className="underline font-semibold"
                            >
                                Login instead
                            </Link>
                        </span>
                    }
                    className="txt_9375"
                    color="var(--color-text-muted)"
                />
            </div>
        </div>
    );
}
