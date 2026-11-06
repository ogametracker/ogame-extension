<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="expos"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <OShip :ship="shipTable[value]" size="24px" />
            </template>
        </RangedStatsTable>

        <FloatingMenu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <DateRangeSettings />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import OShip from '@ogame-tracker/view-shared/components/ogame/OShip.vue';
import { computed, ref } from 'vue';
import { translations } from '@stats/i18n';
import RangedStatsTable from '@stats/components/stats/RangedStatsTable.vue';
import type { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
import { ExpeditionFindableShipTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import { useExpeditionStore } from '@stats/data/ExpeditionDataModule';
import type { DailyExpeditionResult } from '@stats/data/ExpeditionDataModule';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

const expeditionStore = useExpeditionStore();

const showSettings = ref(false);

const avgFormat = ref<Intl.NumberFormatOptions>({
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const expos = computed(() => expeditionStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return ExpeditionFindableShipTypes.map(ship => ({
        label: translations().ogame.ships[ship],
        getValue: nextExpos => nextExpos.reduce((acc, expo) => acc + (expo.findings.fleet[ship] ?? 0), 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyExpeditionResult>[]>(() => {
    return [
        {
            label: translations().extension.common.sum,
            getValue: nextExpos =>
                nextExpos.reduce(
                    (acc, expo) =>
                        acc
                        + ExpeditionFindableShipTypes.reduce((acc, ship) => acc + (expo.findings.fleet[ship] ?? 0), 0),
                    0,
                ),
        },
    ];
});

const shipTable = computed<Record<string, ShipType>>(() => {
    return {
        [translations().ogame.ships[ShipType.lightFighter]]: ShipType.lightFighter,
        [translations().ogame.ships[ShipType.heavyFighter]]: ShipType.heavyFighter,
        [translations().ogame.ships[ShipType.cruiser]]: ShipType.cruiser,
        [translations().ogame.ships[ShipType.battleship]]: ShipType.battleship,
        [translations().ogame.ships[ShipType.bomber]]: ShipType.bomber,
        [translations().ogame.ships[ShipType.battlecruiser]]: ShipType.battlecruiser,
        [translations().ogame.ships[ShipType.destroyer]]: ShipType.destroyer,
        [translations().ogame.ships[ShipType.reaper]]: ShipType.reaper,
        [translations().ogame.ships[ShipType.pathfinder]]: ShipType.pathfinder,
        [translations().ogame.ships[ShipType.smallCargo]]: ShipType.smallCargo,
        [translations().ogame.ships[ShipType.largeCargo]]: ShipType.largeCargo,
        [translations().ogame.ships[ShipType.espionageProbe]]: ShipType.espionageProbe,
        [translations().ogame.ships[ShipType.recycler]]: ShipType.recycler,
        [translations().ogame.ships[ShipType.deathStar]]: ShipType.deathStar,
        [translations().ogame.ships[ShipType.crawler]]: ShipType.crawler,
        [translations().ogame.ships[ShipType.solarSatellite]]: ShipType.solarSatellite,
        [translations().ogame.ships[ShipType.colonyShip]]: ShipType.colonyShip,
    };
});
</script>

<style lang="scss" scoped>
.table-container {
    display: grid;
    column-gap: 4px;
    grid-template-columns: 1fr auto;
    align-items: start;
    height: 100%;
}
</style>
