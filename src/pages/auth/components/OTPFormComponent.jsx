import { AntdForm, OTPInput, DynamicBtn, TextDynamic } from 'abzed-utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';
import { ArrowRightSvg, LockSvg, RefreshSvg } from '../../../svgs';

export default function OTPFormComponent({
   form,
    setOtp,
    onFinish,
    isProcessing,
    handleResendOtp,
    timer,
    maskedEmail,
    title
}) {
    const description = `To protect your private groups, enter the 4-digit code we sent to ${
        maskedEmail || 'your registered contact'
    }.`;

    const resendLabel =
        timer > 0 ? `Resend in 00:${String(timer).padStart(2, '0')}` : 'Resend Code';

    return (
       <main className="w-full max-w-110 fx_col gap-8">
            <div className="fx_col_center text-center gap-2">
                <TextDynamic
                    tagName="h1"
                    text={title}
                    className="txt_1_875_semi"
                    color="var(--color-text)"
                />
                <TextDynamic
                    tagName="p"
                    text={description}
                    className="txt_9375 text-text-muted"
                />
            </div>

            <div className="auth_card p-6 fx_col gap-6">
                <AntdForm form={form} handleSubmit={onFinish} formName="otp">
                    <div className="w-full fx_col gap-5">
                        <div className="fx_btwn_center gap-2">
                            <TextDynamic
                                text="Verification Code"
                                className="txt_875_medium"
                            />
                            <span className="fx_item_center gap-1 txt_75_semi text-privacy-indigo">
                                <LockSvg width="14" height="14" />
                                End-to-End Encrypted
                            </span>
                        </div>

                        <OTPInput setotp={setOtp} length={4} className="sanctuary_otp" />
                    </div>

                    <div className="mt-10">
                        <DynamicBtn
                            loading={isProcessing}
                            type="submit"
                            text="Verify & Enter Sanctuary"
                            icon={<ArrowRightSvg />}
                            iconPlacement="end"
                            className="sanctuary_btn"
                            width="100%"
                        />
                    </div>
                </AntdForm>

                <div className="fx_col_center gap-2 pt-4 border-t border-border">
                    <TextDynamic
                        text="Didn't receive the code?"
                        className="txt_8125"
                        color="var(--color-text-muted)"
                    />
                    <DynamicBtn
                        onClick={handleResendOtp}
                        className="plain_btn"
                        icon={timer > 0 ? undefined : <RefreshSvg />}
                        text={
                            <span
                                className="txt_8125_bold"
                                style={{ color: 'var(--color-privacy-indigo)' }}
                            >
                                {resendLabel}
                            </span>
                        }
                        disabled={timer > 0 || isProcessing}
                    />
                </div>
            </div>

            <div className="fx_center gap-6">
                <Link
                    to={ROUTES.TERMS}
                    className="txt_8125_medium text-text-muted hover:text-text"
                >
                    Help
                </Link>
                <Link
                    to={ROUTES.PRIVACY}
                    className="txt_8125_medium text-text-muted hover:text-text"
                >
                    Privacy
                </Link>
            </div>
        </main>
    );
}
