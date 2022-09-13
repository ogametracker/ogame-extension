import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class KaeleshDiscovererEnhancementClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 300000,
                increaseFactor: 1.7,
            },
            crystal: {
                baseCost: 180000,
                increaseFactor: 1.7,
            },
            deuterium: {
                baseCost: 120000,
                increaseFactor: 1.7,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.kaeleshDiscovererEnhancement;
    }
}

export const KaeleshDiscovererEnhancement = new KaeleshDiscovererEnhancementClass();
