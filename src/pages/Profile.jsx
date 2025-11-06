import { PageHeader } from "../components/navigation";
import flags from "react-phone-number-input/flags";
import 'react-phone-number-input/style.css'

import { Form } from "antd";
import { adminSave } from "../actions/adminActions";
import { notifyError, notifySuccess } from "../utils";
import { useSelector } from "react-redux";
import {
    FormInput,
    FormInputEmail,
    FormInputPassword,
    FormInputPhone,
    useDynamicMutation,
    validatePassword,
    AntdForm,
} from "abzed-utils";
import { useEffect } from "react";

export default function Profile() {
    const { user } = useSelector((state) => state.auth);

    const [form] = Form.useForm();

    const saveMutation = useDynamicMutation({
        mutationFn: adminSave.mutationFn,
        onError: notifyError,
        onSuccess: () => {
            notifySuccess("Profile updated successfully");
        },
    });

    const onFinish = async (values) => {
        let isPasswordValid = validatePassword(values.usrSecret);

        if (typeof isPasswordValid === "string") {
            return notifyError(isPasswordValid);
        }

        if (values.usrSecret.trim() !== values.usrSecretConfirm.trim()) {
            return notifyError("Passwords do not match");
        }

        saveMutation.mutate({
            usrId: user?.usrId,
            usrSecret: values.usrSecret.trim(),
            ...values,
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...user,
        });
    }, [user, form]);

    return (
        <div className="w-full h-full fx_col gap-10">
            <PageHeader
                header="Profile"
                body="Manage your personal profile"
                btnText="Save Changes"
                btnFn={() => {}}
            />

            <AntdForm form={form} handleSubmit={onFinish} formName={"event"}>
                <div className="admin_dash_main_card">
                    <div className="w-full fx_col gap-[1rem] mt-[1rem] px-3 lg:px-[13rem] py-[1rem]">
                        <FormInput
                            readOnly
                            required={false}
                            inputClassName={"primary_input"}
                            inputName={"usrFullName"}
                            label={"Full Name"}
                        />

                        <FormInputEmail
                            inputClassName={"primary_input"}
                            inputName={"usrEmail"}
                            label={"Email"}
                        />

                        <FormInputPhone
                            flags={flags}
                            inputClassName={"primary_input"}
                            inputName={"usrMobileNumber"}
                            label={"Phone Number"}
                        />

                        <FormInput
                            readOnly
                            required={false}
                            inputClassName={"primary_input"}
                            inputName={"usrNationalId"}
                            label={"ID number (National ID/ Passport)"}
                        />

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInputPassword
                                inputClassName={
                                    "primary_input transparent_input"
                                }
                                inputName={"usrSecretOld"}
                                label={"Current password"}
                            />

                            <FormInputPassword
                                inputClassName={
                                    "primary_input transparent_input"
                                }
                                inputName={"usrSecret"}
                                label={"New Password"}
                            />

                            <FormInputPassword
                                inputClassName={
                                    "primary_input transparent_input"
                                }
                                inputName={"usrSecretConfirm"}
                                label={"Confirm Password"}
                            />
                        </div>
                    </div>
                </div>
            </AntdForm>
        </div>
    );
}
