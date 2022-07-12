import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { createRecord } from "@/shared/utils/createRecord";
import { addCost, Cost, multiplyCost } from "../../common/Cost";
import { LifeformType } from "../LifeformType";
import { ResourceProductionBonusLifeformTechnologies } from "../technologies/LifeformTechnologies";
import { getLifeformTechnologyBonus } from "./getLifeformTechnologyBonus";
import { ResourceProductionBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";

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
    const technologyBonusByPlanet = getLifeformTechnologyBonus(player);


    // production bonus
    // calculate first
    let techProductionBonus: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
    for (const planet of planets) {
        if (planet.activeLifeform == LifeformType.none) {
            continue;
        }

        const techFactor = 1 + technologyBonusByPlanet[planet.id];
        const productionBonusTechnologies = ResourceProductionBonusLifeformTechnologies.filter(
            tech => planet.activeLifeformTechnologies.includes(tech.type)
        );
        const baseProductionBonus = productionBonusTechnologies.reduce<Cost>((total, tech) => {
            const level = planet.lifeformTechnologies[tech.type];
            const bonus = tech.getProductionBonus(level);

            return addCost(total, bonus);
        }, { metal: 0, crystal: 0, deuterium: 0, energy: 0 });
        const productionBonus = multiplyCost(baseProductionBonus, techFactor);

        techProductionBonus = addCost(techProductionBonus, productionBonus);
    }

    // then apply everywhere
    for (const planet of planets) {
        productionBonusByPlanet[planet.id] = addCost(productionBonusByPlanet[planet.id], techProductionBonus);
    }

    return productionBonusByPlanet;
}