import { Cost } from "../common/Cost";
import { BuildingType } from "./BuildingType";
import { StorageBuilding } from "./StorageBuilding";

class CrystalStorageClass extends StorageBuilding {

    public get type() {
        return BuildingType.crystalStorage;
    }

    public getStorage(level: number): number {
        return Math.floor(2.5 * Math.E ** (20 * level / 33)) * 5_000;
    }

    public getDenPercentage(level: number): number {
        return Math.min(0.1, level * 0.01);
    }

    public getCost(level: number): Cost {
        return {
            metal: 500 * 2 ** level,
            crystal: 250 * 2 ** level,
            deuterium: 0,
            energy: 0,
        };
    }
}

export const CrystalStorage = new CrystalStorageClass();
