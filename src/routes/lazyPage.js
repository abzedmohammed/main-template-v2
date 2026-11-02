// React Router `lazy` for a page exported from a module barrel:
//   { path: ROUTES.AUTH.LOGIN, lazy: lazyPage(() => import('../pages/auth'), 'Login') }
// Each module barrel becomes its own chunk, loaded the first time one of its routes matches.
export const lazyPage = (load, exportName) => async () => {
    const module = await load();
    const Component = module[exportName];

    if (!Component) {
        throw new Error(`lazyPage: "${exportName}" is not exported by this module`);
    }

    return { Component };
};
