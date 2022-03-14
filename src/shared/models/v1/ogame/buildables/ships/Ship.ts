import Cost from "../Cost";

export default abstract class Ship {
    public abstract get cost(): Cost;
    public abstract get armor(): number;
    public abstract get shield(): number;
    public abstract get damage(): number;

    public abstract get speed(): number;
    public abstract get cargoCapacity(): number;
    public abstract get fuelConsumption(): number;

    //TODO: rapidfire
}