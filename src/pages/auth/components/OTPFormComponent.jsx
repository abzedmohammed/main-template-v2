import { AntdForm, DynamicBtn, OTPInput, TextDynamic } from 'abzed-utils';
import { ROUTES } from '../../../routes';
import AuthCard from './AuthCard';
import AuthLink from './AuthLink';

const pad = (value) => String(value).padStart(2, '0');

// 300 → "05:00"
const formatCountdown = (seconds) =>
    `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

export default function OTPFormComponent({
    title,
    form,
    setOtp,
    onFinish,
    isProcessing,
    handleResendOtp,
    timer,
    maskedEmail,
}) {
    const canResend = timer <= 0 && !isProcessing;

    return (
        <AuthCard
            title={title}
            subtitle={`Enter the 4-digit code we sent to ${maskedEmail || 'your email'}.`}
            footer={<AuthLink text="Back to log in" to={ROUTES.AUTH.LOGIN} />}
        >
            <AntdForm form={form} handleSubmit={onFinish} formName="otp">
                <div className="w-full fx_col gap-4">
                    <OTPInput setotp={setOtp} length={4} />

                    <div className="fx_center gap-1">
                        <TextDynamic
                            text="Didn't receive the code?"
                            className="txt_875"
                            color="var(--color-text-muted)"
                        />
                        <DynamicBtn
                            onClick={handleResendOtp}
                            disabled={!canResend}
                            className="plain_btn auth_link txt_875"
                            text={
                                timer > 0
                                    ? `Resend in ${formatCountdown(timer)}`
                                    : 'Resend'
                            }
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <DynamicBtn
                        loading={isProcessing}
                        type="submit"
                        text="Verify"
                        className="primary_btn"
                        width="100%"
                    />
                </div>
            </AntdForm>
        </AuthCard>
    );
}
