import { Cost } from '../common/Cost';
import { ShipType } from './ShipType';

//REFACTOR: methods to getters
export abstract class Ship {
    public abstract get type(): ShipType;
    public abstract get cost(): Cost;
    public abstract baseHull(): number;
    public abstract baseShield(): number;
    public abstract baseDamage(): number;
    public abstract baseSpeed(): number;
    public abstract baseCargoCapacity(): number;
    public abstract fuelConsumption(): number;
    //TODO: Rapidfire
    //TODO: type of drive depending on drive research levels
}