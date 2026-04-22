import { TextDynamic } from 'abzed-utils';
import { logo } from '../../../utils';

export default function AuthSideComponent() {
    return (
        <div className="w-full min-h-screen h-full bg-[#948566] fx_center p-8">
            <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 fx_col_center gap-6">
                <img
                    className="w-full max-w-44 h-auto object-contain"
                    src={logo}
                    alt="Brand logo"
                />
                <TextDynamic
                    tagName="p"
                    text="Welcome back. Secure, fast, and ready to go."
                    className="txt_9375 text-white text-center"
                />
            </div>
        </div>
    );
}
