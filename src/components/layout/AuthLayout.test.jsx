import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthLayout from './AuthLayout';

vi.mock('../theme', () => ({
    ThemeSwitcher: () => <div>theme switcher</div>,
}));

describe('AuthLayout', () => {
    it('renders the child route inside a centered column', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login" element={<div>login page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        const page = screen.getByText('login page');

        expect(page.parentElement).toHaveClass('fx_col_center', 'justify-center');
        expect(screen.getByText('theme switcher')).toBeInTheDocument();
    });
});
