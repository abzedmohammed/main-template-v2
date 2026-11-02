import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import useFormMutation from './useFormMutation';
import { errorToast, infoToast, successToast } from '../utils';

// The real toasts render through react-hot-toast; mock them at that boundary.
vi.mock('../utils', async (importOriginal) => ({
    ...(await importOriginal()),
    successToast: vi.fn(),
    infoToast: vi.fn(),
    errorToast: vi.fn(),
}));

function createWrapper() {
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });
    const noopSlice = createSlice({
        name: 'noop',
        initialState: {},
        reducers: {},
    });
    const store = configureStore({ reducer: { noop: noopSlice.reducer } });

    return function Wrapper({ children }) {
        return (
            <QueryClientProvider client={client}>
                <Provider store={store}>
                    <MemoryRouter>{children}</MemoryRouter>
                </Provider>
            </QueryClientProvider>
        );
    };
}

// Axios-shaped success: the envelope lives on `.data`.
const okResponse = (message = 'Saved') => ({
    data: { success: true, message, data: null, status: 200 },
});

// Axios-shaped failure: the backend envelope lives on `error.response.data`.
const backendError = (message, status = 401) =>
    Object.assign(new Error('Request failed'), {
        response: { data: { success: false, message, data: null, status } },
    });

const submit = (result, values = { value: 1 }) =>
    act(() => {
        result.current.onFinish(values);
    });

describe('useFormMutation', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('submits mapped values via the action mutationFn', async () => {
        const mutationFn = vi.fn().mockResolvedValue(okResponse());
        const mapValues = (values) => ({ ...values, extra: 'added' });

        const { result } = renderHook(
            () => useFormMutation({ action: { mutationFn }, options: { mapValues } }),
            { wrapper: createWrapper() }
        );

        submit(result, { name: 'Ada' });

        await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1));
        expect(mutationFn.mock.calls[0][0]).toEqual({ name: 'Ada', extra: 'added' });
    });

    it('accepts an action directly as the first argument', async () => {
        const mutationFn = vi.fn().mockResolvedValue(okResponse());

        const { result } = renderHook(() => useFormMutation({ mutationFn }), {
            wrapper: createWrapper(),
        });

        submit(result);

        await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1));
    });

    it('toasts the backend message on success by default', async () => {
        const mutationFn = vi.fn().mockResolvedValue(okResponse('Welcome back'));

        const { result } = renderHook(() => useFormMutation({ mutationFn }), {
            wrapper: createWrapper(),
        });

        submit(result);

        await waitFor(() => expect(successToast).toHaveBeenCalledWith('Welcome back'));
    });

    it("lets the action's successToast replace the default toast", async () => {
        const mutationFn = vi.fn().mockResolvedValue(okResponse());
        const actionSuccess = vi.fn();

        const { result } = renderHook(
            () => useFormMutation({ mutationFn, successToast: actionSuccess }),
            { wrapper: createWrapper() }
        );

        submit(result, { name: 'Ada' });

        await waitFor(() => expect(actionSuccess).toHaveBeenCalled());
        expect(actionSuccess.mock.calls[0][0]).toMatchObject({
            payload: { name: 'Ada' },
        });
        expect(successToast).not.toHaveBeenCalled();
    });

    it('runs options.successToast in addition to the default toast', async () => {
        const mutationFn = vi.fn().mockResolvedValue(okResponse());
        const extra = vi.fn();

        const { result } = renderHook(
            () => useFormMutation({ mutationFn }, { successToast: extra }),
            { wrapper: createWrapper() }
        );

        submit(result);

        await waitFor(() => expect(extra).toHaveBeenCalled());
        expect(extra.mock.calls[0][0]).toHaveProperty('form');
        expect(successToast).toHaveBeenCalled();
    });

    it('toasts the backend message when the API fails with success: false', async () => {
        const message = 'Please verify account before continuing';
        const mutationFn = vi.fn().mockRejectedValue(backendError(message));

        const { result } = renderHook(() => useFormMutation({ mutationFn }), {
            wrapper: createWrapper(),
        });

        submit(result);

        await waitFor(() => expect(errorToast).toHaveBeenCalled());
        expect(errorToast.mock.calls[0][0]).toBe(message);
    });

    it('treats a 200 response with success: false as an error', async () => {
        const mutationFn = vi.fn().mockResolvedValue({
            data: { success: false, message: 'Email already taken', data: null },
        });

        const { result } = renderHook(() => useFormMutation({ mutationFn }), {
            wrapper: createWrapper(),
        });

        submit(result);

        await waitFor(() => expect(errorToast).toHaveBeenCalled());
        expect(errorToast.mock.calls[0][0]).toBe('Email already taken');
        expect(successToast).not.toHaveBeenCalled();
    });

    it('shows an info toast instead of an error when infoWhen flags the response', async () => {
        const message = 'Please verify account before continuing';
        const mutationFn = vi.fn().mockRejectedValue(backendError(message));

        const { result } = renderHook(
            () =>
                useFormMutation({
                    action: { mutationFn },
                    options: {
                        infoWhen: (envelope) => /verify account/i.test(envelope?.message),
                    },
                }),
            { wrapper: createWrapper() }
        );

        submit(result);

        await waitFor(() => expect(infoToast).toHaveBeenCalled());
        expect(infoToast.mock.calls[0][0]).toBe(message);
        expect(errorToast).not.toHaveBeenCalled();
    });

    it('skips submission when beforeSubmit returns false', () => {
        const mutationFn = vi.fn();

        const { result } = renderHook(
            () => useFormMutation({ action: { mutationFn }, beforeSubmit: () => false }),
            { wrapper: createWrapper() }
        );

        submit(result, { anything: 'here' });

        expect(mutationFn).not.toHaveBeenCalled();
    });

    it('skips submission when mapValues returns null', () => {
        const mutationFn = vi.fn();

        const { result } = renderHook(
            () =>
                useFormMutation({
                    action: { mutationFn },
                    options: { mapValues: () => null },
                }),
            { wrapper: createWrapper() }
        );

        submit(result, { anything: 'here' });

        expect(mutationFn).not.toHaveBeenCalled();
    });
});
