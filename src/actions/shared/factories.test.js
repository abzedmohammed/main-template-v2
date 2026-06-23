import axiosInstance from '../../instance';
import { onError, onSuccess } from '../../utils';
import { createFetchAction, createMutationAction } from './factories';

vi.mock('../../instance', () => ({
    default: { post: vi.fn(), put: vi.fn(), get: vi.fn() },
}));

vi.mock('../../utils', () => ({
    onError: vi.fn(),
    onSuccess: vi.fn(),
}));

beforeEach(() => {
    vi.resetAllMocks();
});

describe('createMutationAction', () => {
    it('builds a POST action config wired to onError', () => {
        const action = createMutationAction({ path: '/save' });

        expect(action.method).toBe('POST');
        expect(action.endpoint).toBe('/save');
        expect(action.onError).toBe(onError);
        expect(typeof action.mutationFn).toBe('function');
    });

    it('uses PUT when method is PUT', async () => {
        axiosInstance.put.mockResolvedValue({ data: { success: true } });

        const action = createMutationAction({ path: '/update', method: 'PUT' });
        await action.mutationFn({ id: 1 });

        expect(action.method).toBe('PUT');
        expect(axiosInstance.put).toHaveBeenCalledWith('/update', { id: 1 });
    });

    it('deduplicates invalidateQueryKeys', () => {
        const action = createMutationAction({
            path: '/save',
            invalidateQueryKeys: [['notifications'], ['notifications'], ['profile']],
        });

        expect(action.invalidateQueryKeys).toEqual([['notifications'], ['profile']]);
    });

    it('toasts the envelope message on success when successMessage is set', () => {
        const action = createMutationAction({
            path: '/save',
            successMessage: 'Fallback',
        });

        action.onSuccess({ response: { data: { message: 'From server', data: null } } });

        expect(onSuccess).toHaveBeenCalledWith('From server');
    });

    it('falls back to successMessage when the envelope has no message', () => {
        const action = createMutationAction({
            path: '/save',
            successMessage: 'Fallback',
        });

        action.onSuccess({ response: { data: { data: null } } });

        expect(onSuccess).toHaveBeenCalledWith('Fallback');
    });

    it('prefers an explicit onSuccess override', () => {
        const override = vi.fn();
        const action = createMutationAction({
            path: '/save',
            successMessage: 'ignored',
            onSuccess: override,
        });

        expect(action.onSuccess).toBe(override);
    });

    it('omits onSuccess when neither successMessage nor override is given', () => {
        const action = createMutationAction({ path: '/save' });

        expect(action.onSuccess).toBeUndefined();
    });

    it('sends no body when withBody is false', async () => {
        axiosInstance.post.mockResolvedValue({ data: { success: true } });

        const action = createMutationAction({ path: '/logout', withBody: false });
        await action.mutationFn({ ignored: true });

        expect(axiosInstance.post).toHaveBeenCalledWith('/logout');
    });
});

describe('createFetchAction', () => {
    it('POSTs the sanitized body by default', () => {
        axiosInstance.post.mockResolvedValue({ data: {} });

        const action = createFetchAction({ queryKey: ['k'], path: '/list' });
        action.requestFn({ start: 0 });

        expect(action.queryKey).toEqual(['k']);
        expect(axiosInstance.post).toHaveBeenCalledWith('/list', { start: 0 });
    });

    it('GETs with params when method is GET', () => {
        axiosInstance.get.mockResolvedValue({ data: {} });

        const action = createFetchAction({
            queryKey: ['k'],
            path: '/list',
            method: 'GET',
            sanitizeBody: (body) => ({ status: body.status }),
        });
        action.requestFn({ start: 5, status: 'ACTIVE' });

        expect(axiosInstance.get).toHaveBeenCalledWith('/list', {
            params: { status: 'ACTIVE' },
        });
    });
});
