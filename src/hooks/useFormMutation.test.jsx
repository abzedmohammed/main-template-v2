import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import useFormMutation from './useFormMutation';

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

describe('useFormMutation', () => {
    it('submits mapped values via the action mutationFn', async () => {
        const mutationFn = vi.fn().mockResolvedValue({ ok: true });
        const onSuccess = vi.fn();

        const { result } = renderHook(
            () =>
                useFormMutation({
                    action: { mutationFn },
                    options: {
                        mapValues: (values) => ({ ...values, extra: 'added' }),
                        onSuccess,
                    },
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.onFinish({ name: 'Ada' });
        });

        await waitFor(() => expect(mutationFn).toHaveBeenCalledTimes(1));
        expect(mutationFn.mock.calls[0][0]).toEqual({ name: 'Ada', extra: 'added' });

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(onSuccess.mock.calls[0][0]).toMatchObject({
            payload: { name: 'Ada', extra: 'added' },
        });
    });

    it('skips submission when beforeSubmit returns false', () => {
        const mutationFn = vi.fn();

        const { result } = renderHook(
            () =>
                useFormMutation({
                    action: { mutationFn },
                    beforeSubmit: () => false,
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.onFinish({ anything: 'here' });
        });

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

        act(() => {
            result.current.onFinish({ anything: 'here' });
        });

        expect(mutationFn).not.toHaveBeenCalled();
    });

    it('invokes onError when the mutation rejects', async () => {
        const mutationFn = vi.fn().mockRejectedValue(new Error('nope'));
        const onError = vi.fn();

        const { result } = renderHook(
            () =>
                useFormMutation({
                    action: { mutationFn },
                    options: { onError },
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.onFinish({ value: 1 });
        });

        await waitFor(() => expect(onError).toHaveBeenCalled());
    });
});
