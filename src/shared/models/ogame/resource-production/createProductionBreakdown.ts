import { ProductionBreakdown } from "./types";

export function createProductionBreakdown(breakdown: Omit<ProductionBreakdown, 'total'>): ProductionBreakdown {
    return {
        ...breakdown,
        get total() {
            return Object.keys(this)
                .filter(k => k != 'total')
                .reduce((acc, cur) => acc + this[cur as Exclude<keyof ProductionBreakdown, 'total'>], 0);
        },
    };
}