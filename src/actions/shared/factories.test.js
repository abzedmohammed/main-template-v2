import axiosInstance from '../../instance';
import { errorToast, successToast } from '../../utils';
import {
    createFetchAction,
    createMutationAction,
    readList,
    readResult,
} from './factories';

vi.mock('../../instance', () => ({
    default: { post: vi.fn(), delete: vi.fn(), get: vi.fn() },
}));

vi.mock('../../utils', () => ({
    errorToast: vi.fn(),
    successToast: vi.fn(),
}));

beforeEach(() => {
    vi.resetAllMocks();
});

describe('createMutationAction', () => {
    it('builds a POST action config wired to errorToast', () => {
        const action = createMutationAction({ path: '/save' });

        expect(action.method).toBe('POST');
        expect(action.endpoint).toBe('/save');
        expect(action.errorToast).toBe(errorToast);
        expect(typeof action.mutationFn).toBe('function');
    });

    it('sends DELETE to the path with the id filled in', async () => {
        axiosInstance.delete.mockResolvedValue({ data: { success: true } });

        const action = createMutationAction({
            path: '/api/delete/{id}',
            method: 'DELETE',
        });
        await action.mutationFn({ id: 7 });

        expect(action.method).toBe('DELETE');
        expect(axiosInstance.delete).toHaveBeenCalledWith('/api/delete/7');
        expect(axiosInstance.post).not.toHaveBeenCalled();
    });

    it('still sends DELETE when withBody is false', async () => {
        axiosInstance.delete.mockResolvedValue({ data: { success: true } });

        const action = createMutationAction({
            path: '/api/delete/{id}',
            method: 'DELETE',
            withBody: false,
        });
        await action.mutationFn({ id: 7 });

        expect(axiosInstance.delete).toHaveBeenCalledWith('/api/delete/7');
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

        action.successToast({
            response: { data: { message: 'From server', data: null } },
        });

        expect(successToast).toHaveBeenCalledWith('From server');
    });

    it('falls back to successMessage when the envelope has no message', () => {
        const action = createMutationAction({
            path: '/save',
            successMessage: 'Fallback',
        });

        action.successToast({ response: { data: { data: null } } });

        expect(successToast).toHaveBeenCalledWith('Fallback');
    });

    it('prefers an explicit successToast override', () => {
        const override = vi.fn();
        const action = createMutationAction({
            path: '/save',
            successMessage: 'ignored',
            successToast: override,
        });

        expect(action.successToast).toBe(override);
    });

    it('omits successToast when neither successMessage nor override is given', () => {
        const action = createMutationAction({ path: '/save' });

        expect(action.successToast).toBeUndefined();
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

describe('readResult / readList', () => {
    it('readResult resolves to the business payload', async () => {
        const request = Promise.resolve({
            data: { success: true, data: { result: { usrId: '1' } } },
        });

        await expect(readResult(request)).resolves.toEqual({ usrId: '1' });
    });

    it('readList resolves to { result, total }', async () => {
        const request = Promise.resolve({
            data: { success: true, data: { result: [{ id: 1 }] }, total: 1 },
        });

        await expect(readList(request)).resolves.toEqual({
            result: [{ id: 1 }],
            total: 1,
        });
    });

    it('readList returns an empty list when the result is not an array', async () => {
        const request = Promise.resolve({
            data: { success: true, data: { result: null } },
        });

        await expect(readList(request)).resolves.toEqual({ result: [], total: 0 });
    });
});
