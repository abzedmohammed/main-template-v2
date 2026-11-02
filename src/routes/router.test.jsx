import { createRoleBasedRouter, router } from './router';
import { ROUTES } from './paths';

const topLevelPaths = (appRouter) => appRouter.routes.map((route) => route.path);

describe('router', () => {
    it('ends every tree with the 403, 404 and catch-all fallbacks', () => {
        for (const appRouter of [router, createRoleBasedRouter('ADMIN')]) {
            expect(topLevelPaths(appRouter).slice(-3)).toEqual([
                ROUTES.UNAUTHORIZED,
                ROUTES.NOT_FOUND,
                '*',
            ]);
        }
    });

    it('serves the public auth routes to signed-out visitors', () => {
        const childPaths = router.routes.flatMap((route) =>
            (route.children ?? []).map((child) => child.path)
        );

        expect(childPaths).toContain(ROUTES.AUTH.LOGIN);
    });

    it('uses hash URLs for static hosting', () => {
        expect(router.createHref({ pathname: '/auth/login' })).toBe('#/auth/login');
    });
});
