const fs = require('fs');
const path = require('path');

/** @typedef RouteInfo
 *  @property {string} path
 *  @property {any} meta
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

            if (file.name.toLowerCase() == 'index.vue') {
                const metaPath = `${dir}/_meta.js`;
                /** @type RouteInfo */
                return {
                    path: routePath == '' ? '/' : routePath,
                    meta: fs.existsSync(metaPath) ? require(metaPath) : null,
                    componentPath: `${dir}/${file.name}`,
                    depth,
                };
            }

            const metaPath = `${dir}/_meta.${file.name}.js`;
            const fileName = path.parse(file.name).name;
            /** @type RouteInfo */
            return {
                path: `${routePath}/${fileName.toLowerCase()}`,
                meta: fs.existsSync(metaPath) ? require(metaPath) : null,
                componentPath: `${dir}/${file.name}`,
                depth,
            };
        });
}

const viewsDir = `${__dirname}/views`;
/** @type RouteInfo[] */
const routes = getRoutes(viewsDir, '').sort((a, b) => a.depth - b.depth);

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
            ...route,
            path: rootPath,
            children: {},
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
        const vueRoute = {
            path: route.path,
            meta: route.meta,
            name: route.name,
        };

        if(route.componentPath != null) {
            const localImportPath = route.componentPath.split('/views/stats/')[1];
            const importPath = '@stats/' + localImportPath;
            const componentName = localImportPath.replace(/\/|(\.vue)|\-/g, '');
            imports[componentName] = importPath;

            vueRoute.component = componentName;
        }

        vueRoute.children = getVueRoutes(route.children);
    });
};
/** @type import('vue-router').RouteConfig[] */
const vueRoutes = getVueRoutes(routeTree);


console.log(JSON.stringify(vueRoutes, null, 4));
console.log(JSON.stringify(imports, null, 4));

//TODO: generate views