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
import type {
    ExpeditionBonusLifeformTechnology,
    ExpeditionEventProbabilityBonusLifeformTechnology,
} from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import {
    ExpeditionBonusLifeformTechnologies,
    ExpeditionEventProbabilityBonusLifeformTechnologies,
    LifeformTechnologiesByType,
} from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type {
    LifeformBonusesBreakdownType,
    LifeformBonusesPlanetBreakdown,
} from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { ExpeditionEventType } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type ExpeditionBonuses = {
    resources: number;
    ships: number;
    darkMatter: number;
    fleetLoss: number;
};

type ExpeditionBonusBreakdown = {
    base: ExpeditionBonuses;
    level: ExpeditionBonuses;
    buildings: ExpeditionBonuses;
    buildingsBoost: number;
    total: ExpeditionBonuses;
};

const empireStore = useEmpireStore();

const bonusTypes: LifeformBonusesBreakdownType<keyof ExpeditionBonuses>[] = [
    {
        key: 'resources',
        label: translations().extension.empire.lifeforms.researchBonuses.expeditionFinds.resources,
    },
    {
        key: 'ships',
        label: translations().extension.empire.lifeforms.researchBonuses.expeditionFinds.ships,
    },
    {
        key: 'darkMatter',
        label: translations().ogame.premium.darkMatter,
    },
    {
        key: 'fleetLoss',
        label: translations().extension.empire.lifeforms.researchBonuses.expeditionFinds.fleetLoss,
    },
];

const technologies = [...ExpeditionEventProbabilityBonusLifeformTechnologies, ...ExpeditionBonusLifeformTechnologies];

const techs: LifeformTechnologyType[] = technologies.map(t => t.type);

const limits = computed<Record<keyof ExpeditionBonuses, (value: number) => number>>(() => {
    const resourcesLimit = getLifeformBonusLimit({
        type: LifeformBonusTypeId.ExpeditionBonus,
        event: ExpeditionEventType.resources,
    });
    const shipsLimit = getLifeformBonusLimit({
        type: LifeformBonusTypeId.ExpeditionBonus,
        event: ExpeditionEventType.fleet,
    });
    const darkMatterLimit = getLifeformBonusLimit({
        type: LifeformBonusTypeId.ExpeditionBonus,
        event: ExpeditionEventType.darkMatter,
    });
    const fleetLossLimit = getLifeformBonusLimit({
        type: LifeformBonusTypeId.ExpeditionEventProbabilityBonus,
        event: ExpeditionEventType.lostFleet,
    });

    return {
        resources: value => (resourcesLimit != null ? Math.min(value, resourcesLimit) : value),
        ships: value => (shipsLimit != null ? Math.min(value, shipsLimit) : value),
        darkMatter: value => (darkMatterLimit != null ? Math.min(value, darkMatterLimit) : value),
        fleetLoss: value => (fleetLossLimit != null ? Math.max(value, -fleetLossLimit) : value),
    };
});

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<keyof ExpeditionBonuses>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet =>
            techs.map<LifeformBonusesPlanetBreakdown<keyof ExpeditionBonuses>>(techType => {
                const tech = LifeformTechnologiesByType[techType] as
                    | ExpeditionBonusLifeformTechnology
                    | ExpeditionEventProbabilityBonusLifeformTechnology;
                const planetBonuses = getPlanetBonus(tech, planet);

                return {
                    planet,
                    technologyType: techType,
                    bonuses: createRecord<keyof ExpeditionBonuses, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                        ['resources', 'ships', 'darkMatter', 'fleetLoss'],
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

function getPlanetBonus(
    tech: ExpeditionBonusLifeformTechnology | ExpeditionEventProbabilityBonusLifeformTechnology,
    planet: PlanetData,
): ExpeditionBonusBreakdown {
    const result: ExpeditionBonusBreakdown = {
        base: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
        level: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
        buildings: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
        buildingsBoost: 0,
        total: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
    };
    if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
        return result;
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );
    result.buildingsBoost += buildingsBoost;

    const mapping: Record<keyof ExpeditionBonuses, ExpeditionEventType> = {
        resources: ExpeditionEventType.resources,
        ships: ExpeditionEventType.fleet,
        darkMatter: ExpeditionEventType.darkMatter,
        fleetLoss: ExpeditionEventType.lostFleet,
    };
    (Object.entries(mapping) as [keyof ExpeditionBonuses, ExpeditionEventType][]).forEach(pair => {
        const [bonusType, eventType] = pair;

        const baseBonus =
            'getExpeditionBonus' in tech
                ? tech.getExpeditionBonus(eventType, planet.lifeformTechnologies[tech.type])
                : tech.getExpeditionEventProbabilityBonus(eventType, planet.lifeformTechnologies[tech.type]);
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
