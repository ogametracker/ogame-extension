import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { addCost, Cost, multiplyCost } from "../../common/Cost";
import { LifeformType } from "../LifeformType";
import { ResourceProductionBonusLifeformTechnologies } from "../technologies/LifeformTechnologies";
import { getLifeformTechnologyBonus } from "./getLifeformTechnologyBonus";


/** returns lifeform tech production bonus by planet ids */
export function getLifeformTechnologyProductionBonuses(player: LocalPlayerData): Cost[] {
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

        techProductionBonuses.push(productionBonus);
    }

    return techProductionBonuses;
}