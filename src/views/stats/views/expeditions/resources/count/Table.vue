<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :items="items"
            :footerItems="footerItems"
            show-average
            :averageNumberFormatOptions="avgNumberFormat"
            show-percentage
        >
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <o-resource :resource="resourceTypes[value]" size="24px" />
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
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ConversionRateSettings,
            ShowConvertedResourcesInCellsSettings,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;

        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get expos() {
            return ExpeditionDataModule.dailyResultsArray;
        }

        private get resourceTypes(): Record<string, ResourceType> {
            return {
                [this.$i18n.$t.resources.metal]: ResourceType.metal,
                [this.$i18n.$t.resources.crystal]: ResourceType.crystal,
                [this.$i18n.$t.resources.deuterium]: ResourceType.deuterium,
            };
        }

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return ResourceTypes.map(resource => ({
                label: this.$i18n.$t.resources[resource],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.findings.resourceCount[resource], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return [{
                label: this.$i18n.$t.common.resourceUnits,
                getValue: expos => expos.reduce(
                    (acc, expo) => acc
                        + expo.findings.resourceCount.metal
                        + expo.findings.resourceCount.crystal
                        + expo.findings.resourceCount.deuterium,
                    0
                ),
            }];
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