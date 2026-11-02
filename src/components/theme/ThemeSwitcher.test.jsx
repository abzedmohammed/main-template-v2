import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from '../../features/global/globalSlice';
import ThemeSwitcher from './ThemeSwitcher';

const renderSwitcher = (props) => {
    const store = configureStore({ reducer: { global: globalReducer } });

    render(
        <Provider store={store}>
            <ThemeSwitcher {...props} />
        </Provider>
    );

    return store;
};

describe('ThemeSwitcher', () => {
    afterEach(() => {
        delete document.documentElement.dataset.theme;
    });

    it('shows the current mode, resolving "system" to what is on screen', () => {
        renderSwitcher();

        expect(
            screen.getByRole('button', { name: 'Theme: System (light)' })
        ).toBeInTheDocument();
    });

    it('switches theme from the dropdown', async () => {
        const store = renderSwitcher();

        await userEvent.click(
            screen.getByRole('button', { name: 'Theme: System (light)' })
        );
        await userEvent.click(await screen.findByText('Dark'));

        expect(store.getState().global.themeMode).toBe('dark');
        expect(screen.getByRole('button', { name: 'Theme: Dark' })).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('can hide the label and keep it as the accessible name', () => {
        renderSwitcher({ showLabel: false });

        const button = screen.getByRole('button', { name: 'Theme: System (light)' });

        expect(button).not.toHaveTextContent('Theme:');
    });
});
