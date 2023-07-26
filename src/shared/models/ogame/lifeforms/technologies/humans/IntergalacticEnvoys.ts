import { FleetMissionType, FleetMissionTypes } from "../../../fleets/FleetMissionType";
import { LifeformBonusType, LifeformBonusTypeId } from "../../LifeformBonusType";
import { LifeformTechnologyType } from "../../LifeformTechnologyType";
import { LifeformTechnology } from "../LifeformTechnology";
import { FleetSpeedBonusLifeformTechnology } from "../interfaces";

class IntergalacticEnvoysClass extends LifeformTechnology implements FleetSpeedBonusLifeformTechnology {
    public constructor() {
        super({
            metal: {
                baseCost: 5_000,
                increaseFactor: 1.3,
            },
            crystal: {
                baseCost: 2_500,
                increaseFactor: 1.3,
            },
            deuterium: {
                baseCost: 500,
                increaseFactor: 1.3,
            },
            energy: {
                baseCost: 0,
                increaseFactor: 1,
            },
        });
    }

    public get bonuses(): LifeformBonusType[] {
        return FleetMissionTypes.filter(m => this.appliesTo(m))
            .map<LifeformBonusType>(missionType => ({
                type: LifeformBonusTypeId.FleetSpeedBonus,
                missionType,
            }));
    }

    appliesTo(type: FleetMissionType): boolean {
        return type == FleetMissionType.searchForLifeforms;
    }

    getFleetSpeedBonus(mission: FleetMissionType, level: number): number {
        if (!this.appliesTo(mission)) {
            return 0;
        }

        if (level == 1) {
            return 0;
        }

        const bonusPerLevel = 0.01; //1%
        return bonusPerLevel * level;
    }

    public get type(): LifeformTechnologyType {
        return LifeformTechnologyType.intergalacticEnvoys;
    }
}

export const IntergalacticEnvoys = new IntergalacticEnvoysClass();
