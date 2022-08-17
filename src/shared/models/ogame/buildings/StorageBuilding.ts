import { Building } from "./Building";

export abstract class StorageBuilding extends Building {
    public abstract getStorage(level: number): number;
    public abstract getDenPercentage(level: number): number;
}