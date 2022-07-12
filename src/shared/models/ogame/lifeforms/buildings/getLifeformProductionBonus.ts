import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { addCost, Cost } from "../../common/Cost";
import { LifeformTechnologyBonusLifeformBuildings, ResourceProductionBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";

//TODO get total production bonus by lifeform buildings and technologies
export function getLifeformProductionBonus(player: LocalPlayerData, planet: PlanetData): Cost {

    const productionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform];
    const buildingProductionBonus = productionBonusBuildings.reduce<Cost>((total, building) => {
        const level = planet.lifeformBuildings[building.type];
        const bonus = building.getProductionBonus(level);
        return addCost(total, bonus);
    }, { metal: 0, crystal: 0, deuterium: 0, energy: 0 });


    const technologyBonusBuildings = LifeformTechnologyBonusLifeformBuildings;
    const technologyBonus = technologyBonusBuildings.reduce((total, building) => {
        const level = planet.lifeformBuildings[building.type];
        const bonus = building.getLifeformTechnologyBonus(level);
        return total + bonus;
    }, 0);
    
    //TODO: lifeform experience tech bonus
    
    //TODO: lifeform technologies



    const technologyProductionBonus: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    return addCost(buildingProductionBonus, technologyProductionBonus);
}