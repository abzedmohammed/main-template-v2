import { useEffect } from 'react';
import flags from 'react-phone-number-input/flags';
import { useSelector } from 'react-redux';
import {
    AntdForm,
    FormInput,
    FormInputEmail,
    FormInputPassword,
    FormInputPhone,
    validatePassword,
} from 'abzed-utils';
import { adminSaveAction } from '../actions/admin';
import { PageHeader } from '../components/navigation';
import useFormMutation from './useFormMutation';
import { notifyError, notifySuccess } from '../utils';

export default function Profile() {
    const { user } = useSelector((state) => state.auth);

    const { form, onFinish, isProcessing } = useFormMutation({
        action: adminSaveAction,
        options: {
            mapValues: (values) => ({
                usrId: user?.usrId,
                usrSecret: values.usrSecret?.trim(),
                ...values,
            }),
            onSuccess: () => {
                notifySuccess('Profile updated successfully');
            },
        },
        beforeSubmit: (values) => {
            const hasPasswordUpdate =
                values.usrSecret || values.usrSecretConfirm || values.usrSecretOld;

            if (!hasPasswordUpdate) {
                return true;
            }

            if (!values.usrSecretOld?.trim()) {
                notifyError('Current password is required');
                return false;
            }

            const isPasswordValid = validatePassword(values.usrSecret || '');
            if (typeof isPasswordValid === 'string') {
                notifyError(isPasswordValid);
                return false;
            }

            if (values.usrSecret?.trim() !== values.usrSecretConfirm?.trim()) {
                notifyError('Passwords do not match');
                return false;
            }

            return true;
        },
    });

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
                btnFn={() => form.submit()}
                showBtn
                btnProps={{
                    loading: isProcessing,
                    className: 'primary_btn',
                }}
            />

            <AntdForm form={form} handleSubmit={onFinish} formName={'event'}>
                <div className="admin_dash_main_card">
                    <div className="w-full fx_col gap-[1rem] mt-[1rem] px-3 lg:px-[13rem] py-[1rem]">
                        <FormInput
                            readOnly
                            required={false}
                            inputClassName={'primary_input'}
                            inputName={'usrFullName'}
                            label={'Full Name'}
                        />

                        <FormInputEmail
                            inputClassName={'primary_input'}
                            inputName={'usrEmail'}
                            label={'Email'}
                        />

                        <FormInputPhone
                            flags={flags}
                            inputClassName={'primary_input'}
                            inputName={'usrMobileNumber'}
                            label={'Phone Number'}
                        />

                        <FormInput
                            readOnly
                            required={false}
                            inputClassName={'primary_input'}
                            inputName={'usrNationalId'}
                            label={'ID number (National ID/ Passport)'}
                        />

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInputPassword
                                inputClassName={'primary_input transparent_input'}
                                inputName={'usrSecretOld'}
                                label={'Current password'}
                            />

                            <FormInputPassword
                                inputClassName={'primary_input transparent_input'}
                                inputName={'usrSecret'}
                                label={'New Password'}
                            />

                            <FormInputPassword
                                inputClassName={'primary_input transparent_input'}
                                inputName={'usrSecretConfirm'}
                                label={'Confirm Password'}
                            />
                        </div>
                    </div>
                </div>
            </AntdForm>
        </div>
    );
}
