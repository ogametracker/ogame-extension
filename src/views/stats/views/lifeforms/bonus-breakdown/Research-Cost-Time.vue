<template>
    <div>
        <select v-model="research" style="display: block; margin-bottom: 4px">
            <optgroup :label="translations().extension.empire.lifeforms.researchBonuses.researchCostTime.researches">
                <option v-for="research in Researches" :key="research" :value="research" v-text="translations().ogame.research[research]" />
            </optgroup>
            <option value="lifeform-researches" v-text="translations().extension.empire.lifeforms.researchBonuses.researchCostTime.lifeformResearches" />
        </select>

        <LifeformBonusesBreakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits">
            <template #header>
                <div style="display: flex; flex-direction: column; align-items: start" v-if="research == 'lifeform-researches'">
                    <span v-text="translations().extension.empire.lifeforms.researchBonuses.researchCostTime.lifeformResearches" />
                </div>
                <div style="display: flex; flex-direction: column; align-items: start" v-else>
                    <span>
                        <OResearch :research="research" class="mr-2" />
                        <span v-text="translations().ogame.research[research]" />
                    </span>
                </div>
            </template>
        </LifeformBonusesBreakdown>
    </div>
</template>

<script setup lang="ts">
import OResearch from '@stats/components/ogame/OResearch.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ResearchCostAndTimeReductionLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { ResearchCostAndTimeReductionLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type { CostAndTimeReduction } from '@ogame-tracker/shared/models/ogame/lifeforms/common-interfaces';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import { ResearchTypes } from '@ogame-tracker/shared/models/ogame/research/ResearchTypes';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';

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

    bugBonus: Bonuses;
};

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

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

const technologies = ResearchCostAndTimeReductionLifeformTechnologies;

const techs = computed<LifeformTechnologyType[]>(() => {
    const localResearch = research.value == 'lifeform-researches' ? LifeformTechnologyType.intergalacticEnvoys : research.value;

    return technologies
        .filter(tech => tech.appliesTo(localResearch))
        .map(t => t.type);
});

const limits = computed<Record<keyof Bonuses, (value: number) => number>>(() => {
    const localResearch = research.value == 'lifeform-researches'
        ? LifeformTechnologyType.intergalacticEnvoys
        : research.value;

    const costLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechCostReduction, tech: localResearch });
    const timeLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechTimeReduction, tech: localResearch });

    return {
        cost: value => costLimit != null ? Math.max(value, -costLimit) : value,
        time: value => timeLimit != null ? Math.max(value, -timeLimit) : value,
    };
});

const research = ref<ResearchType | 'lifeform-researches'>(ResearchType.energyTechnology);

const Researches = ResearchTypes.filter(b => technologies.some(tech => tech.appliesTo(b)));

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<keyof Bonuses>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet => technologies
            .map<LifeformBonusesPlanetBreakdown<keyof Bonuses>>(tech => {
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
                            bugBonus: planetBonuses.bugBonus[key],
                        })),
                };
            })
    );
});

const experience = computed(() => empireStore.lifeformExperience);

const hasResearchBonusBug = computed(() => {
    const [major, minor] = serverSettingsStore.serverSettings.version.split(/[\.\-]/g).map(s => parseInt(s));
    return major < 10 || (major == 10 && minor < 2);
});

function getPlanetBonus(tech: ResearchCostAndTimeReductionLifeformTechnology, planet: PlanetData): BonusBreakdown {
    const result: BonusBreakdown = {
        base: { cost: 0, time: 0 },
        level: { cost: 0, time: 0 },
        buildings: { cost: 0, time: 0 },
        buildingsBoost: 0,
        total: { cost: 0, time: 0 },
        bugBonus: { cost: 0, time: 0 },
    };
    const localResearch = research.value == 'lifeform-researches' ? LifeformTechnologyType.intergalacticEnvoys : research.value;

    if (planet.activeLifeform == LifeformType.none
        || !planet.activeLifeformTechnologies.includes(tech.type)
        || !tech.appliesTo(localResearch)
    ) {
        return result;
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );
    result.buildingsBoost += buildingsBoost;

    const bonuses = tech.getResearchCostAndTimeReduction(localResearch, planet.lifeformTechnologies[tech.type]);

    const mapping: Record<keyof Bonuses, keyof CostAndTimeReduction> = {
        cost: 'cost',
        time: 'time',
    };
    const hasBugBonus = hasResearchBonusBug.value;
    (Object.entries(mapping) as [keyof Bonuses, keyof CostAndTimeReduction][]).forEach(pair => {
        const [bonusType, statsType] = pair;

        const baseBonus = -1 * bonuses[statsType];
        result.base[bonusType] += baseBonus;

        const levelBoost = getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform as ValidLifeformType]);
        const lifeformLevelBonus = baseBonus * levelBoost;
        result.level[bonusType] += lifeformLevelBonus;

        const lifeformBuildingBonus = baseBonus * buildingsBoost;
        result.buildings[bonusType] += lifeformBuildingBonus;

        let bugBonus = 0;
        if (bonusType == 'time' && hasBugBonus) {
            const bonusFactor = 1 + buildingsBoost + levelBoost;
            const bugBonusFactor = bonusFactor ** 2 - bonusFactor;
            bugBonus = bugBonusFactor * baseBonus;
        }
        result.bugBonus[bonusType] = bugBonus;

        const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus + bugBonus;
        result.total[bonusType] += total;
    });

    return result;
}
</script>
