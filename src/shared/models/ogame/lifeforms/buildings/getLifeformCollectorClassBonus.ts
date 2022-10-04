import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { PlayerClass } from "../../classes/PlayerClass";
import { LifeformType } from "../LifeformType";
import { ClassBonusLifeformTechnologies } from "../technologies/LifeformTechnologies";
import { getLifeformTechnologyBonus } from "./getLifeformTechnologyBonus";

export function getLifeformCollectorClassBonus(player: LocalPlayerData): number {
    const planets = Object.values(player.planets).filter(p => !p.isMoon) as PlanetData[];

    // get technology bonus per planet (level + buildings)
    const technologyBonusByPlanet = getLifeformTechnologyBonus(player);

    // get collector class bonus
    let totalCollectorBonus = 0;
    for (const planet of planets) {
        if (planet.activeLifeform == LifeformType.none) {
            continue;
        }

        const techFactor = 1 + technologyBonusByPlanet[planet.id];
        const collectorBonusTechnologies = ClassBonusLifeformTechnologies.filter(
            tech => planet.activeLifeformTechnologies.includes(tech.type)
        );
        const baseCollectorBonus = collectorBonusTechnologies.reduce<number>((total, tech) => {
            const level = planet.lifeformTechnologies[tech.type];
            const bonus = tech.getClassBonus(PlayerClass.collector, level);
            return total + bonus;
        }, 0);
        const collectorBonus = baseCollectorBonus * technologyBonusByPlanet[planet.id];

        totalCollectorBonus += collectorBonus;
    }

    return totalCollectorBonus;
}