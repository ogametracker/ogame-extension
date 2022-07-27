import { _throw } from "@/shared/utils/_throw";

function getMetalProductionBoost(position: number) {
    switch (position) {
        case 8:
            return 0.35;

        case 7:
        case 9:
            return 0.23;

        case 6:
        case 10:
            return 0.17;
    }

    return 0;
}

export function getMetalBaseProduction(dependencies: {
    planetPosition: number;
    serverEconomySpeed: number;
}) {
    const boost = getMetalProductionBoost(dependencies.planetPosition);
    const baseProduction = 30 * dependencies.serverEconomySpeed * (1 + boost);

    return Math.trunc(baseProduction);
}