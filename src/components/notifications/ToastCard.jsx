import { capitaliseFirstLetter, TextDynamic } from 'abzed-utils';
import { CloseSvg } from '../../svgs';
import AnimatedStatus from './AnimatedStatus';

const TONES = ['success', 'info', 'error'];

export default function ToastCard({ toastObj, tone = 'info', onClose, durationMs }) {
    const safeTone = TONES.includes(tone) ? tone : 'info';
    const stateClass = toastObj.visible ? 'toast_card_enter' : 'toast_card_exit';

    return (
        <div
            role={safeTone === 'error' ? 'alert' : 'status'}
            className={`toast_card toast_card_${safeTone} ${stateClass}`}
            style={{ '--toast-duration': `${durationMs}ms` }}
        >
            <div className="toast_main">
                <div className="fx_item_center gap-3">
                    <AnimatedStatus type={safeTone} size={21} />

                    <TextDynamic
                        text={capitaliseFirstLetter(toastObj.message)}
                        className="txt_8125_medium"
                    />
                </div>

                <button
                    type="button"
                    className="toast_close_btn"
                    aria-label="Close notification"
                    onClick={onClose}
                >
                    <CloseSvg />
                </button>
            </div>
            <div className="toast_timer" />
        </div>
    );
}
