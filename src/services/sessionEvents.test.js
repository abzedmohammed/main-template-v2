import { emitSessionExpired, subscribeSessionExpired } from './sessionEvents';

describe('sessionEvents', () => {
    it('delivers the reason to subscribers', () => {
        const listener = vi.fn();
        const unsubscribe = subscribeSessionExpired(listener);

        emitSessionExpired('forced-401');

        expect(listener).toHaveBeenCalledWith('forced-401');
        unsubscribe();
    });

    it('defaults the reason to "expired"', () => {
        const listener = vi.fn();
        const unsubscribe = subscribeSessionExpired(listener);

        emitSessionExpired();

        expect(listener).toHaveBeenCalledWith('expired');
        unsubscribe();
    });

    it('stops delivering after unsubscribe', () => {
        const listener = vi.fn();
        const unsubscribe = subscribeSessionExpired(listener);

        unsubscribe();
        emitSessionExpired('forced-401');

        expect(listener).not.toHaveBeenCalled();
    });
});
