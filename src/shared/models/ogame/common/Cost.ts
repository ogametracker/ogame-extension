export interface Cost {
    metal: number;
    crystal: number;
    deuterium: number;
    energy: number;
}

export function addCost(a: Cost, b: Cost): Cost {
    return {
        metal: a.metal + b.metal,
        crystal: a.crystal + b.crystal,
        deuterium: a.deuterium + b.deuterium,
        energy: a.energy + b.energy,
    };
}

export function subCost(a: Cost, b: Cost): Cost {
    return {
        metal: a.metal - b.metal,
        crystal: a.crystal - b.crystal,
        deuterium: a.deuterium - b.deuterium,
        energy: a.energy - b.energy,
    };
}

export function multiplyCost(cost: Cost, factor: number): Cost {
    return {
        metal: cost.metal * factor,
        crystal: cost.crystal * factor,
        deuterium: cost.deuterium * factor,
        energy: cost.energy * factor,
    };
}

export function multiplyCostComponentWise(cost: Cost, factors: Cost): Cost {
    return {
        metal: cost.metal * factors.metal,
        crystal: cost.crystal * factors.crystal,
        deuterium: cost.deuterium * factors.deuterium,
        energy: cost.energy * factors.energy,
    };
}