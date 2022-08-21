import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class QuantumComputerCentreClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50_000,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 40_000,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 50_000,
                increaseFactor: 1.8,
            },
            energy: {
                baseCost: 40,
                increaseFactor: 1.2,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.quantumComputerCentre;
    }
}

export const QuantumComputerCentre = new QuantumComputerCentreClass();
