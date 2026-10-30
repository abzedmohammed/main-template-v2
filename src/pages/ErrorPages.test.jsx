import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { ErrorPage, NotFound, Unauthorized } from './ErrorPages';

// Only ROUTES is needed — skip loading the whole route/page tree.
vi.mock('../routes', async () => ({
    ROUTES: (await import('../routes/paths')).ROUTES,
}));

const makeStore = (auth = {}) => {
    const authSlice = createSlice({
        name: 'auth',
        initialState: { isActive: false, userRole: null, ...auth },
        reducers: {},
    });

    return configureStore({ reducer: { auth: authSlice.reducer } });
};

const renderPage = (ui, auth) =>
    render(
        <Provider store={makeStore(auth)}>
            <MemoryRouter>{ui}</MemoryRouter>
        </Provider>
    );

const renderErrorElement = (thrown) => {
    const Boom = () => {
        throw thrown;
    };
    const router = createMemoryRouter([
        { path: '/', element: <Boom />, errorElement: <ErrorPage /> },
    ]);

    render(
        <Provider store={makeStore()}>
            <RouterProvider router={router} />
        </Provider>
    );
};

describe('NotFound', () => {
    it('shows the 404 message', () => {
        renderPage(<NotFound />);

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it.each([
        [{ isActive: false }, 'Login'],
        [{ isActive: true, userRole: 'ADMIN' }, 'Go to Dashboard'],
        [{ isActive: true, userRole: 'USER' }, 'Go Home'],
    ])('labels the home button for %o as "%s"', (auth, label) => {
        renderPage(<NotFound />, auth);

        expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });

    it('offers a Go Back button', async () => {
        renderPage(<NotFound />);

        await userEvent.click(screen.getByRole('button', { name: 'Go Back' }));

        expect(screen.getByText('404')).toBeInTheDocument();
    });
});

describe('Unauthorized', () => {
    it('shows the 403 message with the current role', () => {
        renderPage(<Unauthorized />, { isActive: true, userRole: 'USER' });

        expect(screen.getByText('403')).toBeInTheDocument();
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
        expect(screen.getByText('USER')).toBeInTheDocument();
    });

    it('shows "Unknown" when there is no role', () => {
        renderPage(<Unauthorized />);

        expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
});

describe('ErrorPage', () => {
    beforeEach(() => {
        // React logs caught render errors; keep the test output clean.
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the 404 page for a thrown 404 response', () => {
        renderErrorElement(new Response('', { status: 404 }));

        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    it('renders the generic error page for anything else', () => {
        renderErrorElement(new Error('boom'));

        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
});
