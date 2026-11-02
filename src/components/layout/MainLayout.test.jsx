import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import globalReducer from '../../features/global/globalSlice';
import { authService } from '../../services/authService';
import MainLayout from './MainLayout';

vi.mock('../../services/authService', () => ({
    authService: { logout: vi.fn() },
}));

const renderLayout = () => {
    const store = configureStore({
        reducer: { auth: authReducer, global: globalReducer },
        preloadedState: {
            auth: {
                // isActive false keeps the session-expiry checker idle here.
                isActive: false,
                user: { usrFullName: 'Jane Doe', usrEmail: 'jane@example.com' },
                userRole: 'ADMIN',
                userId: null,
                maskedEmail: null,
                otpTimer: null,
            },
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<div>dashboard content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </Provider>
    );

    return store;
};

describe('MainLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the signed-in user and the routed page', () => {
        renderLayout();

        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('dashboard content')).toBeInTheDocument();
    });

    it('opens the navigation drawer from the menu button on small screens', async () => {
        const store = renderLayout();

        await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

        expect(store.getState().global.sideBarOpen).toBe(true);
        expect(
            await screen.findByRole('menuitem', { name: /Dashboard/ })
        ).toBeInTheDocument();
    });

    it('logs out from the avatar menu', async () => {
        renderLayout();

        await userEvent.click(screen.getByText('Jane Doe'));
        await userEvent.click(await screen.findByRole('button', { name: /Log out/ }));

        expect(authService.logout).toHaveBeenCalled();
    });
});
