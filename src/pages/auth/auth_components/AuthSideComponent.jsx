import { logo } from '../../../utils';

export default function AuthSideComponent() {
    return (
        <div className="w-full min-h-screen h-full bg-[#948566] fx_center p-8">
            <div className="w-full max-w-[28rem] rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 fx_col_center gap-6">
                <img
                    className="w-full max-w-[11rem] h-auto object-contain"
                    src={logo}
                    alt="Brand logo"
                />
                <p className="txt_9375 text-white text-center">
                    Welcome back. Secure, fast, and ready to go.
                </p>
            </div>
        </div>
    );
}
