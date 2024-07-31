import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { addCost, Cost, multiplyCost } from "../../common/Cost";
import { LifeformType } from "../LifeformType";
import { ResourceProductionBonusLifeformTechnologies } from "../technologies/LifeformTechnologies";
import { getLifeformTechnologyBonus } from "./getLifeformTechnologyBonus";

export function getLifeformTechnologyProductionBonus(player: LocalPlayerData): Cost {
    const planets = Object.values(player.planets).filter(p => !p.isMoon) as PlanetData[];

    // get technology bonus per planet (level + buildings)
    const technologyBonusByPlanet = getLifeformTechnologyBonus(player);

    // production bonus
    // calculate first
    const techProductionBonuses: Cost[] = [];
    for (const planet of planets) {
        if (planet.activeLifeform == LifeformType.none) {
            continue;
        }

        const productionBonusTechnologies = ResourceProductionBonusLifeformTechnologies.filter(
            tech => planet.activeLifeformTechnologies.includes(tech.type)
        );

        for (const tech of productionBonusTechnologies) {
            const techFactor = 1 + technologyBonusByPlanet[planet.id][tech.type];

            const level = planet.lifeformTechnologies[tech.type];
            const bonus = tech.getProductionBonus(level);

            const productionBonus = multiplyCost(bonus, techFactor);

            techProductionBonuses.push(productionBonus);
        }
    }

    return techProductionBonuses.reduce(
        (acc, cur) => addCost(acc, cur),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );;
}