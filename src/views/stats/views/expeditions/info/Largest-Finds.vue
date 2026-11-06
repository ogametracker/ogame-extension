<template>
    <loading-spinner v-if="loading" />
    <div v-else>
        <div v-for="key in keys" :key="key" class="find-column">
            <h3 v-text="translations().extension.expeditions.topFinds.title(keyTranslations[key])" />

            <grid-table inline :columns="columns" :items="largestFinds[key].values" :style="`--color: ${colors[key]}`">
                <template #cell-size="{ value }">
                    <expedition-size-icon :size="value" class="scaled-icon" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="formatNumber(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="formatDate(value, 'date')" />
                </template>
            </grid-table>
        </div>

        <div class="find-column" :style="`--color: ${colors.shipUnitsConverted}`">
            <h3 v-text="translations().extension.expeditions.topFinds.title(translations().extension.expeditions.topFinds.shipAmount)" />
            <select v-model.number="selectedShip" style="display: block; margin-bottom: 4px">
                <option v-for="ship in ShipTypes" :key="ship" :value="ship" v-text="translations().ogame.ships[ship]" />
            </select>

            <grid-table inline :columns="shipColumns" :items="largestFinds.shipAmounts[selectedShip].values">
                <template #cell-amount="{ value }">
                    <span v-text="formatNumber(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="formatDate(value, 'date')" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations, formatNumber, formatDate } from '@stats/i18n';
import { ExpeditionEventSize } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventSize';
import { ExpeditionEventType } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import { useExpeditionStore } from '../../../data/ExpeditionDataModule';
import ExpeditionSizeIcon from '@stats/components/expeditions/ExpeditionSizeIcon.vue';
import { ExpeditionFindableShipTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import type { ExpeditionEventDarkMatter, ExpeditionEventFleet, ExpeditionEventResources, ExpeditionFindableShipType } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import type { GridTableColumn } from '../../../components/common/GridTable.vue';
import { useSettingsStore } from '../../../data/SettingsDataModule';
import { getRGBString } from '../../../utils/getRGBString';
import { ShipByTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { TopList } from '@stats/models/TopList';
import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';
import { createRecord } from "@ogame-tracker/shared/utils/createRecord";

type Find = {
    size: ExpeditionEventSize;
    amount: number;
    date: number;
}

type ShipAmountFind = {
    amount: number;
    date: number;
}

type Finds = {
    metal: TopList<Find>;
    crystal: TopList<Find>;
    deuterium: TopList<Find>;
    shipUnits: TopList<Find>;
    shipUnitsConverted: TopList<Find>;
    darkMatter: TopList<Find>;
    shipAmounts: Record<ExpeditionFindableShipType, TopList<ShipAmountFind>>;
}

type FindKey = Exclude<keyof Finds, 'shipAmounts'>;

const settingsStore = useSettingsStore();

const expeditionStore = useExpeditionStore();

const loading = ref(true);

const ShipTypes = ExpeditionFindableShipTypes;

const largestFinds: Finds = {
    metal: new TopList<Find>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    crystal: new TopList<Find>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    deuterium: new TopList<Find>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    shipUnits: new TopList<Find>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    shipUnitsConverted: new TopList<Find>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    darkMatter: new TopList<Find>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    }),
    shipAmounts: createRecord(ExpeditionFindableShipTypes, ship => new TopList<ShipAmountFind>({
        comparator: (a, b) => b.amount - a.amount,
        maxSize: 25,
    })),
};

const keys: FindKey[] = ['metal', 'crystal', 'deuterium', 'shipUnits', 'shipUnitsConverted', 'darkMatter'];

const selectedShip = ref<ExpeditionFindableShipType>(ShipType.espionageProbe);

const keyTranslations = computed<Record<FindKey, string>>(() => {
    return {
        metal: translations().ogame.resources.metal,
        crystal: translations().ogame.resources.crystal,
        deuterium: translations().ogame.resources.deuterium,
        shipUnits: translations().extension.expeditions.topFinds.shipUnits,
        shipUnitsConverted: translations().extension.expeditions.topFinds.shipUnits + ` (${settingsStore.settings.conversionRates.mode == 'msu'
                ? translations().extension.common.msu
                : translations().extension.common.dsu
            })`,
        darkMatter: translations().ogame.premium.darkMatter,
    };
});

