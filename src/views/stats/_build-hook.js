console.log('[stats view] generating routes');

const fs = require('fs');
const path = require('path');

/** @typedef RouteInfo
 *  @property {string} path
 *  @property {any} routeConfig
 *  @property {string} componentPath
 *  @property {number} depth
 */

const getRoutes = (dir, routePath, depth = 0) => {
    dir = dir.replace(/\\/g, '/');

    return fs.readdirSync(dir, { withFileTypes: true })
        .flatMap(file => {
            if (file.isDirectory()) {
                return getRoutes(`${dir}/${file.name}`, `${routePath}/${file.name.toLowerCase()}`, depth + 1);
            }

            if (path.parse(file.name).ext != '.vue') {
                return [];
            }

            const fileName = path.parse(file.name).name;
            const fileRouteConfigPath = `${dir}/route-config.${fileName}.js`;

            if (file.name.toLowerCase() == 'index.vue') {
                const routeConfigPaths = [
                    `${dir}/route-config.js`,
                    fileRouteConfigPath,
                ];
                const routeConfigPath = routeConfigPaths.find(path => fs.existsSync(path));

                /** @type RouteInfo */
                return {
                    path: routePath == '' ? '/' : routePath,
                    routeConfig: routeConfigPath != null ? require(routeConfigPath) : null,
                    componentPath: `${dir}/${file.name}`,
                    depth: depth,
                };
            }

            /** @type RouteInfo */
            return {
                path: `${routePath}/${fileName.toLowerCase()}`,
                routeConfig: fs.existsSync(fileRouteConfigPath) ? require(fileRouteConfigPath) : null,
                componentPath: `${dir}/${file.name}`,
                depth,
            };
        });
}

const viewsDir = `${__dirname}/views`;
/** @type RouteInfo[] */
const routes = getRoutes(viewsDir, '').sort((a, b) => a.depth - b.depth);
// console.log(JSON.stringify(routes, null, 4));

const routeTree = {};
const addRouteDeep = (route, path, root) => {
    const rootPath = path[0];

    if (!(rootPath in root)) {
        root[rootPath] = {
            path: rootPath,
            children: {},
        };
    }

    if (path.length == 1) {

        root[rootPath] = {
            ...(root[rootPath] ?? {}),
            ...route,
            path: rootPath,
        };
    } else {
        addRouteDeep(route, path.slice(1), root[rootPath].children);
    }
};

routes.forEach(route => {
    route.name = route.path.substring(1);
    const routeParts = ['/', ...route.name.split(/\//g).filter(n => n != '')];

    addRouteDeep(route, routeParts, routeTree);
});


const imports = {};
const getVueRoutes = (tree) => {
    return Object.values(tree).map(route => {

        /** @type import('vue-router').RouteConfig */
        let vueRoute = {
            path: route.path,
            name: route.name,
        };
        if (route.routeConfig != null) {
            vueRoute = {
                ...route.routeConfig,
                ...vueRoute,
            };
        }

        if (route.componentPath != null) {
            const localImportPath = route.componentPath.split('/views/stats/')[1];
            const importPath = '@stats/' + localImportPath;
            const componentName = localImportPath.replace(/\/|(\.vue)|\-/g, '');
            imports[componentName] = importPath;

            vueRoute.component = `() => import(/* webpackChunkName: "stats-view-${componentName}" */ '../${localImportPath}')`;
        }

        const children = getVueRoutes(route.children);
        if (children.length > 0) {
            vueRoute.children = children;
        }

        return vueRoute;
    });
};


/** @type import('vue-router').RouteConfig[] */
const vueRoutes = getVueRoutes(routeTree);

const code = `
        import { RouteConfig } from 'vue-router';

        const routes: RouteConfig[] = ${JSON.stringify(vueRoutes, null, 4)
            /* */.replace(/"component": "(.+)"(,|\n)/g, 'component: $1$2')
            /* */.replace(/"([^"]+)":/g, '$1:')
    /**/};

        export default routes;
        `;

fs.writeFileSync(`${__dirname}/router/routes.generated.ts`, code);