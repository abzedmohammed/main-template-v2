import toast from 'react-hot-toast';
import ToastCard from './ToastCard';

const TONES = {
    success: {
        defaultMessage: 'Operation completed successfully.',
        duration: 4000,
    },
    info: {
        defaultMessage: 'You have a new notification.',
        duration: 5000,
    },
    error: {
        defaultMessage: 'An error occurred. Please try again later.',
        duration: 7000,
    },
};

const getMessage = (message, fallback) => {
    if (typeof message === 'string' && message.trim()) {
        return message.trim();
    }

    return fallback;
};

const showToast = (tone, rawMessage) => {
    const { defaultMessage, duration } = TONES[tone];
    const message = getMessage(rawMessage, defaultMessage);

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
            // Same tone + message dedupes; a different message gets its own toast.
            id: `${tone}:${message}`,
            duration,
        }
    );
};

export const successNotification = (message) => showToast('success', message);

export const infoNotification = (message) => showToast('info', message);

export const errorNotification = (message) => showToast('error', message);
