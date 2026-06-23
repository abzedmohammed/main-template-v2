import { tokenService } from './tokenService';

describe('tokenService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('sets and gets token', () => {
        tokenService.set('abc123');
        expect(tokenService.get()).toBe('abc123');
    });

    it('clears token', () => {
        tokenService.set('abc123');
        tokenService.clear();
        expect(tokenService.get()).toBeNull();
    });

    it('notifies subscribers when token changes', () => {
        const listener = vi.fn();
        const unsubscribe = tokenService.subscribe(listener);

        tokenService.set('abc123');
        expect(listener).toHaveBeenCalledWith('abc123');

        tokenService.clear();
        expect(listener).toHaveBeenLastCalledWith(null);

        unsubscribe();
    });
});

describe('tokenService session lifecycle', () => {
    const BASE = 1_700_000_000_000;
    const MIN = 60 * 1000;
    const CONFIG = {
        idleTimeoutMs: 15 * MIN,
        maxDurationMs: 60 * MIN,
        absoluteMaxMs: 240 * MIN,
        warningCountdownMs: 60 * 1000,
    };

    const at = (msFromBase) => vi.setSystemTime(BASE + msFromBase);

    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
        vi.setSystemTime(BASE);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('reports active immediately after login', () => {
        tokenService.set('token');

        expect(tokenService.getSessionStatus(CONFIG).state).toBe('active');
    });

    it('reports active when there is no session', () => {
        expect(tokenService.getSessionStatus(CONFIG).state).toBe('active');
    });

    it('warns shortly before the idle deadline', () => {
        tokenService.set('token');
        at(14 * MIN + 1000);

        const status = tokenService.getSessionStatus(CONFIG);

        expect(status.state).toBe('warning');
        expect(status.reason).toBe('idle-warning');
    });

    it('expires (idle) after the idle timeout', () => {
        tokenService.set('token');
        at(15 * MIN + 1000);

        const status = tokenService.getSessionStatus(CONFIG);

        expect(status.state).toBe('expired');
        expect(status.reason).toBe('idle-expired');
    });

    it('expires (max) at the rolling cap even while active', () => {
        tokenService.set('token');
        at(61 * MIN);
        tokenService.touchActivity(BASE + 61 * MIN); // stay active, idle stays fresh

        const status = tokenService.getSessionStatus(CONFIG);

        expect(status.state).toBe('expired');
        expect(status.reason).toBe('max-expired');
    });

    it('expires (absolute) at the hard ceiling despite bumping the anchor', () => {
        tokenService.set('token');
        at(241 * MIN);
        tokenService.touchActivity(BASE + 241 * MIN);
        tokenService.bumpMaxAnchor(BASE + 241 * MIN, CONFIG.absoluteMaxMs);

        const status = tokenService.getSessionStatus(CONFIG);

        expect(status.state).toBe('expired');
        expect(status.reason).toBe('absolute-expired');
    });

    it('refreshSession resets an expired window back to active', () => {
        tokenService.set('token');
        at(20 * MIN);
        expect(tokenService.getSessionStatus(CONFIG).state).toBe('expired');

        tokenService.refreshSession();

        expect(tokenService.getSessionStatus(CONFIG).state).toBe('active');
    });

    it('ensureSessionStarted does not reset a running session', () => {
        tokenService.set('token');
        at(20 * MIN);
        tokenService.ensureSessionStarted();

        expect(tokenService.getSessionStatus(CONFIG).state).toBe('expired');
    });

    it('clear wipes the session so status falls back to active', () => {
        tokenService.set('token');
        at(20 * MIN);
        tokenService.clear();

        expect(tokenService.get()).toBeNull();
        expect(tokenService.getSessionStatus(CONFIG).state).toBe('active');
    });
});
