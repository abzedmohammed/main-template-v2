import toast from 'react-hot-toast';
import ToastCard from './ToastCard';

const toneConfig = {
    success: {
        defaultMessage: 'Operation completed successfully.',
    },
    info: {
        defaultMessage: 'You have a new notification.',
    },
    error: {
        defaultMessage: 'An error occurred. Please try again later.',
    },
};

const getMessage = (message, fallback) => {
    if (typeof message === 'string' && message.trim()) {
        return message.trim();
    }

    return fallback;
};

const showToast = (tone, toastObj) => {
    const config = toneConfig[tone];
    const message = getMessage(toastObj?.message, config.defaultMessage);
    const duration = tone === 'error' ? 5000 : 4000;

    toast.custom(
        (t) => (
            <ToastCard
                toastObj={{ ...t, message }}
                tone={tone}
                onClose={() => toast.dismiss(t.id)}
                durationMs={duration}
            />
        ),
        {
            id: toastObj?.id,
            duration,
        }
    );
};

export const successNotification = (toastObj) => {
    showToast('success', toastObj);
};

export const infoNotification = (toastObj) => {
    showToast('info', toastObj);
};

export const errorNotification = (toastObj) => {
    showToast('error', toastObj);
};
