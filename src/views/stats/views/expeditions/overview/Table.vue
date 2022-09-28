<template>
    <div class="table-container">
        <ranged-stats-table :dataItems="expos" :items="items" :footerItems="footerItems" show-percentage show-average :averageNumberFormatOptions="avgFormat">
            <template #cell-label="{ value }">
                <span v-text="value" class="mr-2" />

                <expedition-event-type-icon :type="getExpeditionEventType(value)" />
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
    import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
    import { DailyExpeditionResult, ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import ExpeditionEventTypeIcon from '@stats/components/expeditions/ExpeditionEventTypeIcon.vue';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { _throw } from '@/shared/utils/_throw';

    @Component({
        components: {
            RangedStatsTable,
            DateRangeSettings,
            ExpeditionEventTypeIcon,
        },
    })
    export default class Table extends Vue {
        private showSettings = false;
        private readonly detroidItem = ItemHash.detroid_bronze;
        private readonly ShipType = ShipType;

        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private getExpeditionEventType(text: string): ExpeditionEventType {
            const reverseMap = createRecord(ExpeditionEventTypes, type => this.$i18n.$t.extension.expeditions.expeditionEvents[type]);
            return (Object.entries(reverseMap) as [ExpeditionEventType, string][])
                .find(e => e[1] == text)?.[0]
                ?? _throw('failed to find fitting type');
        }

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }

        private get expos() {
            return ExpeditionDataModule.dailyResultsArray;
        }

        private get items(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return ExpeditionEventTypes.map(type => ({
                label: this.$i18n.$t.extension.expeditions.expeditionEvents[type],
                getValue: expos => expos.reduce((acc, expo) => acc + expo.events[type], 0),
            }));
        }

        private get footerItems(): RangedStatsTableItem<DailyExpeditionResult>[] {
            return [{
                label: this.$i18n.$t.extension.common.sum,
                getValue: expos => ExpeditionEventTypes.reduce(
                    (acc, type) => acc + expos.reduce((acc, expo) => acc + expo.events[type], 0),
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