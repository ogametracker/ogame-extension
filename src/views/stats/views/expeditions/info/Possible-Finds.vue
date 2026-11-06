<template>
    <div>
        <div class="small-tables">
            <grid-table inline :columns="infoColumns" :items="infoItems" no-header>
                <template #cell-value="{ value, item }">
                    <o-player-class v-if="item.type == 'playerClass'" :player-class="value" />
                    <span v-else-if="item.type == 'number'" v-text="value" />
                    <span v-else v-text="formatNumber(value * 100, percentageFormat) + '%'" />
                </template>
            </grid-table>

            <grid-table inline :columns="maxFindsColumns" :items="maxFindsItems">
                <template #cell-key="{ value }">
                    <template v-if="value == 'metal'">
                        <o-resource resource="metal" size="24px" />
                        <span v-text="formatNumber(finds.large[finds.large.length - 1].metal)" />
                    </template>
                    <template v-else-if="value == 'crystal'">
                        <o-resource resource="crystal" size="24px" />
                        <span v-text="formatNumber(finds.large[finds.large.length - 1].crystal)" />
                    </template>
                    <template v-else-if="value == 'deuterium'">
                        <o-resource resource="deuterium" size="24px" />
                        <span v-text="formatNumber(finds.large[finds.large.length - 1].deuterium)" />
                    </template>
                    <template v-else-if="value == 'shipUnits'">
                        <o-ship :ship="ShipType.battleship" size="24px" />
                        <span v-text="formatNumber(finds.large[finds.large.length - 1].shipUnits)" />
                    </template>
                </template>
            </grid-table>

            <grid-table inline :columns="darkMatterColumns" :items="darkMatterItems">
                <template #cell-size="{ value }">
                    <expedition-size-icon :size="value" class="scaled-icon" />
                </template>
                <template #cell-amount="{ item }">
                    <o-resource resource="dark-matter" size="24px" />
                    <span v-text="`${formatNumber(item.amount[0])} - ${formatNumber(item.amount[1])}`" />
                </template>
            </grid-table>
        </div>

        <hr />

        <h3 v-text="translations().extension.expeditions.possibleFinds.listOfPossibleFinds" />
        <div class="find-col" v-for="size in sizes" :key="size">
            <h3 class="table-title">
                <expedition-size-icon :size="size" />
                <span v-text="translations().extension.expeditions.possibleFinds.findSizes(translations().extension.expeditions.expeditionEventSizes[size])" />
            </h3>
            <grid-table inline :items="finds[size]" :columns="columns" :style="`--color: ${sizeColors[size]}`">
                <template v-slot:[`cell-.+`]="{ value }">
                    <span v-text="formatNumber(value)" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import { ExpeditionEventSize, ExpeditionEventSizes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { PlayerClass } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
import type { GridTableColumn } from '../../../components/common/GridTable.vue';
import { useEmpireStore } from '../../../data/EmpireDataModule';
import { useSettingsStore } from '../../../data/SettingsDataModule';
import { getRGBString } from '../../../utils/getRGBString';
import ExpeditionSizeIcon from '@stats/components/expeditions/ExpeditionSizeIcon.vue';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { ClassBonusLifeformTechnologies, ExpeditionBonusLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
import { getPlanetLifeformTechnologyBoost } from '../../../models/lifeforms';
import { LifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import { getExpeditionFindFactor } from '@ogame-tracker/shared/models/expeditions/getExpeditionFindFactor';
import { findBaseAmounts } from '@ogame-tracker/shared/models/expeditions/findBaseAmounts';
import { ExpeditionFindableShipTypes } from "@ogame-tracker/shared/models/expeditions/ExpeditionEvents";
import { ShipByTypes } from "@ogame-tracker/shared/models/ogame/ships/ShipTypes";
import { getMsuOrDsu } from "@stats/models/settings/getMsuOrDsu";
import { getExpeditionItemFindBonus } from "@ogame-tracker/shared/models/ogame/expeditions/getExpeditionItemFindBonus";
import { ExpeditionEventType } from "@ogame-tracker/shared/models/expeditions/ExpeditionEventType";
import { ItemHash } from "@ogame-tracker/shared/models/ogame/items/ItemHash";

type FindableUnits = {
    metal: number;
    crystal: number;
    deuterium: number;
    shipUnits: number;
    maxShipUnitsConverted: number;
};

const settingsStore = useSettingsStore();

const empireStore = useEmpireStore();

const serverSettingsStore = useServerSettingsStore();

const sizes = ExpeditionEventSizes;

const percentageFormat: Intl.NumberFormatOptions = {
    maximumFractionDigits: 3,
    minimumFractionDigits: 3,
};

const sizeColors = computed<Record<ExpeditionEventSize, string>>(() => {
    const colors = settingsStore.settings.colors.expeditions.sizes;

    return {
        [ExpeditionEventSize.small]: getRGBString(colors.small)!,
        [ExpeditionEventSize.medium]: getRGBString(colors.medium)!,
        [ExpeditionEventSize.large]: getRGBString(colors.large)!,
    };
});

const columns = computed<GridTableColumn<keyof FindableUnits>[]>(() => {
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
            key: 'shipUnits',
            label: translations().extension.expeditions.possibleFinds.shipUnits,
        },
        {
            key: 'maxShipUnitsConverted',
            label: translations().extension.expeditions.possibleFinds.shipMaxUnitsConverted + ` (${settingsStore.settings.conversionRates.mode == 'msu'
                    ? translations().extension.common.msu
                    : translations().extension.common.dsu
                })`,
        },
    ];
});

const infoColumns = computed<GridTableColumn<'label' | 'value'>[]>(() => {
    return [
        { key: 'label' },
        { key: 'value' },
    ];
});

const infoItems = computed<{ type: 'playerClass' | 'percentage' | 'number'; label: string; value: number | PlayerClass }[]>(() => {
    const localInfo = info.value;

    return [
        {
            type: 'playerClass',
            label: translations().extension.expeditions.possibleFinds.info.playerClass,
            value: localInfo.playerClass,
        },
        {
            type: 'number',
            label: translations().extension.expeditions.possibleFinds.info.economySpeed,
            value: localInfo.ecoSpeed,
        },
        {
            type: 'percentage',
            label: translations().extension.expeditions.possibleFinds.info.resourceFindBonus,
            value: localInfo.resourceFindBonus,
        },
        {
            type: 'percentage',
            label: translations().extension.expeditions.possibleFinds.info.shipFindBonus,
            value: localInfo.shipFindBonus,
        },
        {
            type: 'percentage',
            label: translations().extension.expeditions.possibleFinds.info.darkMatterFindBonus,
            value: localInfo.darkMatterBonus,
        },
        {
            type: 'percentage',
            label: translations().extension.expeditions.possibleFinds.info.discovererBonus,
            value: localInfo.discovererBonus,
        },
    ];
});

const maxFindsColumns = computed<GridTableColumn<'key'>[]>(() => {
    return [
        {
            key: 'key',
            label: translations().extension.expeditions.possibleFinds.maximumFinds,
            style: {
                'justify-content': 'space-between',
                'gap': '4px',
            },
        },
    ];
});

const maxFindsItems = computed<{ key: keyof FindableUnits }[]>(() => {
    return [
        { key: 'metal' },
        { key: 'crystal' },
        { key: 'deuterium' },
        { key: 'shipUnits' },
        { key: 'maxShipUnitsConverted' },
    ];
});

const darkMatterColumns = computed<GridTableColumn<'size' | 'amount'>[]>(() => {
    return [
        { key: 'size' },
        {
            key: 'amount',
            label: translations().extension.expeditions.possibleFinds.findsDarkMatter,
            style: {
                'justify-content': 'start',
                'gap': '6px',
            },
        },
    ];
});

const darkMatterItems = computed<{ size: ExpeditionEventSize, amount: [min: number, max: number] }[]>(() => {
    const factor = 1 + info.value.darkMatterBonus;

    return [
        {
            size: ExpeditionEventSize.small,
            amount: [300, 400].map(x => Math.trunc(x * factor)) as [number, number],
        },
        {
            size: ExpeditionEventSize.medium,
            amount: [500, 700].map(x => Math.trunc(x * factor)) as [number, number],
        },
        {
            size: ExpeditionEventSize.large,
            amount: [1000, 1800].map(x => Math.trunc(x * factor)) as [number, number],
        },
    ];
});

const info = computed(() => {
    const empire = empireStore.empire;

    const planets = Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[];
    const planetBuildingBoosts = createMappedRecord(
        planets,
        planet => planet.id,
        planet => getPlanetLifeformTechnologyBoost(planet),
    );

    const resourceFindBonus = ExpeditionBonusLifeformTechnologies.reduce((total, tech) => {
        let techBonus = 0;
        planets.forEach(planet => {
            const level = planet.activeLifeformTechnologies.includes(tech.type)
                ? planet.lifeformTechnologies[tech.type]
                : 0;

            const baseBonus = tech.getExpeditionBonus(ExpeditionEventType.resources, level);
            const levelBonus = planet.activeLifeform == LifeformType.none
                ? 0
                : baseBonus * getLifeformLevelTechnologyBonus(empireStore.lifeformExperience[planet.activeLifeform]);
            const buildingBonus = baseBonus * planetBuildingBoosts[planet.id][tech.type];

            const total = baseBonus + levelBonus + buildingBonus;
            techBonus += total;
        });

        return total + techBonus;
    }, 0);

    const shipFindBonus = ExpeditionBonusLifeformTechnologies.reduce((total, tech) => {
        let techBonus = 0;
        planets.forEach(planet => {
            const level = planet.activeLifeformTechnologies.includes(tech.type)
                ? planet.lifeformTechnologies[tech.type]
                : 0;

            const baseBonus = tech.getExpeditionBonus(ExpeditionEventType.fleet, level);
            const levelBonus = planet.activeLifeform == LifeformType.none
                ? 0
                : baseBonus * getLifeformLevelTechnologyBonus(empireStore.lifeformExperience[planet.activeLifeform]);
            const buildingBonus = baseBonus * planetBuildingBoosts[planet.id][tech.type];

            const total = baseBonus + levelBonus + buildingBonus;
            techBonus += total;
        });

        return total + techBonus;
    }, 0);

    const darkMatterBonus = ExpeditionBonusLifeformTechnologies.reduce((total, tech) => {
        let techBonus = 0;
        planets.forEach(planet => {
            const level = planet.activeLifeformTechnologies.includes(tech.type)
                ? planet.lifeformTechnologies[tech.type]
                : 0;

            const baseBonus = tech.getExpeditionBonus(ExpeditionEventType.darkMatter, level);
            const levelBonus = planet.activeLifeform == LifeformType.none
                ? 0
                : baseBonus * getLifeformLevelTechnologyBonus(empireStore.lifeformExperience[planet.activeLifeform]);
            const buildingBonus = baseBonus * planetBuildingBoosts[planet.id][tech.type];

            const total = baseBonus + levelBonus + buildingBonus;
            techBonus += total;
        });

        return total + techBonus;
    }, 0);

    const discovererBonus = ClassBonusLifeformTechnologies.reduce((total, tech) => {
        let techBonus = 0;
        planets.forEach(planet => {
            const level = planet.activeLifeformTechnologies.includes(tech.type)
                ? planet.lifeformTechnologies[tech.type]
                : 0;

            const baseBonus = tech.getClassBonus(PlayerClass.discoverer, level);
            const levelBonus = planet.activeLifeform == LifeformType.none
                ? 0
                : baseBonus * getLifeformLevelTechnologyBonus(empireStore.lifeformExperience[planet.activeLifeform]);
            const buildingBonus = baseBonus * planetBuildingBoosts[planet.id][tech.type];

            const total = baseBonus + levelBonus + buildingBonus;
            techBonus += total;
        });

        return total + techBonus;
    }, 0);

    return {
        playerClass: empire.playerClass,
        ecoSpeed: serverSettingsStore.serverSettings.speed.economy,
        resourceFindBonus,
        shipFindBonus,
        discovererBonus,
        darkMatterBonus,
    };
});

const finds = computed<Record<ExpeditionEventSize, FindableUnits[]>>(() => {
    const pathfinderFactor = 2;
    const localInfo = info.value;

    const classFactor = localInfo.playerClass == PlayerClass.discoverer
        ? localInfo.ecoSpeed * (1.5 * (1 + localInfo.discovererBonus))
        : 1;

    const topPointsFactors = getExpeditionFindFactor(serverSettingsStore.serverSettings.topScore ?? 0);

    const maxConvertedShipCost = ExpeditionFindableShipTypes.map(shipType => {
        const ship = ShipByTypes[shipType];
        const cost = ship.cost;

        const converted = getMsuOrDsu(cost);
        const units = cost.metal + cost.crystal;

        return {
            converted,
            units,
            score: converted / units,
        };
    }).sort((a, b) => b.score - a.score)[0];

    const firstPlanet = Object.values(empireStore.empire.planets).find(p => !p.isMoon) as PlanetData | undefined;
    const resourceSizeBoost = getExpeditionItemFindBonus(ExpeditionEventType.resources, Object.keys(firstPlanet?.activeItems ?? {}) as ItemHash[]);

    return createRecord(
        ExpeditionEventSizes,
        size => findBaseAmounts[size].map<FindableUnits>(base => {

            const metal = topPointsFactors * base * pathfinderFactor * classFactor * (1 + localInfo.resourceFindBonus) * (1 + resourceSizeBoost);
            const shipUnits = topPointsFactors * base * pathfinderFactor * classFactor * (1 + localInfo.shipFindBonus) / 2;
            const maxShipUnitsConverted = Math.trunc(shipUnits / maxConvertedShipCost.units) * maxConvertedShipCost.converted;

            return {
                metal: Math.trunc(metal),
                crystal: Math.trunc(metal / 2),
                deuterium: Math.trunc(metal / 3),
                shipUnits: Math.trunc(shipUnits),
                maxShipUnitsConverted,
            };
        }),
    );
});
</script>

<style lang="scss" scoped>
    .find-col {
        display: inline-flex;
        flex-direction: column;
        margin-right: 16px;
    }

    .table-title {
        display: flex;
        align-items: center;
        gap: 4px;

        .mdi {
            font-size: 24px;
        }
    }

    .small-tables {
        display: flex;
        gap: 16px;
        align-items: start;
    }
    .scaled-icon {
        transform: scale(1.6);
    }
</style>
