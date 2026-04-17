import { TextDynamic } from 'abzed-utils';
import { CloseSvg, InfoSvg, ToastErrorMarkSvg, ToastSuccessMarkSvg } from '../../svgs';

const toneConfig = {
    success: {
        title: 'Success',
        iconClassName: 'toast_icon_success',
        rootClassName: 'toast_card_success',
    },
    info: {
        title: 'Notification',
        iconClassName: 'toast_icon_info',
        rootClassName: 'toast_card_info',
    },
    error: {
        title: 'Error',
        iconClassName: 'toast_icon_error',
        rootClassName: 'toast_card_error',
    },
};

export default function ToastCard({ toastObj, tone, onClose, durationMs }) {
    const config = toneConfig[tone];
    const icon =
        tone === 'success' ? (
            <ToastSuccessMarkSvg />
        ) : tone === 'info' ? (
            <InfoSvg />
        ) : (
            <ToastErrorMarkSvg />
        );
    const stateClass = toastObj.visible ? 'toast_card_enter' : 'toast_card_exit';

    return (
        <div
            key={toastObj.id}
            className={`toast_card ${config.rootClassName} ${stateClass}`}
            style={{ '--toast-duration': `${durationMs}ms` }}
        >
            <div className="toast_main">
                <div className={`toast_icon ${config.iconClassName}`}>{icon}</div>
                <div className="toast_copy">
                    <TextDynamic
                        text={config.title}
                        color="#121212"
                        className="txt_75_bold uppercase tracking-wider"
                    />
                    <TextDynamic
                        text={toastObj.message}
                        color="#3D3D3D"
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
