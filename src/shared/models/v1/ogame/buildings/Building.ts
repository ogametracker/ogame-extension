import { Cost } from "../common/Cost";

export abstract class Building {
    public abstract getCost(level: number): Cost;
}