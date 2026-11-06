<template>
    <div class="scrapyard-merchant">
        <div>
            <input
                type="number"
                min="35"
                max="75"
                step="1"
                :value="percentage"
                @input="setPercentage($event)"
            />
            <span v-text="translations().extension.tools.scrapyardMerchant.percentage" />
        </div>

        <GridTable
            class="scrap-table"
            :columns="columns"
            :items="items"
            :footer-items="footerItems"
            sticky="100%"
            sticky-footer
        >
            <template #cell-type="{ item }">
                <template v-if="'baseSpeed' in item">
                    <span v-text="translations().ogame.ships[item.type]" class="mr-2" />
                    <OShip :ship="item.type" size="24px" />
                </template>

                <template v-else>
                    <span v-text="translations().ogame.defenses[item.type]" class="mr-2" />
                    <ODefense :defense="item.type" size="24px" />
                </template>
            </template>
            <template #cell-count="{ item }">
                <input
                    v-if="'baseSpeed' in item"
                    type="number"
                    min="0"
                    step="1"
                    v-model.number="ships[item.type]"
                />
                <input
                    v-else
                    type="number"
                    min="0"
                    step="1"
                    v-model.number="defenses[item.type]"
                />
            </template>
            <template #[`(cell|footer)-${resourcesRegex}`]="{ match, item }">
                <span
                    v-if="match.groups?.resource"
                    v-text="formatNumber(getTotalCost(item)[match.groups.resource as keyof Cost])"
                />
            </template>
            <template #[`(cell|footer)-msu-dsu`]="{ item }">
                <span v-text="formatNumber(getMsuOrDsu(getTotalCost(item)))" />
            </template>
        </GridTable>
    </div>
</template>

<script setup lang="ts">
import GridTable from '@stats/components/common/GridTable.vue';
import ODefense from '@stats/components/ogame/ODefense.vue';
import OShip from '@ogame-tracker/view-shared/components/ogame/OShip.vue';
import { computed, nextTick, reactive, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import { Defense } from '@ogame-tracker/shared/models/ogame/defenses/Defense';
import { DefenseByTypes, DefenseTypes } from '@ogame-tracker/shared/models/ogame/defenses/DefenseTypes';
import { Ship } from '@ogame-tracker/shared/models/ogame/ships/Ship';
import { ShipByTypes, ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import type { GridTableColumn } from '../../components/common/GridTable.vue';
import { addCost, multiplyCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { getMsuOrDsu as convertCost } from '../../models/settings/getMsuOrDsu';
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const resourcesRegex = '(?<resource>metal|crystal|deuterium)';

const percentage = ref(35);

const percentageComputed = computed({
    get: () => percentage.value,
    set: (value: number) => {
        percentage.value = Math.max(35, Math.min(75, Math.trunc(value)));
    },
});

const ships = reactive(createRecord(ShipTypes, 0));

const defenses = reactive(createRecord(DefenseTypes, 0));

const columns = computed<GridTableColumn[]>(() => {
    return [
        {
            key: 'type',
        },
        {
            key: 'count',
            label: translations().extension.tools.scrapyardMerchant.count,
        },
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
            key: 'msu-dsu',
            label: `${translations().extension.common.resourceUnits} (${conversionModeText.value})`,
        },
    ];
});

const conversionModeText = computed(() => {
    return settingsStore.settings.conversionRates.mode == 'msu'
        ? translations().extension.common.msu
        : translations().extension.common.dsu;
});

function getTotalCost(item: Ship | Defense | {}): Cost {
    const factor = percentage.value / 100;

    if ('type' in item) {
        const count = 'baseSpeed' in item ? ships[item.type] : defenses[item.type];
        return multiplyCost(item.cost, count * factor);
    }

    return addCost(
        ...ShipTypes.map(ship => multiplyCost(ShipByTypes[ship].cost, ships[ship] * factor)),
        ...DefenseTypes.map(def => multiplyCost(DefenseByTypes[def].cost, defenses[def] * factor)),
    );
}

function getMsuOrDsu(cost: Cost) {
    return convertCost(cost);
}

const footerItems = [{}];

const items = computed<(Ship | Defense)[]>(() => {
    return [
        ...ShipTypes.map(type => ShipByTypes[type]),
        ...DefenseTypes.map(type => DefenseByTypes[type]),
    ];
});

async function setPercentage(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);

    const localPercentage = isNaN(value)
        ? 0
        : Math.max(35, Math.min(75, Math.trunc(value)));

    percentage.value = value;
    await nextTick();
    percentage.value = localPercentage;
}
</script>

<style lang="scss" scoped>
.scrapyard-merchant {
    display: grid;
    justify-items: start;
    grid-template-rows: auto 1fr;
    max-height: 100%;
}

.scrap-table :deep(.grid-table-body .grid-table-cell) {
    padding: 4px 8px;
}
</style>
