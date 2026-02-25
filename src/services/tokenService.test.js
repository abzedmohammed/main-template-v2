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
