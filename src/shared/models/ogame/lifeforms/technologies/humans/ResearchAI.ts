import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";

class ResearchAIClass extends LifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 35_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 25_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 15_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.researchAI;
    }
}

export const ResearchAI = new ResearchAIClass();
