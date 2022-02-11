<template>
    <ranged-stats-table
        :dataItems="expos"
        :filter="(expo) => filterExpo(expo)"
        :items="items"
        :footerItems="footerItems"
        show-percentage
        show-average
        :averageNumberFormatOptions="avgFormat"
    />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private avgFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private filterExpo(expo: ExpeditionEvent): boolean {
            return true;
        }

        private get items(): RangedStatsTableItem<ExpeditionEvent>[] {
            return Object.keys(ExpeditionEventType).map(type => ({
                label: `LOCA: ${type}`,
                getValue: expos => expos.filter(expo => expo.type == type).length,
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEvent>[] {
            return [{
                label: `LOCA: Total`,
                getValue: expos => expos.length,
            }];
        }
    }
</script>