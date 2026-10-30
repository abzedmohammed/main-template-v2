import { Link } from 'react-router-dom';
import { FormInputEmail, AntdForm, DynamicBtn, TextDynamic } from 'abzed-utils';
import { ROUTES } from '../../../routes';
import { MailSvg } from '../../../svgs';

export default function ForgotPasswordFormComponent({ form, onFinish, isProcessing }) {
    return (
        <div className="p-3 md:p-0 fx_col gap-5 mt-5 md:mt-[4.69rem]">
            <div className="fx_col text-center gap-6 mb-[1.88rem]">
                <TextDynamic text={'Reset your password'} className={'txt_1_875_bold'} />

                <TextDynamic
                    tagName="p"
                    text="Enter your email and we'll send a verification code to reset your password."
                    className="txt_9375"
                    color="var(--color-text-muted)"
                />
            </div>

            <AntdForm form={form} handleSubmit={onFinish} formName={'forgot-password'}>
                <FormInputEmail
                    label="Email"
                    inputName="email"
                    inputClassName="primary_input"
                    placeholder="Enter your email"
                    prefix={<MailSvg className="text-text-muted" />}
                />

                <div className="fx_col mt-10 gap-10">
                    <DynamicBtn
                        width={'100%'}
                        className={'primary_btn'}
                        text={'Send code'}
                        type="submit"
                        loading={isProcessing}
                    />

                    <Link className="fx_center" to={ROUTES.AUTH.LOGIN}>
                        <div className="fx_item_center gap-2.5">
                            <span aria-hidden="true">&lt;</span>
                            <TextDynamic
                                color="var(--color-text-muted)"
                                text={'Back to Log in'}
                                className={'txt_8125_semi'}
                            />
                        </div>
                    </Link>
                </div>
            </AntdForm>
        </div>
    );
}
