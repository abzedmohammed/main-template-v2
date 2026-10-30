import { Link } from 'react-router-dom';
import { FormInputPassword, DynamicBtn, TextDynamic, AntdForm } from 'abzed-utils';
import { ROUTES } from '../../../routes';
import { PasswordChecklist } from './';
import { KeySvg, LockSvg } from '../../../svgs';

export default function PasswordFormComponent({
    form,
    onFinish,
    text = 'Submit',
    showBackBtn = true,
    headerText,
    subHeaderText,
    isProcessing,
    watchedValues,
}) {
    const pswd = watchedValues?.password || '';

    return (
        <div className="p-3 md:p-0 fx_col gap-[1.88rem] mt-5 md:mt-[5.19rem]">
            <div className="fx_col text-center gap-6">
                <TextDynamic
                    color="#121212"
                    text={headerText}
                    className={'txt_1_875_bold'}
                />
                <TextDynamic
                    color="#3D3D3D"
                    text={subHeaderText}
                    className={'txt_9375'}
                />
            </div>

            <AntdForm form={form} handleSubmit={onFinish} formName={'login'}>
                <div className="w-full fx_col gap-4">
                    <FormInputPassword
                        label="Password"
                        inputName="password"
                        inputClassName="primary_input"
                        placeholder="••••••••"
                        prefix={<KeySvg className="text-text-muted" />}
                    />

                    <FormInputPassword
                        label="Confirm Password"
                        inputName="confirmPassword"
                        inputClassName="primary_input"
                        placeholder="••••••••"
                        prefix={<LockSvg className="text-text-muted" />}
                    />

                    <PasswordChecklist password={pswd} />
                </div>

                <div className="fx_col mt-[1.88rem] gap-[1.88rem]">
                    <DynamicBtn
                        width={'100%'}
                        className={'primary_btn'}
                        text={text}
                        type="submit"
                        loading={isProcessing}
                    />
                    
                    {showBackBtn && (
                        <Link className="fx_center" to={ROUTES.AUTH.LOGIN}>
                            <div className="fx_item_center gap-2.5">
                                <span aria-hidden="true">&lt;</span>
                                <TextDynamic
                                    color="#3D3D3D"
                                    text={'Back to Log in'}
                                    className={'txt_8125_semi'}
                                />
                            </div>
                        </Link>
                    )}
                </div>
            </AntdForm>
        </div>
    );
}
