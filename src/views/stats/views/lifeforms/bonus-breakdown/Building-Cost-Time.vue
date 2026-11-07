<template>
    <div>
        <select v-model.number="building" style="display: block; margin-bottom: 4px">
            <option
                v-for="building in Buildings"
                :key="building"
                :value="building"
                v-text="translations().ogame.buildings[building]"
            />
        </select>

        <LifeformBonusesBreakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits">
            <template #header>
                <div style="display: flex; flex-direction: column; align-items: start">
                    <span>
                        <OBuilding :building="building" class="mr-2" />
                        <span v-text="translations().ogame.buildings[building]" />
                    </span>
                </div>
            </template>
        </LifeformBonusesBreakdown>
    </div>
</template>

<script setup lang="ts">
import OBuilding from '@stats/components/ogame/OBuilding.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { BuildingCostAndTimeReductionLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { BuildingCostAndTimeReductionLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type {
    LifeformBonusesBreakdownType,
    LifeformBonusesPlanetBreakdown,
} from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { BuildingTypes } from '@ogame-tracker/shared/models/ogame/buildings/BuildingTypes';
import type { CostAndTimeReduction } from '@ogame-tracker/shared/models/ogame/lifeforms/common-interfaces';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type Bonuses = {
    cost: number;
    time: number;
};

type BonusBreakdown = {
    base: Bonuses;
    level: Bonuses;
    buildings: Bonuses;
    buildingsBoost: number;
    total: Bonuses;
};

const empireStore = useEmpireStore();

const bonusTypes: LifeformBonusesBreakdownType<keyof Bonuses>[] = [
    {
        key: 'cost',
        label: translations().extension.empire.lifeforms.researchBonuses.buildingCostTime.cost,
    },
    {
        key: 'time',
        label: translations().extension.empire.lifeforms.researchBonuses.buildingCostTime.time,
    },
];

const technologies = BuildingCostAndTimeReductionLifeformTechnologies;

const techs = computed<LifeformTechnologyType[]>(() => {
    return technologies.filter(tech => tech.appliesTo(building.value)).map(t => t.type);
});

const limits = computed<Record<keyof Bonuses, (value: number) => number>>(() => {
    const costLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechCostReduction, tech: building.value });
    const timeLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechTimeReduction, tech: building.value });

    return {
        cost: value => (costLimit != null ? Math.max(value, -costLimit) : value),
        time: value => (timeLimit != null ? Math.max(value, -timeLimit) : value),
    };
});

const building = ref(BuildingType.allianceDepot);

const Buildings = BuildingTypes.filter(b => technologies.some(tech => tech.appliesTo(b)));

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<keyof Bonuses>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet =>
            technologies.map<LifeformBonusesPlanetBreakdown<keyof Bonuses>>(tech => {
                const planetBonuses = getPlanetBonus(tech, planet);

                return {
                    planet,
                    technologyType: tech.type,
                    bonuses: createRecord<keyof Bonuses, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                        ['cost', 'time'],
                        key => ({
                            base: planetBonuses.base[key],
                            buildings: planetBonuses.buildings[key],
                            level: planetBonuses.level[key],
                            total: planetBonuses.total[key],
                        }),
                    ),
                };
            }),
    );
});

const experience = computed(() => empireStore.lifeformExperience);

function getPlanetBonus(tech: BuildingCostAndTimeReductionLifeformTechnology, planet: PlanetData): BonusBreakdown {
    const result: BonusBreakdown = {
        base: { cost: 0, time: 0 },
        level: { cost: 0, time: 0 },
        buildings: { cost: 0, time: 0 },
        buildingsBoost: 0,
        total: { cost: 0, time: 0 },
    };

    if (
        planet.activeLifeform == LifeformType.none
        || !planet.activeLifeformTechnologies.includes(tech.type)
        || !tech.appliesTo(building.value)
    ) {
        return result;
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );
    result.buildingsBoost += buildingsBoost;

    const bonuses = tech.getBuildingCostAndTimeReduction(building.value, planet.lifeformTechnologies[tech.type]);

    const mapping: Record<keyof Bonuses, keyof CostAndTimeReduction> = {
        cost: 'cost',
        time: 'time',
    };
    (Object.entries(mapping) as [keyof Bonuses, keyof CostAndTimeReduction][]).forEach(pair => {
        const [bonusType, statsType] = pair;

        const baseBonus = -1 * bonuses[statsType];
        const lifeformLevelBonus =
            baseBonus * getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform as ValidLifeformType]);
        const lifeformBuildingBonus = baseBonus * buildingsBoost;

        const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus;

        result.base[bonusType] += baseBonus;
        result.level[bonusType] += lifeformLevelBonus;
        result.buildings[bonusType] += lifeformBuildingBonus;
        result.total[bonusType] += total;
    });

    return result;
}
</script>
