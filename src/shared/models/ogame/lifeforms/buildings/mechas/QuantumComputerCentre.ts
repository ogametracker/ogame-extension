import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class QuantumComputerCentreClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 50000,
                increaseFactor: 1.8,
            },
            crystal: {
                baseCost: 40000,
                increaseFactor: 1.8,
            },
            deuterium: {
                baseCost: 50000,
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
