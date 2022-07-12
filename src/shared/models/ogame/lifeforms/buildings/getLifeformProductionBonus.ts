import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { createRecord } from "@/shared/utils/createRecord";
import { addCost, Cost } from "../../common/Cost";
import { getLifeformLevel } from "../experience";
import { LifeformType, LifeformTypes, ValidLifeformTypes } from "../LifeformType";
import { LifeformTechnologyBonusLifeformBuildings, LifeformTechnologyBonusLifeformBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";

//TODO get total production bonus by lifeform buildings and technologies
/** returns production bonus by planet ids */
export function getLifeformProductionBonus(player: LocalPlayerData): Record<number, Cost> {
    const planets = Object.values(player.planets).filter(p => !p.isMoon) as PlanetData[];
    const productionBonusByPlanet: Record<number, Cost> = createRecord(
        planets.map(p => p.id),
        () => ({ metal: 0, crystal: 0, deuterium: 0, energy: 0 })
    );

    // bonus production buildings
    for (const planet of planets) {
        const productionBonusBuildings = ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform];
        const buildingProductionBonus = productionBonusBuildings.reduce<Cost>((total, building) => {
            const level = planet.lifeformBuildings[building.type];
            const bonus = building.getProductionBonus(level);
            return addCost(total, bonus);
        }, { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

        productionBonusByPlanet[planet.id] = addCost(productionBonusByPlanet[planet.id], buildingProductionBonus);
    }

    // get technology bonus per planet (level + buildings)
    const technologyBonusByPlanet = createRecord(planets.map(p => p.id), 0);
    const techBonusPerLevel = 0.01; // 1.0%
    const levelTechnologyBonus = createRecord(
        ValidLifeformTypes,
        lf => getLifeformLevel(player.lifeformExperience[lf]) * techBonusPerLevel
    );
    for (const planet of planets) {
        if (planet.activeLifeform == LifeformType.none) {
            technologyBonusByPlanet[planet.id] = 0;
            continue;
        }

        const levelBonus = levelTechnologyBonus[planet.activeLifeform];

        const technologyBonusBuildings = LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.activeLifeform];
        const technologyBonus = technologyBonusBuildings.reduce((total, building) => {
            const level = planet.lifeformBuildings[building.type];
            const bonus = building.getLifeformTechnologyBonus(level);
            return total + bonus;
        }, 0);

        const totalTechBonus = levelBonus + technologyBonus;
        technologyBonusByPlanet[planet.id] = totalTechBonus;
    }



    //TODO: lifeform technologies
    for (const planet of planets) {
        const technologyProductionBonus: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    }

    return productionBonusByPlanet;
}