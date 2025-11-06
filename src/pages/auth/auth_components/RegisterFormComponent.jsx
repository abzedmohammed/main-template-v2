import flags from "react-phone-number-input/flags";
import 'react-phone-number-input/style.css'

import {
    FormInput,
    FormInputEmail,
    FormInputPassword,
    FormInputPhone,
    AntdForm,
    DynamicBtn,
    TextDynamic,
} from "abzed-utils";
import { Link } from "react-router-dom";
import { GoogleSvg } from "../../../svgs";

export default function RegisterFormComponent({
    form,
    onFinish,
    isProcessing,
}) {
    return (
        <div className="w-full fx_center">
            <div className="w-full md:w-95 p-3 md:p-0 fx_col gap-[1.88rem] mt-5">
                <div className="fx_col text-center gap-6">
                    <TextDynamic
                        text={"Welcome"}
                        className={"txt_1_875_bold text-[#121212]"}
                    />
                    <TextDynamic
                        text={"Please fill in your personal details."}
                        className={
                            "txt_9375 text-[#3D3D3D] max-w-[290px] md:max-w-full"
                        }
                    />
                </div>

                <AntdForm
                    form={form}
                    handleSubmit={onFinish}
                    formName={"login"}
                >
                    <div className="w-full fx_col gap-5">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            <FormInput
                                inputClassName={"auth_input"}
                                inputName={"usrFirstName"}
                                label={"First name"}
                            />

                            <FormInput
                                inputClassName={"auth_input"}
                                inputName={"usrLastName"}
                                label={"Last name"}
                            />
                        </div>

                        <FormInput
                            inputClassName={"auth_input"}
                            label={"ID number"}
                            inputName={"usrNationalId"}
                        />

                        <FormInputEmail
                            inputClassName={"auth_input"}
                            inputName={"usrEmail"}
                            label={"Email"}
                        />

                        <FormInputPhone
                            flags={flags}
                            inputClassName={"auth_input"}
                            inputName={"usrMobileNumber"}
                            label={"Phone Number"}
                        />

                        <FormInputPassword
                            inputClassName={"auth_input"}
                            inputName={"usrEncryptedPassword"}
                            placeholder="Password"
                            label="Password"
                        />
                    </div>

                    <div className="fx_col mt-[1.56rem] gap-[1.88rem]">
                        <DynamicBtn
                            isProcessing={isProcessing}
                            width={"100%"}
                            className={"primary_btn"}
                            text={"Continue"}
                            type="submit"
                        />

                        <div className="w-full h-[.03125rem] bg-[#E5E5E5]"></div>

                        <DynamicBtn
                            className={"google_btn"}
                            text={"Or sign up with Google"}
                            width={"100%"}
                            icon={<GoogleSvg />}
                        />

                        <TextDynamic
                            text={
                                <span>
                                    Already have an account?{" "}
                                    <Link
                                        className="font-bold underline! text-[#3D3D3D]!"
                                        to={"/auth/login"}
                                    >
                                        Log In
                                    </Link>
                                </span>
                            }
                            className={"txt_8125_medium text-[#3D3D3D]"}
                        />
                    </div>
                </AntdForm>
            </div>
        </div>
    );
}
