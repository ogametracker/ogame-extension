<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="discoveries"
            :items="items"
            :footerItems="footerItems"
            show-average
            show-percentage
            :averageNumberFormatOptions="avgNumberFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <span v-if="value == $i18n.$t.extension.empire.lifeforms.eventTypes.nothing" class="mdi mdi-close" :style="{ color: colors.nothing }" />
                <span
                    v-else-if="value == $i18n.$t.extension.empire.lifeforms.eventTypes.lostShip"
                    class="mdi mdi-skull-crossbones-outline"
                    :style="{ color: colors.lostShip }"
                />
                <span v-else-if="value == lifeformFoundLabel" class="mdi mdi-star-shooting" :style="{ color: colors.knownLifeformFound }" />
                <span
                    v-else-if="value == $i18n.$t.extension.empire.lifeforms.eventTypes.artifacts"
                    class="mdi mdi-pyramid"
                    :style="{ color: colors.artifacts }"
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
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { LifeformDiscoveryEventType } from '@/shared/models/lifeform-discoveries/LifeformDiscoveryEventType';
    import { DailyLifeformDiscoveryResult, LifeformDiscoveryDataModule } from '@/views/stats/data/LifeformDiscoveryDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get discoveries() {
            return LifeformDiscoveryDataModule.dailyResultsArray;
        }

        private get colors() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries.events;
        }

        private get eventTypes(): Record<string, LifeformDiscoveryEventType> {
            return {
                [this.$i18n.$t.extension.empire.lifeforms.eventTypes.nothing]: LifeformDiscoveryEventType.nothing,
                [this.$i18n.$t.extension.empire.lifeforms.eventTypes.lostShip]: LifeformDiscoveryEventType.lostShip,
                [this.$i18n.$t.extension.empire.lifeforms.eventTypes.newLifeformFound]: LifeformDiscoveryEventType.newLifeformFound,
                [this.$i18n.$t.extension.empire.lifeforms.eventTypes.knownLifeformFound]: LifeformDiscoveryEventType.knownLifeformFound,
                [this.$i18n.$t.extension.empire.lifeforms.eventTypes.artifacts]: LifeformDiscoveryEventType.artifacts,
            };
        }

        private get lifeformFoundLabel() {
            return this.$i18n.$t.extension.empire.lifeforms.lifeformFound;
        }

        private get items(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            const typeGroups: LifeformDiscoveryEventType[][] = [
                [LifeformDiscoveryEventType.nothing],
                [LifeformDiscoveryEventType.lostShip],
                [LifeformDiscoveryEventType.newLifeformFound, LifeformDiscoveryEventType.knownLifeformFound],
                [LifeformDiscoveryEventType.artifacts],
            ]
            return typeGroups.map(group => ({
                label: group.length == 1 ? this.$i18n.$t.extension.empire.lifeforms.eventTypes[group[0]] : this.lifeformFoundLabel,
                getValue: discoveries => discoveries.reduce(
                    (acc, disc) => acc + group.reduce((acc, cur) => acc + disc.events[cur], 0),
                    0
                ),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyLifeformDiscoveryResult>[] {
            return [{
                label: this.$i18n.$t.extension.common.sum,
                getValue: discoveries => discoveries.reduce(
                    (acc, disc) => acc + Object.values(disc.events).reduce((acc, cur) => acc + cur, 0),
                    0
                ),
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