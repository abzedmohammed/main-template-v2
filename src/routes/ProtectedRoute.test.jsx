import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from './ProtectedRoute';

const renderWithAuth = (auth, { allowedRoles } = {}) => {
    const store = configureStore({ reducer: { auth: (state = auth) => state } });

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                        <Route path="/protected" element={<div>protected content</div>} />
                    </Route>
                    <Route path="/auth/login" element={<div>login page</div>} />
                    <Route path="/unauthorized" element={<div>unauthorized page</div>} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('ProtectedRoute', () => {
    it('redirects unauthenticated users to login', () => {
        renderWithAuth({ isActive: false, userRole: null }, { allowedRoles: ['ADMIN'] });

        expect(screen.getByText('login page')).toBeInTheDocument();
    });

    it('renders the route for an allowed role', () => {
        renderWithAuth(
            { isActive: true, userRole: 'ADMIN' },
            { allowedRoles: ['ADMIN'] }
        );

        expect(screen.getByText('protected content')).toBeInTheDocument();
    });

    it('redirects an authenticated user with a disallowed role to unauthorized', () => {
        renderWithAuth({ isActive: true, userRole: 'USER' }, { allowedRoles: ['ADMIN'] });

        expect(screen.getByText('unauthorized page')).toBeInTheDocument();
    });

    it('allows any authenticated user when no allowedRoles are set', () => {
        renderWithAuth({ isActive: true, userRole: 'ANYTHING' });

        expect(screen.getByText('protected content')).toBeInTheDocument();
    });

    it('matches roles case-insensitively', () => {
        renderWithAuth(
            { isActive: true, userRole: 'admin' },
            { allowedRoles: ['ADMIN'] }
        );

        expect(screen.getByText('protected content')).toBeInTheDocument();
    });
});
