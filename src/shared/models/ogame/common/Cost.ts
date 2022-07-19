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

export function multiplyCost(cost: Cost, factor: number, integerValues = true): Cost {
    const result: Cost = {
        metal: cost.metal * factor,
        crystal: cost.crystal * factor,
        deuterium: cost.deuterium * factor,
        energy: cost.energy * factor,
    };

    if(!integerValues) {
        return result;
    }

    return {
        metal: Math.round(result.metal),
        crystal: Math.round(result.crystal),
        deuterium: Math.round(result.deuterium),
        energy: Math.round(result.energy),
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