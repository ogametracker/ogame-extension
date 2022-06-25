import { Cost } from '../common/Cost';

//REFACTOR: methods to getters
export abstract class Ship {
    public abstract getCost(): Cost;
    public abstract baseHull(): number;
    public abstract baseShield(): number;
    public abstract baseDamage(): number;
    public abstract baseSpeed(): number;
    public abstract baseCargoCapacity(): number;
    public abstract fuelConsumption(): number;
    //TODO: Rapidfire
    //TODO: type of drive depending on drive research levels
}