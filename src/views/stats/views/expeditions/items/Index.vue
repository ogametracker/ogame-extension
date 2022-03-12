<template>
    <div class="item-chart" :style="{ '--ticks': ticks }">
        <div
            class="day-column"
            v-for="(itemHashes, x) in itemsPerDays"
            :key="x"
        >
            <div class="day-items">
                <o-item v-for="(item, j) in itemHashes" :key="j" :item="item" />
            </div>

            <div class="day-label">
                <span v-text="formatDate(x)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventItem } from '@/shared/models/v1/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/v1/expeditions/ExpeditionEventType';
    import { ExpeditionDataModule } from '@/views/stats/data/ExpeditionDataModule';
    import { startOfDay } from 'date-fns';
    import differenceInDays from 'date-fns/differenceInDays';
    import addDays from 'date-fns/esm/addDays/index';
    import { Component, Vue } from 'vue-property-decorator';
    import { ItemHash } from '@/shared/models/v1/ogame/items/ItemHash';

    @Component({})
    export default class Charts extends Vue {
        private readonly ticks = 30;

        private get itemsPerDays(): ItemHash[][] {
            const perDay = ExpeditionDataModule.expeditionsPerDay;
            const firstDay = ExpeditionDataModule.firstDay;
            const dayCount = differenceInDays(startOfDay(Date.now()), firstDay);
            const days = Array.from({ length: dayCount + 1 }).map((_, add) => addDays(firstDay, add).getTime());

            const itemExposPerDay = days.map(
                day => (perDay[day] ?? []).filter(
                    expo => expo.type == ExpeditionEventType.item
                ) as ExpeditionEventItem[]
            );

            const array = itemExposPerDay.map(expos => expos.map(expo => expo.itemHash));
            while (array.length < this.ticks) {
                array.push([]);
            }

            return array;
        }

        private formatDate(x: number): string {
            const firstDay = ExpeditionDataModule.firstDay;
            const day = addDays(firstDay, x);

            return this.$date(day);
        }

        private mounted() {
            this.$el.scrollLeft = this.$el.scrollWidth - this.$el.clientWidth;
        }
    }
</script>
<style lang="scss" scoped>
    .item-chart {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-left: 16px; // to leave some space to the left for the x-label

        .day-column {
            height: 100%;
            min-width: calc(100% / var(--ticks));
            max-width: calc(100% / var(--ticks));
            display: grid;
            grid-template-rows: 1fr 100px;

            .day-items {
                display: flex;
                flex-direction: column-reverse;
                align-items: center;
                // vertical line in center
                background-image: linear-gradient(
                    to right,
                    transparent 0%,
                    transparent calc(50% - 1px),
                    rgba(255, 255, 255, 0.1) calc(50% - 1px),
                    rgba(255, 255, 255, 0.1) calc(50% + 1px),
                    transparent calc(50% + 1px),
                    transparent 100%
                );
            }

            .day-label {
                position: relative;
                overflow: visible;

                > span {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform-origin: top right;
                    transform: translateX(-100%) translateY(4px) rotate(-45deg);
                    white-space: pre;
                    color: #888;
                    font-size: 12px;
                }
            }
        }
    }
</style>