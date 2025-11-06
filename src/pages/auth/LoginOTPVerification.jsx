import { Form } from 'antd';
import { OTPInput, DynamicBtn, AntdForm } from "abzed-utils";
import { useState } from 'react';

export default function LoginVerification() {
	const [form] = Form.useForm();

	const [otp, setotp] = useState('');

	async function onFinish() {
		console.log(otp);
	}

	return (
		<>
			<div className='bg-[#F5F5F5] fx_jst_center h-[81vh] overflow-hidden'>
				<div className='fx_col gap-6'>
					<div
						authTitle={'Verification Code'}
						authSubtitle={
							'We have sent the verification code to your email address'
						}
					/>

					<AntdForm
						form={form}
						handleSubmit={onFinish}
						formName={'forgotPassword'}>
						<div className='w-full fx_col gap-6'>
							<OTPInput setotp={setotp} />

							<DynamicBtn
								type='submit'
								width={'100%'}
								text={'Confirm'}
								className={'save_and_continue_btn'}
							/>
						</div>
					</AntdForm>

					<div className='register_main_text text-center'>
						Resend {' '} <DynamicBtn text={'Otp'} />
					</div>
				</div>
			</div>
		</>
	);
}
