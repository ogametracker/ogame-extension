<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :filter="(expo) => filterExpo(expo)"
            :items="items"
            :footerItems="footerItems"
            show-percentage
            show-average
            :averageNumberFormatOptions="avgFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <span
                    v-if="value == $i18n.$t.expeditions.expeditionEvents.nothing"
                    class="mdi mdi-close"
                    :style="{ color: colors.nothing }"
                />
                <expedition-event-resources-icon 
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.resources"
                    size="24px"
                />
                <o-ship 
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.fleet"
                    ship="battleship" 
                    size="24px" 
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.delay"
                    class="mdi mdi-clock-outline"
                    :style="{ color: colors.delay }"
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.early"
                    class="mdi mdi-clock-outline"
                    :style="{ color: colors.early }"
                />
                <o-resource
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.darkMatter"
                    resource="dark-matter"
                    size="24px"
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.pirates"
                    class="mdi mdi-pirate"
                    :style="{ color: colors.pirates }"
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.aliens"
                    class="mdi mdi-alien"
                    :style="{ color: colors.aliens }"
                />
                <o-item 
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.item" 
                    :item="detroidItem" 
                    size="24px" 
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.trader"
                    class="mdi mdi-swap-horizontal-bold"
                    :style="{ color: colors.trader }"
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEvents.lostFleet"
                    class="mdi mdi-cross"
                    :style="{ color: colors.lostFleet }"
                />
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
    import { ExpeditionEvent } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ExpeditionEventResourcesIcon,
        },
    })
    export default class Table extends Vue {
        private readonly ExpeditionEventType = ExpeditionEventType;
        private showSettings = false;
        private readonly detroidItem = ItemHash.detroid_bronze;

        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return true;
        }

        private get items(): RangedStatsTableItem<ExpeditionEvent>[] {
            return Object.keys(ExpeditionEventType).map(type => ({
                label: this.$i18n.$t.expeditions.expeditionEvents[type as ExpeditionEventType],
                getValue: expos => expos.filter(expo => expo.type == type).length,
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEvent>[] {
            return [{
                label: this.$i18n.$t.common.sum,
                getValue: expos => expos.length,
            }];
        }
    }
</script>
<style lang="scss" scoped>
    .ranged-stats-table .mdi {
        transform: translateX(-30%) scale(1.6);
        width: 24px;
        display: inline-block;
    }

    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;
    }
</style>