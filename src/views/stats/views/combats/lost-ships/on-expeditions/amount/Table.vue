<template>
    <div class="table-container">
        <RangedStatsTable
            :dataItems="combats"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
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

            <CombatTrackingIgnoreEspionageCombatsSettings />
            <hr />
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
import { useCombatReportStore } from '@stats/data/CombatReportDataModule';
import type { DailyCombatReportResult } from '@stats/data/CombatReportDataModule';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { ShipTypes } from '@ogame-tracker/shared/models/ogame/ships/ShipTypes';
import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

const combatReportStore = useCombatReportStore();

const showSettings = ref(false);

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const combats = computed(() => combatReportStore.dailyResultsArray);

const items = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    return ShipTypes.map(ship => ({
        label: translations().ogame.ships[ship],
        getValue: nextCombats => nextCombats.reduce((acc, combat) => acc + combat.lostShips.onExpeditions.ships[ship], 0),
    }));
});

const footerItems = computed<RangedStatsTableItem<DailyCombatReportResult>[]>(() => {
    return [
        {
            label: translations().extension.common.sum,
            getValue: nextCombats => ShipTypes.reduce(
                (total, ship) => total + nextCombats.reduce(
                    (acc, combat) => acc + combat.lostShips.onExpeditions.ships[ship], 0),
                0
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
