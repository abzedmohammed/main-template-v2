const TOKEN_KEY = 'token';
const TOKEN_EVENT = 'app:token-changed';
const ACTIVITY_KEY = 'app:last-activity-at';
const SESSION_START_KEY = 'app:session-started-at';
const MAX_ANCHOR_KEY = 'app:max-anchor-at';

const SESSION_KEYS = [TOKEN_KEY, ACTIVITY_KEY, SESSION_START_KEY, MAX_ANCHOR_KEY];

const dispatchTokenChanged = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new CustomEvent(TOKEN_EVENT));
};

const readTime = (key) => {
    const value = Number.parseInt(localStorage.getItem(key), 10);
    return Number.isFinite(value) ? value : null;
};

const writeTime = (key, value) => localStorage.setItem(key, String(value));

export const tokenService = {
    get() {
        return localStorage.getItem(TOKEN_KEY);
    },
    set(token) {
        localStorage.setItem(TOKEN_KEY, token);
        this.startSession();
        dispatchTokenChanged();
    },
    clear() {
        SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
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

    // --- session lifecycle ---------------------------------------------------

    // Start a fresh session window (resets idle, rolling-cap and absolute-cap
    // anchors). Called on login and on an explicit "Continue working" unlock.
    startSession(at = Date.now()) {
        writeTime(SESSION_START_KEY, at);
        writeTime(ACTIVITY_KEY, at);
        writeTime(MAX_ANCHOR_KEY, at);
    },

    // Initialise the window only if one isn't already running (mount-safe).
    ensureSessionStarted(at = Date.now()) {
        if (readTime(SESSION_START_KEY) === null) {
            this.startSession(at);
        }
    },

    refreshSession(at = Date.now()) {
        this.startSession(at);
    },

    // Record user activity (slides the idle deadline forward).
    touchActivity(at = Date.now()) {
        writeTime(ACTIVITY_KEY, at);
    },

    // Slide the rolling-cap anchor forward, capped at the absolute ceiling so
    // heavy users still re-authenticate at the hard limit.
    bumpMaxAnchor(at = Date.now(), absoluteMaxMs = 0) {
        const start = readTime(SESSION_START_KEY) ?? at;
        writeTime(MAX_ANCHOR_KEY, Math.min(at, start + absoluteMaxMs));
    },

    // Evaluate the session against the configured limits. Returns one of:
    //   { state: 'active'  }
    //   { state: 'warning', reason, remainingMs }   — soonest deadline is near
    //   { state: 'expired', reason }                — idle | max | absolute
    getSessionStatus({
        idleTimeoutMs = 0,
        maxDurationMs = 0,
        absoluteMaxMs = 0,
        warningCountdownMs = 0,
    } = {}) {
        const now = Date.now();
        const start = readTime(SESSION_START_KEY);

        if (start === null) {
            return { state: 'active', reason: null, remainingMs: Infinity };
        }

        const activity = readTime(ACTIVITY_KEY) ?? start;
        const anchor = readTime(MAX_ANCHOR_KEY) ?? start;

        const idleRemaining = activity + idleTimeoutMs - now;
        const maxRemaining = anchor + maxDurationMs - now;
        const absoluteRemaining = start + absoluteMaxMs - now;

        if (idleRemaining <= 0) {
            return { state: 'expired', reason: 'idle-expired', remainingMs: 0 };
        }
        if (absoluteRemaining <= 0) {
            return { state: 'expired', reason: 'absolute-expired', remainingMs: 0 };
        }
        if (maxRemaining <= 0) {
            return { state: 'expired', reason: 'max-expired', remainingMs: 0 };
        }

        const remainingMs = Math.min(idleRemaining, maxRemaining, absoluteRemaining);

        if (remainingMs <= warningCountdownMs) {
            return {
                state: 'warning',
                reason: remainingMs === idleRemaining ? 'idle-warning' : 'max-warning',
                remainingMs,
            };
        }

        return { state: 'active', reason: null, remainingMs };
    },
};
