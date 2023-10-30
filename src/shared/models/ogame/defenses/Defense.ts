import { Cost } from '../common/Cost';
import { DefenseType } from './DefenseType';

export abstract class Defense {
    public abstract get type(): DefenseType;
    public abstract get cost(): Cost;
    public abstract get baseHull(): number;
    public abstract get baseShield(): number;
    public abstract get baseDamage(): number;

    //TODO: Rapidfire
    //TODO: type of drive depending on drive research levels
}