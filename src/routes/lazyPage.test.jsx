import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import globalReducer from '../features/global/globalSlice';
import { authRoutes } from './authRoutes';
import { lazyPage } from './lazyPage';
import { ROUTES } from './paths';

describe('lazyPage', () => {
    it('resolves the named export as the route Component', async () => {
        const Page = () => null;

        await expect(lazyPage(async () => ({ Page }), 'Page')()).resolves.toEqual({
            Component: Page,
        });
    });

    it('fails loudly when the export name is wrong', async () => {
        await expect(lazyPage(async () => ({}), 'Missing')()).rejects.toThrow(
            'lazyPage: "Missing" is not exported by this module'
        );
    });
});

describe('lazy auth routes', () => {
    it('loads and renders the login page on demand', async () => {
        const store = configureStore({
            reducer: { auth: authReducer, global: globalReducer },
        });
        const router = createMemoryRouter(authRoutes, {
            initialEntries: [ROUTES.AUTH.LOGIN],
        });

        render(
            <QueryClientProvider client={new QueryClient()}>
                <Provider store={store}>
                    <RouterProvider router={router} />
                </Provider>
            </QueryClientProvider>
        );

        expect(
            await screen.findByRole('heading', { name: 'Welcome back' })
        ).toBeInTheDocument();
    });
});
