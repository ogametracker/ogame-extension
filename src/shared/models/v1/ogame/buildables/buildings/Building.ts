import Cost from "../Cost";

export default abstract class Building {
    public get usesSpace(): boolean {
        return true;
    }

    public abstract getCost(level: number): Cost;
}