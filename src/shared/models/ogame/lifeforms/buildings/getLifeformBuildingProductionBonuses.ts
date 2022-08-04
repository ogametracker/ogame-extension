import { PlanetData } from "@/shared/models/empire/PlanetData";
import { addCost, Cost } from "../../common/Cost";
import { ResourceProductionBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";

export function getLifeformBuildingProductionBonus(planet: PlanetData): Cost {

    const productionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform];
    const buildingProductionBonus = productionBonusBuildings.map<Cost>(building => {
        const level = planet.lifeformBuildings[building.type];
        const bonus = building.getProductionBonus(level);
        return bonus;
    });

    return buildingProductionBonus.reduce(
        (acc, cur) => addCost(acc, cur),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );
}