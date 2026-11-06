<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { FleetFuelReturnLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { FleetFuelReturnLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type BonusBreakdown = {
    base: number;
    level: number;
    buildings: number;
    buildingsBoost: number;
    total: number;
};

const empireStore = useEmpireStore();

const bonusTypes: LifeformBonusesBreakdownType<'fuelReturn'>[] = [
    {
        key: 'fuelReturn',
        label: translations().extension.empire.lifeforms.researchBonuses.fuelReturn.bonus,
    },
];

const technologies = FleetFuelReturnLifeformTechnologies;

const techs = computed<LifeformTechnologyType[]>(() => technologies.map(t => t.type));

const limits = computed<Record<'fuelReturn', (value: number) => number>>(() => {
    const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.FuelReturn });

    return {
        fuelReturn: value => limit != null ? Math.min(value, limit) : value,
    };
});

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<'fuelReturn'>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet => technologies
            .map<LifeformBonusesPlanetBreakdown<'fuelReturn'>>(tech => {
                const planetBonuses = getPlanetBonus(tech, planet);

                return {
                    planet,
                    technologyType: tech.type,
                    bonuses: createRecord<'fuelReturn', LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                        ['fuelReturn'],
                        key => ({
                            base: planetBonuses.base,
                            buildings: planetBonuses.buildings,
                            level: planetBonuses.level,
                            total: planetBonuses.total,
                        })),
                };
            })
    );
});

const experience = computed(() => empireStore.lifeformExperience);

function getPlanetBonus(tech: FleetFuelReturnLifeformTechnology, planet: PlanetData): BonusBreakdown {
    const result: BonusBreakdown = {
        base: 0,
        level: 0,
        buildings: 0,
        buildingsBoost: 0,
        total: 0,
    };

    if (planet.activeLifeform == LifeformType.none
        || !planet.activeLifeformTechnologies.includes(tech.type)
    ) {
        return result;
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );
    result.buildingsBoost += buildingsBoost;

    const baseBonus = tech.getFuelReturn(planet.lifeformTechnologies[tech.type]);
    const lifeformLevelBonus = baseBonus * getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform as ValidLifeformType]);
    const lifeformBuildingBonus = baseBonus * buildingsBoost;
    const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus;

    result.base += baseBonus;
    result.level += lifeformLevelBonus;
    result.buildings += lifeformBuildingBonus;
    result.total += total;

    return result;
}
</script>
