function getCrystalProductionBoost(position: number, serverPositionBoost: {
    default: number;
    pos1: number;
    pos2: number;
    pos3: number;
}) {
    switch (position) {
        case 1:
            return serverPositionBoost.pos1;

        case 2:
            return serverPositionBoost.pos2;

        case 3:
            return serverPositionBoost.pos3;
    }

    return serverPositionBoost.default;
}

export function getCrystalBaseProduction(dependencies: {
    planetPosition: number;
    serverEconomySpeed: number;
    serverPositionBoost: {
        default: number;
        pos1: number;
        pos2: number;
        pos3: number;
    };
}) {
    const boost = getCrystalProductionBoost(dependencies.planetPosition, dependencies.serverPositionBoost);
    const baseProduction = 15 * dependencies.serverEconomySpeed * (1 + boost);

    return baseProduction;
}