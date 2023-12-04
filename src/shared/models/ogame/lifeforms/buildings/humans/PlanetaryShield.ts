import { LifeformBonusType } from "../../LifeformBonusType";
import { LifeformBuildingType } from "../../LifeformBuildingType";
import { LifeformBuilding } from "../LifeformBuilding";

class PlanetaryShieldClass extends LifeformBuilding {
    public constructor() {
        super({
            metal: {
                baseCost: 250_000,
                increaseFactor: 1.15,
            },
            crystal: {
                baseCost: 125_000,
                increaseFactor: 1.15,
            },
            deuterium: {
                baseCost: 125_000,
                increaseFactor: 1.15,
            },
            energy: {
                baseCost: 100,
                increaseFactor: 1.02,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return [];
    }

    public get type(): LifeformBuildingType {
        return LifeformBuildingType.planetaryShield;
    }
}

export const PlanetaryShield = new PlanetaryShieldClass();
