// Lightweight pub/sub for session-expiry signals raised outside React (e.g. a
// 401 from the axios interceptor). useTokenExpiryChecker subscribes to react.
const SESSION_EXPIRED_EVENT = 'app:session-expired';

export const emitSessionExpired = (reason = 'expired') => {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT, { detail: { reason } }));
};

export const subscribeSessionExpired = (listener) => {
    if (typeof window === 'undefined') {
        return () => {};
    }

    const handler = (event) => listener(event?.detail?.reason ?? 'expired');
    window.addEventListener(SESSION_EXPIRED_EVENT, handler);

    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
};
