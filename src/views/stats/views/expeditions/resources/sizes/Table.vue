<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :filter="(expo) => filterExpo(expo)"
            :items="items"
            :footerItems="footerItems"
            show-percentage
        >
            <template #cell-label="{ value }">
                <span v-text="value" />

                <span
                    v-if="value == $i18n.$t.expeditions.expeditionEventSizes.small"
                    class="mdi mdi-hexagon-slice-1"
                    :style="{ color: colors.small }"
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEventSizes.medium"
                    class="mdi mdi-hexagon-slice-3"
                    :style="{ color: colors.medium }"
                />
                <span
                    v-else-if="value == $i18n.$t.expeditions.expeditionEventSizes.large"
                    class="mdi mdi-hexagon-slice-5"
                    :style="{ color: colors.large }"
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
    import { ExpeditionEvent, ExpeditionEventResources } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ExpeditionEventSize } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {
        private readonly ExpeditionEventSize = ExpeditionEventSize;
        private showSettings = false;
        
        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.resources;
        }

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private get items(): RangedStatsTableItem<ExpeditionEventResources>[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                label: this.$i18n.$t.expeditions.expeditionEventSizes[size],
                getValue: expos => expos.filter(expo => expo.size == size).length,
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventResources>[] {
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