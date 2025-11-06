import { Link } from "react-router-dom";
import {
    FormInputPassword,
    DynamicBtn,
    TextDynamic,
    AntdForm,
} from "abzed-utils";
import { ArrowLeftSvg } from "../../../svgs";

export default function PasswordFormComponent({
    form,
    onFinish,
    text = "Submit",
    showBackBtn = true,
    headerText,
    subHeaderText,
    isProcessing,
    watchedValues,
}) {
    const pswd = watchedValues?.usrEncryptedPassword || "";

    const has8Chars = pswd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pswd);
    const hasNumber = /\d/.test(pswd);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':",./<>?`~]/.test(pswd);

    return (
        <div className="p-3 md:p-0 fx_col gap-[1.88rem] mt-5 md:mt-[5.19rem]">
            <div className="fx_col text-center gap-6">
                <TextDynamic
                    text={headerText}
                    className={"txt_1_875_bold text-[#121212]"}
                />
                <TextDynamic
                    text={subHeaderText}
                    className={"txt_9375 text-[#3D3D3D]"}
                />
            </div>

            <AntdForm form={form} handleSubmit={onFinish} formName={"login"}>
                <div className="w-full fx_col gap-5">
                    <FormInputPassword
                        inputClassName={"auth_input"}
                        inputName={"usrEncryptedPassword"}
                        label={"Password"}
                    />

                    <FormInputPassword
                        inputClassName={"auth_input"}
                        inputName={"usrEncryptedPasswordAlt"}
                        label={"Confirm Password"}
                    />

                    <div className="w-full grid grid-cols-2 gap-[.94rem]">
                        <DynamicBtn
                            className={"plain_btn"}
                            text={
                                <span
                                    style={{
                                        color: has8Chars
                                            ? "#572C80"
                                            : "#545454",
                                    }}
                                    className="txt_875"
                                >
                                    At least 8 characters
                                </span>
                            }
                        />

                        <DynamicBtn
                            className={"plain_btn"}
                            text={
                                <span
                                    style={{
                                        color: hasUpperCase
                                            ? "#572C80"
                                            : "#545454",
                                    }}
                                    className="txt_875"
                                >
                                    One upper case letter
                                </span>
                            }
                        />

                        <DynamicBtn
                            className={"plain_btn"}
                            text={
                                <span
                                    style={{
                                        color: hasNumber
                                            ? "#572C80"
                                            : "#545454",
                                    }}
                                    className="txt_875"
                                >
                                    At least one number
                                </span>
                            }
                        />

                        <DynamicBtn
                            className={"plain_btn"}
                            text={
                                <span
                                    style={{
                                        color: hasSymbol
                                            ? "#572C80"
                                            : "#545454",
                                    }}
                                    className="txt_875"
                                >
                                    Use a symbol (e.g. !@#)
                                </span>
                            }
                        />
                    </div>
                </div>

                <div className="fx_col mt-[1.88rem] gap-[1.88rem]">
                    <DynamicBtn
                        width={"100%"}
                        className={"primary_btn"}
                        text={text}
                        type="submit"
                        isProcessing={isProcessing}
                    />
                    {showBackBtn && (
                        <Link className="fx_center" to="/auth/login">
                            <div className="fx_item_center gap-2.5">
                                <ArrowLeftSvg />
                                <TextDynamic
                                    text={"Back to Log in"}
                                    className={"txt_8125_semi text-[#3D3D3D]"}
                                />
                            </div>
                        </Link>
                    )}
                </div>
            </AntdForm>
        </div>
    );
}
