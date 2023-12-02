import { Cost } from "../common/Cost";
import { Building } from "./Building";
import { BuildingType } from "./BuildingType";

class SpaceDockClass extends Building {

    public get type() {
        return BuildingType.spaceDock;
    }

    public getCost(level: number): Cost {
        return {
            metal: 40 * 4 ** level,
            crystal: 0,
            deuterium: 10 * 5 ** level,
            energy: 10 * 5 ** level,
        };
    }

    public getWreckfield(level: number, debrisFieldSetting: number): number {
        const wreckfieldPercentage = 1 - debrisFieldSetting;
        return wreckfieldPercentage * (Math.round(45 * level ** 0.08) * 0.01);
    }
}

export const SpaceDock = new SpaceDockClass();
