import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { createRecord } from "@/shared/utils/createRecord";
import { getLifeformLevel } from "../experience";
import { LifeformType, ValidLifeformTypes } from "../LifeformType";
import { LifeformTechnologyBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";

export function getLifeformTechnologyBonus(player: LocalPlayerData): Record<number, number> {
    const planets = Object.values(player.planets).filter(p => !p.isMoon) as PlanetData[];
    const technologyBonusByPlanet = createRecord(planets.map(p => p.id), 0);
    const techBonusPerLevel = 0.01; // 1.0%
    const levelTechnologyBonus = createRecord(
        ValidLifeformTypes,
        lf => getLifeformLevel(player.lifeformExperience[lf]) * techBonusPerLevel
    );
    for (const planet of planets) {
        if (planet.activeLifeform == LifeformType.none) {
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

    return technologyBonusByPlanet;
}