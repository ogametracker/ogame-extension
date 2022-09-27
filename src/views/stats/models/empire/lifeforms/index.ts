import { PlanetData } from "@/shared/models/empire/PlanetData";
import { addCost, Cost } from "@/shared/models/ogame/common/Cost";
import { LifeformTechnologyBonusLifeformBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from "@/shared/models/ogame/lifeforms/buildings/LifeformBuildings";
import { ClassBonusLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from "@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies";

export function getPlanetCollectorClassBonusFactor(planet: PlanetData): number {
    return ClassBonusLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce(
            (total, tech) => total + tech.getClassBonus(planet.lifeformTechnologies[tech.type]),
            0
        );
}

export function getPlanetLifeformTechnologyBoost(planet: PlanetData): number {
    return LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.activeLifeform]
        .reduce(
            (total, building) => total + building.getLifeformTechnologyBonus(planet.lifeformBuildings[building.type]),
            0
        );
}

export function getPlanetLifeformBuildingBonusProductionFactor(planet: PlanetData): Cost {
    return ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform].reduce<Cost>(
        (total, building) => addCost(total, building.getProductionBonus(planet.lifeformBuildings[building.type])),
        { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
    );
}

export function getPlanetLifeformTechnologyBonusProductionFactor(planet: PlanetData): Cost {
    return ResourceProductionBonusLifeformTechnologies
        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
        .reduce<Cost>(
            (total, tech) => addCost(total, tech.getProductionBonus(planet.lifeformTechnologies[tech.type])),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        );
}