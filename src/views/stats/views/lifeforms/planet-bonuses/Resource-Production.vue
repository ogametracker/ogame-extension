<template>
    <LifeformPlanetBonusesComponent
        :technologyBonuses="technologyBonuses"
        :types="bonusTypes"
        :buildings="buildings"
        :planets="planets"
        :limits="limits"
        research-bonus-breakdown-route-name="lifeforms/bonus-breakdown/resource-production"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import LifeformPlanetBonusesComponent from '@stats/components/lifeforms/LifeformPlanetBonuses.vue';
import type { LifeformPlanetBonusesType, LifeformPlanetBonuses } from '@stats/components/lifeforms/LifeformPlanetBonuses.vue';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';
import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformBuildingsByType, ResourceProductionBonusLifeformBuildings } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { ResourceProductionBonusLifeformBuilding } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/interfaces';
import { ResourceProductionBonusLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { getLifeformTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/getLifeformTechnologyBonus';
import type { ResourceProductionBonusLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';

const empireStore = useEmpireStore();

const bonusTypes = computed<LifeformPlanetBonusesType<keyof Cost>[]>(() => {
    return [
        {
            key: 'metal',
            label: translations().ogame.resources.metal,
        },
        {
            key: 'crystal',
            label: translations().ogame.resources.crystal,
        },
        {
            key: 'deuterium',
            label: translations().ogame.resources.deuterium,
        },
        {
            key: 'energy',
            label: translations().ogame.resources.energy,
        },
    ];
});

const buildings: LifeformBuildingType[] = ResourceProductionBonusLifeformBuildings.map(b => b.type);

const limits = computed<Record<keyof Cost, (value: number) => number>>(() => {
    const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ResourceProductionBonus });
    return {
        metal: value => limit != null ? Math.min(value, limit) : value,
        crystal: value => limit != null ? Math.min(value, limit) : value,
        deuterium: value => limit != null ? Math.min(value, limit) : value,
        energy: value => limit != null ? Math.min(value, limit) : value,
    };
});

const techs: ResourceProductionBonusLifeformTechnology[] = ResourceProductionBonusLifeformTechnologies;

const technologyBonuses = computed<Record<keyof Cost, number>>(() => {
    const keys: (keyof Cost)[] = ['metal', 'crystal', 'deuterium', 'energy'];
    const globalBonuses: Record<keyof Cost, number> = createRecord(keys, () => 0);

    const lifeformTechnologyBoostPerPlanet = getLifeformTechnologyBonus(empireStore.empire);
    empirePlanets.value.forEach(planet => {
        techs.filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
            .forEach(tech => keys.forEach(key => {
                const techBonus = tech.getProductionBonus(planet.lifeformTechnologies[tech.type])[key];
                const techBoost = lifeformTechnologyBoostPerPlanet[planet.id][tech.type];

                globalBonuses[key] += techBonus * (1 + techBoost);
            }));
    });

    return globalBonuses;
});

const empirePlanets = computed(() => {
    return empireStore.empire.planetOrder
        .map(id => empireStore.empire.planets[id])
        .filter(planet => !planet.isMoon) as PlanetData[];
});

const planets = computed<Record<number, LifeformPlanetBonuses<keyof Cost>>>(() => {
    return createMappedRecord(
        empirePlanets.value,

        planet => planet.id,
        planet => {
            const activeBuildingTypes = LifeformBuildingTypesByLifeform[planet.activeLifeform].filter(b => buildings.includes(b));
            const bonusByBuilding = createRecord<keyof Cost, Record<LifeformBuildingType, number>>(
                ['metal', 'crystal', 'deuterium', 'energy'],
                key => createRecord(
                    activeBuildingTypes,
                    type => (LifeformBuildingsByType[type] as ResourceProductionBonusLifeformBuilding)
                        .getProductionBonus(planet.lifeformBuildings[type])[key]
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
