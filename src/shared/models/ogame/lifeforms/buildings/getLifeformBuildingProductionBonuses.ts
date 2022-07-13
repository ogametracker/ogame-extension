import { PlanetData } from "@/shared/models/empire/PlanetData";
import { addCost, Cost } from "../../common/Cost";
import { ResourceProductionBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";

export function getLifeformBuildingProductionBonuses(planet: PlanetData): Cost[] {
    
    const productionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform];
    const buildingProductionBonus = productionBonusBuildings.map<Cost>(building => {
        const level = planet.lifeformBuildings[building.type];
        const bonus = building.getProductionBonus(level);
        return bonus;
    });

    return buildingProductionBonus;
}