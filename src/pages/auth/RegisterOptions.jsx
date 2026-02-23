import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

export default function RegisterOptions() {
    return (
        <div className="auth_main_alt">
            <div className="auth_main_alt_component px-3">
                <div className="w-full max-w-[32rem] fx_col gap-6">
                    <div className="fx_col text-center gap-3">
                        <h1 className="txt_1_875_bold text-[#121212]">
                            Choose your account type
                        </h1>
                        <p className="txt_9375 text-[#3D3D3D]">
                            Select how you want to start your registration.
                        </p>
                    </div>

                    <div className="fx_col gap-3">
                        <Link
                            to={ROUTES.AUTH.REGISTER}
                            className="primary_btn w-full fx_center"
                        >
                            Continue with standard account
                        </Link>
                        <Link
                            to={ROUTES.AUTH.LOGIN}
                            className="w-full fx_center rounded-[0.3125rem] border border-[#e5e5e5] px-5 py-2.5 text-[#3D3D3D] txt_9375_medium"
                        >
                            I already have an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
