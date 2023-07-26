import { ExpeditionEventType, ExpeditionEventTypes } from "@/shared/models/expeditions/ExpeditionEventType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { ExpeditionEventProbabilityBonusLifeformTechnology } from "../interfaces";
import { LifeformTechnology } from "../LifeformTechnology";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";

class PsionicNetworkClass extends LifeformTechnology implements ExpeditionEventProbabilityBonusLifeformTechnology {
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

    public get bonuses(): LifeformBonusType[] {
        return ExpeditionEventTypes.filter(t => this.appliesTo(t))
            .map<LifeformBonusType>(event => ({
                type: LifeformBonusTypeId.ExpeditionEventProbabilityBonus,
                event,
            }));
    }

    public appliesTo(type: ExpeditionEventType): boolean {
        return type == ExpeditionEventType.lostFleet;
    }

    public getExpeditionEventProbabilityBonus(type: ExpeditionEventType, level: number): number {
        if (!this.appliesTo(type)) {
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
