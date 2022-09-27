import { Cost } from '../common/Cost';

export abstract class Missile {
    public abstract get cost(): Cost;
    public abstract get baseHull(): number;
    public abstract get baseShield(): number;
    public abstract get baseDamage(): number;
    //TODO: speed
}