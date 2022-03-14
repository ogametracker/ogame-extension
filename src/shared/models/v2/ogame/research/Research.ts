import { Cost } from "../common/Cost";

export abstract class Research {
    public abstract getCost(level: number): Cost;
}