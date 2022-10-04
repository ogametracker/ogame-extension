<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="expos" :items="items" :footerItems="footerItems" show-percentage>
            <template #cell-label="{ value }">
                <span v-text="value" />

                <span v-if="value == $i18n.$t.extension.expeditions.expeditionEventSizes.small" class="mdi mdi-hexagon-slice-1" :style="{ color: colors.small }" />
                <span v-else-if="value == $i18n.$t.extension.expeditions.expeditionEventSizes.medium" class="mdi mdi-hexagon-slice-3" :style="{ color: colors.medium }" />
                <span v-else-if="value == $i18n.$t.extension.expeditions.expeditionEventSizes.large" class="mdi mdi-hexagon-slice-5" :style="{ color: colors.large }" />
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
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEventSizes } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
        },
    })
    export default class Table extends Vue {

        @Prop({ required: true, type: String as PropType<ResourceType>, validator: (value: ResourceType) => ResourceTypes.includes(value) })
        private resource!: ResourceType;

        private showSettings = false;

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.sizes;
        }

        private get expos() {
            return ExpeditionDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return ExpeditionEventSizes.map(size => ({
                label: this.$i18n.$t.extension.expeditions.expeditionEventSizes[size],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.eventSizes.resourceCount[this.resource][size], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return [{
                label: this.$i18n.$t.extension.common.sum,
                getValue: expos => expos.reduce((acc, expo) => acc + expo.findings.resourceCount[this.resource], 0),
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