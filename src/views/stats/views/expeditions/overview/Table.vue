<template>
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
            <span v-text="value" />

            <span
                v-if="value == ExpeditionEventType.nothing"
                class="mdi mdi-close"
            />
            <span
                v-else-if="value == ExpeditionEventType.resources"
                class="tri-resource"
            >
                <o-resource resource="metal" size="24px" />
                <o-resource resource="crystal" size="24px" />
                <o-resource resource="deuterium" size="24px" />
            </span>
            <span v-else-if="value == ExpeditionEventType.fleet">
                TODO: {{ value }}
            </span>
            <span
                v-else-if="value == ExpeditionEventType.delay"
                class="mdi mdi-clock-outline"
            />
            <span
                v-else-if="value == ExpeditionEventType.early"
                class="mdi mdi-clock-outline"
            />
            <o-resource
                v-else-if="value == ExpeditionEventType.darkMatter"
                resource="dark-matter"
                size="24px"
            />
            <span
                v-else-if="value == ExpeditionEventType.pirates"
                class="mdi mdi-pirate"
            />
            <span
                v-else-if="value == ExpeditionEventType.aliens"
                class="mdi mdi-alien"
            />
            <span v-else-if="value == ExpeditionEventType.item">
                TODO: {{ value }}
            </span>
            <span
                v-else-if="value == ExpeditionEventType.trader"
                class="mdi mdi-swap-horizontal-bold"
            />
            <span
                v-else-if="value == ExpeditionEventType.lostFleet"
                class="mdi mdi-cross"
            />
        </template>
    </ranged-stats-table>
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
        private readonly ExpeditionEventType = ExpeditionEventType;

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
                label: type,
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
<style lang="scss" scoped>
    .tri-resource {
        position: relative;
        display: flex;

        > .o-resource:not(:last-of-type) {
            position: absolute;
            top: 0;
            left: 0;
        }

        > .o-resource[resource="metal"] {
            clip-path: polygon(0 0, 100% 0, 100% 25%, 50% 60%, 0 25%);
        }

        > .o-resource[resource="crystal"] {
            clip-path: polygon(0 25%, 50% 60%, 50% 100%, 0 100%);
        }

        > .o-resource[resource="deuterium"] {
            clip-path: polygon(100% 25%, 100% 100%, 50% 100%, 50% 60%);
        }
    }

    .mdi {
        transform: translateX(-30%) scale(1.6);
        width: 24px;
        display: inline-block;
    }
</style>