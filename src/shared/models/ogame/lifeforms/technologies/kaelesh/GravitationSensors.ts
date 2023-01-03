import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ExpeditionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class GravitationSensorsClass extends LifeformTechnology implements ExpeditionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 240_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 120_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 120_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }
    
    public appliesTo(type: ExpeditionEventType): boolean {
        return type == ExpeditionEventType.darkMatter;
    }
    
    public getExpeditionBonus(type: ExpeditionEventType, level: number): number {
        if(!this.appliesTo(type)) {
            return 0;
        }

        const bonusPerLevel = 0.00_1; //0.1%
        return bonusPerLevel * level;
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.gravitationSensors;
    }
}

export const GravitationSensors = new GravitationSensorsClass();
