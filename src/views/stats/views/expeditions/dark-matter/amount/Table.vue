<template>
    <div class="table-container">
        <ranged-stats-table
            :dataItems="expos"
            :filter="(expo) => filterExpo(expo)"
            :items="items"
            show-average
            :averageNumberFormatOptions="avgFormat"
        >
            <template #cell-label="{ value }">
                <span v-text="value" />

                <o-resource resource="dark-matter" size="24px" />
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
    import { ExpeditionEvent, ExpeditionEventDarkMatter } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
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
            return ExpeditionDataModule.expeditions;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.darkMatter;
        }

        private get items(): RangedStatsTableItem<ExpeditionEventDarkMatter>[] {
            return [{
                label: 'dark-matter',
                getValue: expos => expos.reduce((acc, expo) => acc + expo.darkMatter, 0),
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