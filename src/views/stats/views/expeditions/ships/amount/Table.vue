<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-ship :ship="shipTable[value]" size="24px" />
            </template>
        </ranged-stats-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <date-range-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionFindableShipTypes } from '@/shared/models/expeditions/ExpeditionEvents';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get expos() {
            return ExpeditionDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return ExpeditionFindableShipTypes.map(ship => ({
                label: this.$i18n.$t.ships[ship],
                getValue: expos => expos.reduce((acc, expo) => acc + (expo.findings.fleet[ship] ?? 0), 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return [{
                label: this.$i18n.$t.common.sum,
                getValue: expos => expos.reduce(
                    (acc, expo) => acc + ExpeditionFindableShipTypes.reduce(
                        (acc, ship) => acc + (expo.findings.fleet[ship] ?? 0),
                        0
                    ),
                    0
                ),
            }];
        }

        private get shipTable(): Record<string, ShipType> {
            return {
                [this.$i18n.$t.ships[ShipType.lightFighter]]: ShipType.lightFighter,
                [this.$i18n.$t.ships[ShipType.heavyFighter]]: ShipType.heavyFighter,
                [this.$i18n.$t.ships[ShipType.cruiser]]: ShipType.cruiser,
                [this.$i18n.$t.ships[ShipType.battleship]]: ShipType.battleship,
                [this.$i18n.$t.ships[ShipType.bomber]]: ShipType.bomber,
                [this.$i18n.$t.ships[ShipType.battlecruiser]]: ShipType.battlecruiser,
                [this.$i18n.$t.ships[ShipType.destroyer]]: ShipType.destroyer,
                [this.$i18n.$t.ships[ShipType.reaper]]: ShipType.reaper,
                [this.$i18n.$t.ships[ShipType.pathfinder]]: ShipType.pathfinder,
                [this.$i18n.$t.ships[ShipType.smallCargo]]: ShipType.smallCargo,
                [this.$i18n.$t.ships[ShipType.largeCargo]]: ShipType.largeCargo,
                [this.$i18n.$t.ships[ShipType.espionageProbe]]: ShipType.espionageProbe,
                [this.$i18n.$t.ships[ShipType.recycler]]: ShipType.recycler,
                [this.$i18n.$t.ships[ShipType.deathStar]]: ShipType.deathStar,
                [this.$i18n.$t.ships[ShipType.crawler]]: ShipType.crawler,
                [this.$i18n.$t.ships[ShipType.solarSatellite]]: ShipType.solarSatellite,
                [this.$i18n.$t.ships[ShipType.colonyShip]]: ShipType.colonyShip,
            };
        }
    }
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