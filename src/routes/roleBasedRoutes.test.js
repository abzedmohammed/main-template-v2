import { vi } from 'vitest';

vi.mock('./adminRoutes', () => ({
    adminRoutes: [{ path: '/dashboard', element: 'admin-dashboard' }],
}));
vi.mock('./authRoutes', () => ({
    authRoutes: [{ path: '/auth/login', element: 'login' }],
}));
vi.mock('./homeRoutes', () => ({
    homeRoutes: [{ path: '/', element: 'home' }],
}));

const { getRoutesForRole, ROLE_ROUTE_MAPPING } = await import('./roleBasedRoutes');

describe('getRoutesForRole', () => {
    it('returns the admin tree for ADMIN users', () => {
        expect(getRoutesForRole('ADMIN')).toEqual(ROLE_ROUTE_MAPPING.ADMIN);
    });

    it('is case-insensitive on the role key', () => {
        expect(getRoutesForRole('admin')).toEqual(ROLE_ROUTE_MAPPING.ADMIN);
    });

    it('falls back to auth + home routes when no role is provided', () => {
        expect(getRoutesForRole()).toEqual([
            { path: '/auth/login', element: 'login' },
            { path: '/', element: 'home' },
        ]);
    });

    it('falls back to auth + home routes for unknown roles', () => {
        expect(getRoutesForRole('SUPPORT')).toEqual(getRoutesForRole());
    });
});
