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
vi.mock('../pages', () => ({
    Unauthorized: 'unauthorized',
}));

const { getRoutesForRole, ROLE_ROUTE_MAPPING } = await import('./roleBasedRoutes');

describe('getRoutesForRole', () => {
    it('returns the admin tree for ADMIN users', () => {
        expect(getRoutesForRole('ADMIN')).toEqual(ROLE_ROUTE_MAPPING.ADMIN);
    });

    it('is case-insensitive on the role key', () => {
        expect(getRoutesForRole('admin')).toEqual(ROLE_ROUTE_MAPPING.ADMIN);
    });

    it('returns public (auth + home) routes when not authenticated', () => {
        expect(getRoutesForRole()).toEqual([
            { path: '/auth/login', element: 'login' },
            { path: '/', element: 'home' },
        ]);
    });

    it('locks out authenticated users whose role has no route tree', () => {
        const routes = getRoutesForRole('SUPPORT');

        expect(routes).toHaveLength(1);
        expect(routes[0].path).toBe('*');
        expect(routes).not.toEqual(getRoutesForRole());
    });
});
