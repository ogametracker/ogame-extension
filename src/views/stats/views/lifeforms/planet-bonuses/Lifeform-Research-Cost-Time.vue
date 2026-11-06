<template>
    <lifeform-planet-bonuses-component
        :technologyBonuses="technologyBonuses"
        :types="bonusTypes"
        :buildings="buildings"
        :planets="planets"
        :limits="limits"
        research-bonus-breakdown-route-name="lifeforms/bonus-breakdown/research-cost-time"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import LifeformPlanetBonusesComponent from '@stats/components/lifeforms/LifeformPlanetBonuses.vue';
import type { LifeformPlanetBonusesType, LifeformPlanetBonuses } from '@stats/components/lifeforms/LifeformPlanetBonuses.vue';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';
import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformBuildingsByType, LifeformTechnologyResearchBuildings } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { LifeformTechnologyResearchBuilding } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/interfaces';
import { ResearchCostAndTimeReductionLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { getLifeformTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/getLifeformTechnologyBonus';
import type { ResearchCostAndTimeReductionLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';

type Bonuses = {
    cost: number;
    time: number;
};

const empireStore = useEmpireStore();

const bonusTypes = computed<LifeformPlanetBonusesType<keyof Bonuses>[]>(() => {
    return [
        {
            key: 'cost',
            label: translations().extension.empire.lifeforms.researchBonuses.buildingCostTime.cost,
        },
        {
            key: 'time',
            label: translations().extension.empire.lifeforms.researchBonuses.buildingCostTime.time,
        },
    ];
});

const buildings: LifeformBuildingType[] = LifeformTechnologyResearchBuildings.map(b => b.type);

const limits = computed<Record<keyof Bonuses, (value: number) => number>>(() => {
    const research = LifeformTechnologyType.intergalacticEnvoys;

    const costLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechCostReduction, tech: research });
    const timeLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechTimeReduction, tech: research });

    return {
        cost: value => costLimit != null ? Math.max(value, -costLimit) : value,
        time: value => timeLimit != null ? Math.max(value, -timeLimit) : value,
    };
});

const techs: ResearchCostAndTimeReductionLifeformTechnology[] = ResearchCostAndTimeReductionLifeformTechnologies;

const technologyBonuses = computed<Record<keyof Bonuses, number>>(() => {
    const research = LifeformTechnologyType.intergalacticEnvoys;

    const keys: (keyof Bonuses)[] = ['cost', 'time'];
    const globalBonuses: Record<keyof Bonuses, number> = createRecord(keys, () => 0);

    const lifeformTechnologyBoostPerPlanet = getLifeformTechnologyBonus(empireStore.empire);
    empirePlanets.value.forEach(planet => {
        techs.filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
            .forEach(tech => keys.forEach(key => {
                const techBonus = tech.getResearchCostAndTimeReduction(research, planet.lifeformTechnologies[tech.type])[key];
                const techBoost = lifeformTechnologyBoostPerPlanet[planet.id][tech.type];

                globalBonuses[key] += -1 * techBonus * (1 + techBoost);
            }));
    });

    return globalBonuses;
});

const empirePlanets = computed(() => {
    return empireStore.empire.planetOrder
        .map(id => empireStore.empire.planets[id])
        .filter(planet => !planet.isMoon) as PlanetData[];
});

const planets = computed<Record<number, LifeformPlanetBonuses<keyof Bonuses>>>(() => {
    return createMappedRecord(
        empirePlanets.value,

        planet => planet.id,
        planet => {
            const activeBuildingTypes = LifeformBuildingTypesByLifeform[planet.activeLifeform].filter(b => buildings.includes(b));
            const bonusByBuilding = createRecord<keyof Bonuses, Record<LifeformBuildingType, number>>(
                ['cost', 'time'],
                key => createRecord(
                    activeBuildingTypes,
                    type => -1 * (LifeformBuildingsByType[type] as LifeformTechnologyResearchBuilding)
                        .getLifeformTechnologyResearchCostAndTimeReduction(planet.lifeformBuildings[type])[key]
                )
            );

            return {
                planet,
                bonusByBuilding,
            }
        }
    );
});
</script>
