import { Cost } from "../../common/Cost";
import { LifeformBuilding } from './LifeformBuilding';

export abstract class LifeformProductionBonusBuilding extends LifeformBuilding {
    public abstract getProductionBonus(level: number): Cost;
}