import { Cost } from "../common/Cost";
import { BuildingType } from "./BuildingType";

export abstract class Building {
    public abstract getCost(level: number): Cost;
    public abstract get type(): BuildingType;
}