<template>
    <div>
        <select v-model.number="playerClass" style="display: block; margin-bottom: 4px">
            <option v-for="playerClass in PlayerClasses" :key="playerClass" :value="playerClass" v-text="translations().extension.playerClasses[playerClass]" />
        </select>

        <grid-table inline :columns="classBonusesColumns" :items="classBonusesRows">
            <template #cell-base="{ value, item }">
                <decimal-number v-if="item.isPercentage" :value="value * 100" suffix="%" :digits="3" :fade-decimals="false" />
                <decimal-number v-else :value="value" :digits="value % 1 == 0 ? 0 : 3" />
            </template>
            <template #cell-actual="{ value, item }">
                <decimal-number v-if="item.isPercentage" :value="value * 100" suffix="%" :digits="3" :fade-decimals="false" />
                <decimal-number v-else :value="value" :digits="value % 1 == 0 ? 0 : 3" :fade-decimals="false" />
            </template>
        </grid-table>

        <hr />

        <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ClassBonusLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
import { ClassBonusLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
import LifeformBonusesBreakdown from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import type { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { PlayerClass, SelectablePlayerClasses } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';

type ClassBonusBreakdown = {
    base: number;
    level: number;
    buildings: number;
    buildingsBoost: number;
    total: number;
};

type ClassBonusValues = {
    label: string;
    isPercentage: boolean;
    base: number;
    actual: number;
}

const serverSettingsStore = useServerSettingsStore();

const empireStore = useEmpireStore();

const serverSettings = computed(() => serverSettingsStore.serverSettings);

const classBonusesRows = computed<ClassBonusValues[]>(() => {
    const totalBonus = Object.values(planets.value).reduce(
        (total, cur) => total + cur.reduce(
            (total, cur) => total + cur.bonuses.classBonus.total,
            0
        ),
        0);

    switch (playerClass.value) {
        case PlayerClass.collector:
            return getCollectorClassBonusesRows(totalBonus);

        case PlayerClass.discoverer:
            return getDiscovererClassBonusesRows(totalBonus);

        case PlayerClass.general:
            return getGeneralClassBonusesRows(totalBonus);
    }

    throw new Error('invalid player class');
});

const limits = computed<Record<'classBonus', (value: number) => number>>(() => {
    const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.PlayerClassBonus, playerClass: playerClass.value });

    return {
        classBonus: value => limit != null ? Math.min(value, limit) : value,
    };
});

function getCollectorClassBonusesRows(classBonus: number): ClassBonusValues[] {
    const factor = 1 + classBonus;
    return [
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.collector.productionBonus,
            base: serverSettings.value.playerClasses.collector.productionFactorBonus,
            actual: serverSettings.value.playerClasses.collector.productionFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.collector.energyProductionBonus,
            base: serverSettings.value.playerClasses.collector.energyProductionFactorBonus,
            actual: serverSettings.value.playerClasses.collector.energyProductionFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.collector.transporterSpeedBonus,
            base: serverSettings.value.playerClasses.collector.tradingShips.speedFactorBonus,
            actual: serverSettings.value.playerClasses.collector.tradingShips.speedFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.collector.transporterCargoBonus,
            base: serverSettings.value.playerClasses.collector.tradingShips.cargoCapacityFactorBonus,
            actual: serverSettings.value.playerClasses.collector.tradingShips.cargoCapacityFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.collector.crawlerProductionBonus,
            base: serverSettings.value.playerClasses.collector.crawlers.productionFactorBonus,
            actual: serverSettings.value.playerClasses.collector.crawlers.productionFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.collector.geologistCrawlerAmountBonus,
            base: serverSettings.value.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
            actual: serverSettings.value.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus * factor,
            isPercentage: true,
        },
    ];
}

function getDiscovererClassBonusesRows(classBonus: number): ClassBonusValues[] {
    const factor = 1 + classBonus;
    return [
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.researchDuration,
            base: -serverSettings.value.playerClasses.discoverer.researchSpeedFactor,
            actual: -serverSettings.value.playerClasses.discoverer.researchSpeedFactor * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.increasedExpeditionFinds,
            base: serverSettings.value.playerClasses.discoverer.expeditions.outcomeFactorBonus,
            actual: serverSettings.value.playerClasses.discoverer.expeditions.outcomeFactorBonus * (1 + classBonus * 3), //TODO: fix formula when discoverer bonus formula fixed
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.largerPlanets,
            base: serverSettings.value.playerClasses.discoverer.planetSizeFactorBonus,
            actual: serverSettings.value.playerClasses.discoverer.planetSizeFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.additionalExpeditionSlots,
            base: serverSettings.value.playerClasses.discoverer.bonusExpeditionSlots,
            actual: serverSettings.value.playerClasses.discoverer.bonusExpeditionSlots * factor,
            isPercentage: false,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.reducedExpeditionCombatChance,
            base: -0.5, //TODO: value not in server settings
            actual: -0.5 * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.phalanxRange,
            base: serverSettings.value.playerClasses.discoverer.phalanxRangeFactorBonus,
            actual: serverSettings.value.playerClasses.discoverer.phalanxRangeFactorBonus * factor,
            isPercentage: true,
        },
    ];
}

