<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { addCost, multiplyCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ResourceProductionBonusLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { LifeformTechnologiesByType, ResourceProductionBonusLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type ResourceProductionBonusBreakdown = {
    base: Cost;
    level: Cost;
    buildings: Cost;
    buildingsBoost: number;
    total: Cost;
};

const empireStore = useEmpireStore();

const bonusTypes: LifeformBonusesBreakdownType<keyof Cost>[] = [
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

const techs: LifeformTechnologyType[] = ResourceProductionBonusLifeformTechnologies.map(t => t.type);

const limits = computed<Record<'metal' | 'crystal' | 'deuterium' | 'energy', (value: number) => number>>(() => {
    const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ResourceProductionBonus });
    return {
        metal: value => limit != null ? Math.min(value, limit) : value,
        crystal: value => limit != null ? Math.min(value, limit) : value,
        deuterium: value => limit != null ? Math.min(value, limit) : value,
        energy: value => limit != null ? Math.min(value, limit) : value,
    };
});

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<keyof Cost>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet => techs.map<LifeformBonusesPlanetBreakdown<keyof Cost>>(techType => {
            const tech = LifeformTechnologiesByType[techType] as ResourceProductionBonusLifeformTechnology;
            const planetBonuses = getPlanetBonus(tech, planet);

            return {
                planet,
                technologyType: techType,
                bonuses: createRecord<keyof Cost, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                    ['metal', 'crystal', 'deuterium', 'energy'],
                    key => ({
                        base: planetBonuses.base[key],
                        buildings: planetBonuses.buildings[key],
                        level: planetBonuses.level[key],
                        total: planetBonuses.total[key],
                    })),
            };
        })
    );
});

const experience = computed(() => empireStore.lifeformExperience);

function getPlanetBonus(tech: ResourceProductionBonusLifeformTechnology, planet: PlanetData): ResourceProductionBonusBreakdown {
    if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
        return {
            base: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
            level: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
            buildings: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
            buildingsBoost: 0,
            total: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        };
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );

    const baseBonus = tech.getProductionBonus(planet.lifeformTechnologies[tech.type]);
    const lifeformLevelBonus = multiplyCost(baseBonus, getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform]));
    const lifeformBuildingBonus = multiplyCost(baseBonus, buildingsBoost);

    return {
        base: baseBonus,
        level: lifeformLevelBonus,
        buildings: lifeformBuildingBonus,
        buildingsBoost,
        total: addCost(baseBonus, lifeformLevelBonus, lifeformBuildingBonus),
    };
}
</script>
