import { PlanetData } from "@/shared/models/empire/PlanetData";
import { PlayerClass } from "@/shared/models/ogame/classes/PlayerClass";
import { addCost, Cost } from "@/shared/models/ogame/common/Cost";
import { LifeformTechnologyBonusLifeformBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { LifeformTechnologyType, LifeformTechnologyTypes } from "@/shared/models/ogame/lifeforms/LifeformTechnologyType";
import { ClassBonusLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";
import { createRecord } from "@/shared/utils/createRecord";

export function getPlanetCollectorClassBonusFactor(planet: PlanetData): number {
    return ClassBonusLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce(
            (total, tech) => total + tech.getClassBonus(PlayerClass.collector, planet.lifeformTechnologies[tech.type]),
            0
        );
}

export function getPlanetLifeformTechnologyBoost(planet: PlanetData): Record<LifeformTechnologyType, number> {
    return createRecord(LifeformTechnologyTypes,
        technology => LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.activeLifeform]
            .map(building => building.getLifeformTechnologyBonus(technology, planet.lifeformBuildings[building.type]))
            .reduce((total, cur) => total + cur, 0)
    );
}

export function getPlanetLifeformBuildingBonusProductionFactor(planet: PlanetData): Cost {
    return ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform].reduce<Cost>(
        (total, building) => addCost(total, building.getProductionBonus(planet.lifeformBuildings[building.type])),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );
}

export function getPlanetLifeformTechnologyBonusProductionFactor(planet: PlanetData): Record<keyof Cost, Record<LifeformTechnologyType, number>> {
    return ResourceProductionBonusLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce<Record<keyof Cost, Record<LifeformTechnologyType, number>>>(
            (total, tech) => {
                const bonus = tech.getProductionBonus(planet.lifeformTechnologies[tech.type]);

                total.metal[tech.type] += bonus.metal;
                total.crystal[tech.type] += bonus.crystal;
                total.deuterium[tech.type] += bonus.deuterium;
                total.energy[tech.type] += bonus.energy;

                return total;
            },
            {
                metal: createRecord(LifeformTechnologyTypes, 0),
                crystal: createRecord(LifeformTechnologyTypes, 0),
                deuterium: createRecord(LifeformTechnologyTypes, 0),
                energy: createRecord(LifeformTechnologyTypes, 0),
            },
        );
}