import { Cost } from "../../common/Cost";

interface CostAndIncreaseFactor {
    baseCost: number;
    increaseFactor: number;
}
interface LifeformBuildingConstructionParams {
    metal: CostAndIncreaseFactor;
    crystal: CostAndIncreaseFactor;
    deuterium: CostAndIncreaseFactor;
    energy: CostAndIncreaseFactor;
    //TODO: lifeform cost missing
}

export abstract class LifeformBuilding {
    #metal: CostAndIncreaseFactor;
    #crystal: CostAndIncreaseFactor;
    #deuterium: CostAndIncreaseFactor;
    #energy: CostAndIncreaseFactor;

    protected constructor(data: LifeformBuildingConstructionParams) {
        this.#metal = data.metal;
        this.#crystal = data.crystal;
        this.#deuterium = data.deuterium;
        this.#energy = data.energy;
    }

    public getCost(level: number): Cost {
        return {
            metal: this.getResourceCost(this.#metal.baseCost, this.#metal.increaseFactor, level),
            crystal: this.getResourceCost(this.#crystal.baseCost, this.#crystal.increaseFactor, level),
            deuterium: this.getResourceCost(this.#deuterium.baseCost, this.#deuterium.increaseFactor, level),
            energy: this.getResourceCost(this.#energy.baseCost, this.#energy.increaseFactor, level),
        };
    }

    private getResourceCost(baseCost: number, increaseFactor: number, level: number): number {
        return Math.floor(baseCost * increaseFactor ** (level - 1) * level);
    }
}