import { ExpeditionEventType } from "@/shared/models/expeditions/ExpeditionEventType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ExpeditionBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";

class PsionicNetworkClass extends LifeformTechnology implements ExpeditionBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 15_000,
                increaseFactor: 1.5,
            },
            crystal: {
                baseCost: 10_000,
                increaseFactor: 1.5,
            },
            deuterium: {
                baseCost: 5_000,
                increaseFactor: 1.5,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }
    
    public appliesTo(type: ExpeditionEventType): boolean {
        return type == ExpeditionEventType.lostFleet;
    }
    
    public getExpeditionBonus(type: ExpeditionEventType, level: number): number {
        if(!this.appliesTo(type)) {
            return 0;
        }

        const reductionPerLevel = 0.00_05; //0.05%
        const maxReduction = 0.5; //50%

        // negative because reduction = -bonus
        return -Math.min(maxReduction, reductionPerLevel * level);
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.psionicNetwork;
    }
}

export const PsionicNetwork = new PsionicNetworkClass();
