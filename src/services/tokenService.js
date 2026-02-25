const TOKEN_KEY = 'token';
const TOKEN_EVENT = 'app:token-changed';

const dispatchTokenChanged = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new CustomEvent(TOKEN_EVENT));
};

export const tokenService = {
    get() {
        return localStorage.getItem(TOKEN_KEY);
    },
    set(token) {
        localStorage.setItem(TOKEN_KEY, token);
        dispatchTokenChanged();
    },
    clear() {
        localStorage.removeItem(TOKEN_KEY);
        dispatchTokenChanged();
    },
    subscribe(listener) {
        if (typeof window === 'undefined') {
            return () => {};
        }

        const handler = () => listener(this.get());
        window.addEventListener(TOKEN_EVENT, handler);

        return () => {
            window.removeEventListener(TOKEN_EVENT, handler);
        };
    },
};
