import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class PlanetaryShieldClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250000,
                increaseFactor: 1.2,
            },
            crystal: {
                baseCost: 125000,
                increaseFactor: 1.2,
            },
            deuterium: {
                baseCost: 125000,
                increaseFactor: 1.2,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.02,
            },
        });
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.planetaryShield;
    }
}

export const PlanetaryShield = new PlanetaryShieldClass();
