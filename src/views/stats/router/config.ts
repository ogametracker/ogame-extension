import type { RouteMeta } from 'vue-router';

export interface StatsRouteConfig {
    meta?: RouteMeta;
    redirect?: { name: string };
}

declare module 'vue-router' {
    interface RouteMeta {
        color?: string;
    }
}
