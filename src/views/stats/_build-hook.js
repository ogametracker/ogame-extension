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
                const metaPathAlt = `${dir}/_meta.index.js`;
                /** @type RouteInfo */
                return {
                    path: routePath == '' ? '/' : routePath,
                    meta: fs.existsSync(metaPath)
                        ? require(metaPath)
                        : fs.existsSync(metaPathAlt)
                            ? require(metaPathAlt)
                            : null,
                    componentPath: `${dir}/${file.name}`,
                    depth: depth,
                };
            }

            const fileName = path.parse(file.name).name;
            const metaPath = `${dir}/_meta.${fileName}.js`;
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
console.log(JSON.stringify(routes, null, 4));

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
        const vueRoute = {
            path: route.path,
            name: route.name,
        };
        if (route.meta != null) {
            vueRoute.meta = route.meta;
        }

        if (route.componentPath != null) {
            const localImportPath = route.componentPath.split('/views/stats/')[1];
            const importPath = '@stats/' + localImportPath;
            const componentName = localImportPath.replace(/\/|(\.vue)|\-/g, '');
            imports[componentName] = importPath;

            vueRoute.component = componentName;
        }

        const children = getVueRoutes(route.children);
        if(children.length > 0) {
            vueRoute.children = children;
        }

        return vueRoute;
    });
};

const addRedirectToFirstChild = (/** @type import('vue-router').RouteConfig */route) => {
    if((route.children?.length ?? 0) == 0) {
        return;
    }

    route.redirect = { name: route.children[0].name };
    route.children.forEach(childRoute => addRedirectToFirstChild(childRoute));
};


/** @type import('vue-router').RouteConfig[] */
const vueRoutes = getVueRoutes(routeTree);
vueRoutes.forEach(route => addRedirectToFirstChild(route));

imports['{ RouteConfig }'] = 'vue-router';
console.log(imports);

const code = Object.keys(imports)
    .map(name => `import ${name} from '${imports[name]}';`)
    .concat('')
    .concat(
        `const routes: RouteConfig[] = ${JSON.stringify(vueRoutes, null, 4)
            .replace(/"component": "(\w+)"/g, 'component: $1')
            .replace(/"([^"]+)":/g, '$1:')
        };`,
        'export default routes;',
    ).join('\n');

fs.writeFileSync(`${__dirname}/router/routes.generated.ts`, code);