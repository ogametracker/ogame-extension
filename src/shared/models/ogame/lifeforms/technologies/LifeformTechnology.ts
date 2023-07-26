import { Cost } from "../../common/Cost";
import { CostAndIncreaseFactor } from "../common-interfaces";
import { LifeformTechnologyType } from "../LifeformTechnologyType";
import { LifeformBonusType } from "../LifeformBonusType";

interface LifeformTechnologyConstructionParams {
    metal: CostAndIncreaseFactor;
    crystal: CostAndIncreaseFactor;
    deuterium: CostAndIncreaseFactor;
    energy: CostAndIncreaseFactor;
}

export abstract class LifeformTechnology {
    #metal: CostAndIncreaseFactor;
    #crystal: CostAndIncreaseFactor;
    #deuterium: CostAndIncreaseFactor;
    #energy: CostAndIncreaseFactor;

    protected constructor(data: LifeformTechnologyConstructionParams) {
        this.#metal = data.metal;
        this.#crystal = data.crystal;
        this.#deuterium = data.deuterium;
        this.#energy = data.energy;
    }

    public abstract get bonuses(): LifeformBonusType[];
    public abstract get type(): LifeformTechnologyType;

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