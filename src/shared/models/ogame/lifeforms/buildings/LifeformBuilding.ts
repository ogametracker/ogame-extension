import { Cost } from "../../common/Cost";

export abstract class LifeformBuilding {
    #metalBaseCost: number;
    #metalIncreaseFactor: number;

    #crystalBaseCost: number;
    #crystalIncreaseFactor: number;

    #deuteriumBaseCost: number;
    #deuteriumIncreaseFactor: number;

    #energyBaseCost: number;
    #energyIncreaseFactor: number;

    protected constructor(
        metalBaseCost: number, metalIncreaseFactor: number,
        crystalBaseCost: number, crystalIncreaseFactor: number,
        deuteriumBaseCost: number, deuteriumIncreaseFactor: number,
        energyBaseCost: number, energyIncreaseFactor: number,
        //TODO: lifeform cost missing
    ) {
        this.#metalBaseCost = metalBaseCost;
        this.#metalIncreaseFactor = metalIncreaseFactor;
        this.#crystalBaseCost = crystalBaseCost;
        this.#crystalIncreaseFactor = crystalIncreaseFactor;
        this.#deuteriumBaseCost = deuteriumBaseCost;
        this.#deuteriumIncreaseFactor = deuteriumIncreaseFactor;
        this.#energyBaseCost = energyBaseCost;
        this.#energyIncreaseFactor = energyIncreaseFactor;
    }

    public getCost(level: number): Cost {
        return {
            metal: this.getResourceCost(this.#metalBaseCost, this.#metalIncreaseFactor, level),
            crystal: this.getResourceCost(this.#crystalBaseCost, this.#crystalIncreaseFactor, level),
            deuterium: this.getResourceCost(this.#deuteriumBaseCost, this.#deuteriumIncreaseFactor, level),
            energy: this.getResourceCost(this.#energyBaseCost, this.#energyIncreaseFactor, level),
        };
    }

    private getResourceCost(baseCost: number, increaseFactor: number, level: number): number {
        return Math.floor(baseCost * increaseFactor ** (level - 1) * level);
    }
}