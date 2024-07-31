import { LocalPlayerData } from "@/shared/models/empire/LocalPlayerData";
import { PlanetData } from "@/shared/models/empire/PlanetData";
import { createRecord } from "@/shared/utils/createRecord";
import { getLifeformLevelTechnologyBonus } from "../experience";
import { LifeformType, ValidLifeformTypes } from "../LifeformType";
import { LifeformTechnologyBonusLifeformBuildingsByLifeform } from "./LifeformBuildings";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "../LifeformTechnologyType";

export function getLifeformTechnologyBonus(player: LocalPlayerData): Record<number, Record<LifeformTechnologyType, number>> {
    const planets = Object.values(player.planets).filter(p => !p.isMoon) as PlanetData[];

    const technologyBonusByPlanet = createRecord(
        planets.map(p => p.id),
        () => createRecord(LifeformTechnologyTypes, 0)
    );

    const levelTechnologyBonus = createRecord(
        ValidLifeformTypes,
        lf => getLifeformLevelTechnologyBonus(player.lifeformExperience[lf]),
    );
    for (const planet of planets) {
        if (planet.activeLifeform == LifeformType.none) {
            continue;
        }

        const levelBonus = levelTechnologyBonus[planet.activeLifeform];

        const technologyBonusBuildings = LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.activeLifeform];

        for (const technology of LifeformTechnologyTypes) {
            const technologyBonus = technologyBonusBuildings.reduce((total, building) => {
                const level = planet.lifeformBuildings[building.type];
                const bonus = building.getLifeformTechnologyBonus(technology, level);
                return total + bonus;
            }, 0);

            const totalTechBonus = levelBonus + technologyBonus;
            technologyBonusByPlanet[planet.id][technology] = totalTechBonus;
        }
    }

    return technologyBonusByPlanet;
}