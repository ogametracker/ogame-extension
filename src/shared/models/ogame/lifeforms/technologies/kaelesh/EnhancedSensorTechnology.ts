import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ExpeditionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class EnhancedSensorTechnologyClass extends LifeformTechnology implements ExpeditionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 25000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 20000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 10000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }
    
    public appliesTo(type: ExpeditionEventType): boolean {
        return type == ExpeditionEventType.resources;
    }
    
    public getExpeditionBonus(type: ExpeditionEventType, level: number): number {
        if(!this.appliesTo(type)) {
            return 0;
        }

        const bonusPerLevel = 0.00_2; //0.2%
        return bonusPerLevel * level;
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.enhancedSensorTechnology;
    }
}

export const EnhancedSensorTechnology = new EnhancedSensorTechnologyClass();