function getGeneralClassBonusesRows(classBonus: number): ClassBonusValues[] {
    const factor = 1 + classBonus;
    return [
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.combatShipSpeed,
            base: serverSettings.value.playerClasses.general.combatShipSpeedFactorBonus,
            actual: serverSettings.value.playerClasses.general.combatShipSpeedFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.recyclerSpeed,
            base: serverSettings.value.playerClasses.general.recyclers.speedFactorBonus,
            actual: serverSettings.value.playerClasses.general.recyclers.speedFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.fuelConsumption,
            base: -serverSettings.value.playerClasses.general.deuteriumConsumptionFactorReduction,
            actual: -serverSettings.value.playerClasses.general.deuteriumConsumptionFactorReduction * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.increasedCargoRecyclersPathfinders,
            base: serverSettings.value.playerClasses.general.recyclers.cargoCapacityFactorBonus,
            actual: serverSettings.value.playerClasses.general.recyclers.cargoCapacityFactorBonus * factor,
            isPercentage: true,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.additionalCombatResearchLevels,
            base: 2, //TODO: not in server settings
            actual: 2 * factor,
            isPercentage: false,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.additionalFleetSlots,
            base: serverSettings.value.playerClasses.general.bonusFleetSlots,
            actual: serverSettings.value.playerClasses.general.bonusFleetSlots * factor,
            isPercentage: false,
        },
        {
            label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.general.additionalMoonFields,
            base: serverSettings.value.playerClasses.general.bonusMoonFields,
            actual: serverSettings.value.playerClasses.general.bonusMoonFields * factor,
            isPercentage: false,
        },
    ];
}

const classBonusesColumns: GridTableColumn<keyof ClassBonusValues>[] = [
    {
        key: 'label',
        label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.bonus,
    },
    {
        key: 'base',
        label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.baseValue,
    },
    {
        key: 'actual',
        label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.valueWithBonuses,
    },
];

const playerClass = ref(PlayerClass.collector);

const PlayerClasses = SelectablePlayerClasses;

const bonusTypes: LifeformBonusesBreakdownType<'classBonus'>[] = [
    {
        key: 'classBonus',
        label: translations().extension.empire.lifeforms.researchBonuses.playerClasses.classBonus,
    },
];

const technologies: ClassBonusLifeformTechnology[] = ClassBonusLifeformTechnologies;

const techs = computed<LifeformTechnologyType[]>(() => {
    return technologies
        .filter(tech => tech.appliesTo(playerClass.value))
        .map(t => t.type);
});

const planets = computed<Record<number, LifeformBonusesPlanetBreakdown<'classBonus'>[]>>(() => {
    return createMappedRecord(
        empireStore.empire.planetOrder
            .map(id => empireStore.empire.planets[id])
            .filter(planet => !planet.isMoon) as PlanetData[],
        planet => planet.id,
        planet => technologies
            .filter(tech => tech.appliesTo(playerClass.value))
            .map<LifeformBonusesPlanetBreakdown<'classBonus'>>(tech => {
                const planetBonuses = getPlanetBonus(tech, planet);

                return {
                    planet,
                    technologyType: tech.type,
                    bonuses: createRecord<'classBonus', LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                        ['classBonus'],
                        _ => ({
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

function getPlanetBonus(tech: ClassBonusLifeformTechnology, planet: PlanetData): ClassBonusBreakdown {
    if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
        return {
            base: 0,
            level: 0,
            buildings: 0,
            buildingsBoost: 0,
            total: 0,
        };
    }

    const buildingsBoost = Math.min(
        getPlanetLifeformTechnologyBoost(planet)[tech.type],
        getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
    );

    const baseBonus = tech.getClassBonus(playerClass.value, planet.lifeformTechnologies[tech.type]);
    const lifeformLevelBonus = baseBonus * getLifeformLevelTechnologyBonus(experience.value[planet.activeLifeform]);
    const lifeformBuildingBonus = baseBonus * buildingsBoost;

    return {
        base: baseBonus,
        level: lifeformLevelBonus,
        buildings: lifeformBuildingBonus,
        buildingsBoost,
        total: baseBonus + lifeformLevelBonus + lifeformBuildingBonus,
    };
}

onMounted(() => {
    playerClass.value = empireStore.empire.playerClass == PlayerClass.none
        ? PlayerClass.collector
        : empireStore.empire.playerClass;
});
</script>
