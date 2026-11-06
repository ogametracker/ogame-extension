import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { useSettingsStore } from '../data/SettingsDataModule';
import routes from './routes.generated';

const routeNames = new Set<string>();
const defaultRouteNames = new Map<string, string>();

function collectRouteNames(records: readonly RouteRecordRaw[]) {
    for (const record of records) {
        if (typeof record.name === 'string') {
            routeNames.add(record.name);
            if (
                typeof record.redirect === 'object' &&
                'name' in record.redirect &&
                typeof record.redirect.name === 'string'
            ) {
                defaultRouteNames.set(record.name, record.redirect.name);
            }
        }
        if (record.children) {
            collectRouteNames(record.children);
        }
    }
}
collectRouteNames(routes);

export function getDefaultRouteName(name: string): string | undefined {
    return defaultRouteNames.get(name);
}

export function createStatsRouter(settings: ReturnType<typeof useSettingsStore>) {
    function withSavedRedirects(records: readonly RouteRecordRaw[]): RouteRecordRaw[] {
        return records.map(record => {
            const children = record.children ? withSavedRedirects(record.children) : undefined;
            const name = typeof record.name === 'string' ? record.name : '';
            const redirect = defaultRouteNames.get(name);
            if (!redirect) {
                return children ? ({ ...record, children } as RouteRecordRaw) : record;
            }
            return {
                ...record,
                ...(children && { children }),
                redirect: () => {
                    const saved = settings.settings.defaultRoutes[name];
                    const isDescendant = name === '' || saved?.startsWith(name + '/');
                    return { name: saved && isDescendant && routeNames.has(saved) ? saved : redirect };
                },
            } as RouteRecordRaw;
        });
    }

    return createRouter({
        history: createWebHashHistory(),
        routes: withSavedRedirects(routes),
    });
}
