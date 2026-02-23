import toast from 'react-hot-toast';

const SUCCESS_TOAST_ID = 1;
const ERROR_TOAST_ID = 2;

const getMessage = (message, fallback) => {
    return typeof message === 'string' && message.trim() ? message : fallback;
};

const renderToastContent = ({ t, message, tone = 'success' }) => {
    const isSuccess = tone === 'success';

    return (
        <div
            key={t.id}
            className={`toast_bar transition-all duration-200 ease-out ${
                t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            } ${isSuccess ? 'bg-[#22C55E]' : 'bg-[#EE1D52]'}`}
        >
            <span
                aria-hidden="true"
                className="fx_center w-5 h-5 rounded-full bg-white/20 text-[0.6875rem] shrink-0"
            >
                {isSuccess ? 'OK' : 'ER'}
            </span>

            <p className="flex-1 leading-5">{message}</p>

            <button
                type="button"
                className="plain_btn !text-white text-base leading-none shrink-0"
                aria-label="Dismiss notification"
                onClick={() => toast.dismiss(t.id)}
            >
                ×
            </button>
        </div>
    );
};

export const successNotification = (message) => {
    const text = getMessage(message, 'Operation completed successfully.');

    toast.custom((t) => renderToastContent({ t, message: text, tone: 'success' }), {
        id: SUCCESS_TOAST_ID,
        duration: 3500,
        position: 'top-center',
    });
};

export const errorNotification = (message) => {
    const text = getMessage(message, 'An error occurred. Please try again later.');

    toast.custom((t) => renderToastContent({ t, message: text, tone: 'error' }), {
        id: ERROR_TOAST_ID,
        duration: 4000,
        position: 'top-center',
    });
};