const colors = computed<Record<FindKey, string>>(() => {
    const localColors = settingsStore.settings.colors;

    return {
        metal: getRGBString(localColors.resources.metal)!,
        crystal: getRGBString(localColors.resources.crystal)!,
        deuterium: getRGBString(localColors.resources.deuterium)!,
        darkMatter: getRGBString(localColors.expeditions.events.darkMatter)!,
        shipUnits: getRGBString(localColors.expeditions.events.fleet)!,
        shipUnitsConverted: getRGBString(localColors.expeditions.events.fleet)!,
    };
});

const columns = computed<GridTableColumn<keyof Find>[]>(() => {
    return [
        {
            key: 'size',
            label: translations().extension.expeditions.topFinds.size,
        },
        {
            key: 'amount',
            label: translations().extension.expeditions.topFinds.amount,
        },
        {
            key: 'date',
            label: translations().extension.expeditions.topFinds.date,
        },
    ];
});

const shipColumns = computed<GridTableColumn<keyof ShipAmountFind>[]>(() => {
    return [
        {
            key: 'amount',
            label: translations().extension.expeditions.topFinds.amount,
        },
        {
            key: 'date',
            label: translations().extension.expeditions.topFinds.date,
        },
    ];
});

function addDarkMatterExpo(expo: ExpeditionEventDarkMatter) {
    largestFinds.darkMatter.add({
        size: expo.size,
        amount: expo.darkMatter,
        date: expo.date,
    });
}

function addFleetExpo(expo: ExpeditionEventFleet) {
    // ship units (metal + crystal)
    {
        const units = ExpeditionFindableShipTypes.map(shipType => {
            const count = expo.fleet[shipType] ?? 0;
            const ship = ShipByTypes[shipType];

            const cost = ship.cost;
            return (cost.metal + cost.crystal) * count;
        }).reduce((total, cur) => total + cur, 0);

        largestFinds.shipUnits.add({
            size: expo.size,
            amount: units,
            date: expo.date,
        });
    }
    // ship units (MSU)
    {
        const unitsMsu = ExpeditionFindableShipTypes.map(shipType => {
            const count = expo.fleet[shipType] ?? 0;
            const ship = ShipByTypes[shipType];

            const cost = ship.cost;
            return getMsuOrDsu(cost) * count;
        }).reduce((total, cur) => total + cur, 0);

        largestFinds.shipUnitsConverted.add({
            size: expo.size,
            amount: unitsMsu,
            date: expo.date,
        });
    }

    // per ship type
    ExpeditionFindableShipTypes.forEach(ship => {
        const amount = expo.fleet[ship] ?? 0;
        if (amount == 0) {
            return;
        }

        largestFinds.shipAmounts[ship].add({
            date: expo.date,
            amount,
        });
    });
}

function addResourceExpo(expo: ExpeditionEventResources) {
    const resource = expo.resources.metal > 0
        ? ResourceType.metal
        : expo.resources.crystal > 0
            ? ResourceType.crystal
            : ResourceType.deuterium;

    if (expo.resources[resource] == 0) {
        return;
    }

    largestFinds[resource].add({
        size: expo.size,
        amount: expo.resources[resource],
        date: expo.date,
    });
}

onMounted(async () => {
    const expeditions = await expeditionStore.getRawData();

    expeditions.forEach(expo => {
        if (expo.type == ExpeditionEventType.resources) {
            addResourceExpo(expo);
        }
        else if (expo.type == ExpeditionEventType.fleet) {
            addFleetExpo(expo);
        }
        else if (expo.type == ExpeditionEventType.darkMatter) {
            addDarkMatterExpo(expo);
        }
    });

    loading.value = false;
});
</script>

<style lang="scss" scoped>
    .scaled-icon {
        transform: scale(1.6);
    }

    .find-column {
        display: inline-flex;
        flex-direction: column;
        margin-right: 16px;
    }
</style>
