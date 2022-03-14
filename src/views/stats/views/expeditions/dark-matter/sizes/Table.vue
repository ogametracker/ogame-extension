<template>
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
                v-if="value == ExpeditionEventSize.small"
                class="mdi mdi-hexagon-slice-1"
            />
            <span
                v-else-if="value == ExpeditionEventSize.medium"
                class="mdi mdi-hexagon-slice-3"
            />
            <span
                v-else-if="value == ExpeditionEventSize.large"
                class="mdi mdi-hexagon-slice-5"
            />
        </template>
    </ranged-stats-table>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import RangedStatsTable, { RangedStatsTableItem } from '@stats/components/stats/RangedStatsTable.vue';
    import { ExpeditionEvent, ExpeditionEventDarkMatter } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ExpeditionEventSize } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';

    @Component({
        components: {
            RangedStatsTable,
        },
    })
    export default class Table extends Vue {
        private readonly ExpeditionEventSize = ExpeditionEventSize;

        private filterExpo(expo: ExpeditionEvent): boolean {
            return expo.type == ExpeditionEventType.darkMatter;
        }

        private get expos() {
            return ExpeditionDataModule.expeditions;
        }

        private get items(): RangedStatsTableItem<ExpeditionEventDarkMatter>[] {
            return Object.values(ExpeditionEventSize).map(size => ({
                label: size,
                getValue: expos => expos.filter(expo => expo.size == size).length,
            }));
        }

        private get footerItems(): RangedStatsTableItem<ExpeditionEventDarkMatter>[] {
            return [{
                label: `LOCA: Total`,
                getValue: expos => expos.length,
            }];
        }
    }
</script>
<style lang="scss" scoped>
    .mdi {
        transform: translateX(-30%) scale(1.6);
        width: 24px;
        display: inline-block;
    }
</style>