import { AntdForm, OTPInput, DynamicBtn, TextDynamic } from "abzed-utils";

export default function OTPFormComponent({
    setotp,
    onFinish,
    isProcessing,
    form,
    handleResendOtp,
    timer,
	otpText='Enter the code sent to your phone or email',
    verificationText='Enter Code',
}) {
    const counterText =
        timer > 0
            ? `Resend OTP in 00:${String(timer).padStart(2, "0")}`
            : "00:00";

    return (
        <div className="p-3 md:p-0 fx_col gap-5 mt-5 md:mt-[4.69rem]">
            <AntdForm form={form} handleSubmit={onFinish} formName={"otp"}>
                <div className="w-full fx_col gap-6">
                    <div className="fx_col text-center gap-6 mb-10">
                        <TextDynamic
                            text={verificationText}
                            className={"txt_1_875_bold text-[#121212]"}
                        />
                        <TextDynamic
                            text={otpText}
                            className={"txt_9375 text-[#3D3D3D]"}
                        />
                    </div>

                    <OTPInput setotp={setotp} />

                    <div className="fx_btwn_center">
                        <TextDynamic
                            text={counterText}
                            className={"cd_body_lg"}
                        />

                        <DynamicBtn
                            handleClick={handleResendOtp}
                            className={"underline plain_btn"}
                            text="Resend OTP"
                            disabled={timer > 0 || isProcessing.isPending}
                        />
                    </div>

                    <DynamicBtn
                        isProcessing={isProcessing}
                        type="submit"
                        width={"100%"}
                        text={"Confirm"}
                        className={"primary_btn"}
                    />
                </div>
            </AntdForm>
        </div>
    );
}
