import {
    AntdForm,
    FormInputEmail,
    FormInputPassword,
    DynamicBtn,
    TextDynamic,
} from 'abzed-utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';
import { KeySvg, MailSvg } from '../../../svgs';

export default function LoginFormComponent({ form, onFinish, isProcessing }) {
    return (
        <div className="p-3 md:p-0 fx_col gap-5 mt-5 md:mt-[6.69rem]">
            <div className="fx_col text-center gap-6 mb-10">
                <TextDynamic
                    text={'Nice to see you again'}
                    className={'txt_1_875_bold'}
                />
                <TextDynamic
                    color="var(--color-text-muted)"
                    text={'Please fill in your details to access your account'}
                    className={'txt_9375'}
                />
            </div>

            <AntdForm form={form} handleSubmit={onFinish} formName={'login'}>
                <div className="w-full fx_col gap-5">
                    <FormInputEmail
                        label={'Email'}
                        inputClassName={'primary_input'}
                        inputName={'email'}
                        placeholder={'Enter your email'}
                        prefix={<MailSvg className="text-text-muted" />}
                    />

                    <FormInputPassword
                        label={'Password'}
                        inputName="secret"
                        inputClassName="primary_input"
                        placeholder="••••••••"
                        prefix={<KeySvg className="text-text-muted" />}
                    />

                    <div className="w-full ml-auto">
                        <Link
                            to={ROUTES.AUTH.FORGOT_PASSWORD}
                            className="txt_8125_medium"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <div className="fx_col mt-10 gap-10">
                    <DynamicBtn
                        loading={isProcessing}
                        width={'100%'}
                        className={'primary_btn'}
                        text={'Log In'}
                        type="submit"
                    />

                    <TextDynamic
                        text={
                            <span>
                                Don&apos;t have an account?{' '}
                                <Link
                                    className="font-bold underline"
                                    to={ROUTES.AUTH.REGISTER}
                                >
                                    Sign Up
                                </Link>
                            </span>
                        }
                        className={'txt_8125_medium'}
                        color="var(--color-text-muted)"
                    />
                </div>
            </AntdForm>
        </div>
    );
}
