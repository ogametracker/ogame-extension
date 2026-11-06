<template>
    <LifeformBonusesBreakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { CrawlerProductionBonusAndConsumptionReductionLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type Bonuses = {
    production: number;
    energyConsumption: number;
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
        key: 'production',
        label: translations().extension.empire.lifeforms.researchBonuses.crawlers.productionBonus,
    },
    {
        key: 'energyConsumption',
        label: translations().extension.empire.lifeforms.researchBonuses.crawlers.energyConsumption,
    },
];

const technologies = CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies;

const techs = computed<LifeformTechnologyType[]>(() => technologies.map(t => t.type));

const limits = computed<Record<keyof Bonuses, (value: number) => number>>(() => {
    const energyConsumptionLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.CrawlerEnergyConsumptionReduction });
    const productionLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.CrawlerBonus });

    return {
        energyConsumption: value => energyConsumptionLimit != null ? Math.max(value, -energyConsumptionLimit) : value,
        production: value => productionLimit != null ? Math.min(value, productionLimit) : value,
    };
});

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
                        ['production', 'energyConsumption'],
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

function getPlanetBonus(tech: CrawlerProductionBonusAndConsumptionReductionLifeformTechnology, planet: PlanetData): BonusBreakdown {
    const result: BonusBreakdown = {
        base: { production: 0, energyConsumption: 0 },
        level: { production: 0, energyConsumption: 0 },
        buildings: { production: 0, energyConsumption: 0 },
        buildingsBoost: 0,
        total: { production: 0, energyConsumption: 0 },
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

    const bonuses = {
        production: tech.getCrawlerProductionBonus(planet.lifeformTechnologies[tech.type]),
        energyConsumption: -tech.getCrawlerConsumptionReduction(planet.lifeformTechnologies[tech.type]).energy,
    };

    const mapping: Record<keyof Bonuses, keyof typeof bonuses> = {
        production: 'production',
        energyConsumption: 'energyConsumption',
    };
    (Object.entries(mapping) as [keyof Bonuses, keyof typeof bonuses][]).forEach(pair => {
        const [bonusType, statsType] = pair;

        const baseBonus = bonuses[statsType];
        const lifeformLevelBonus = baseBonus * getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform as ValidLifeformType]);
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
