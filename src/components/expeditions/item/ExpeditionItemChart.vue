<template>
    <div class="item-fake-chart-wrapper">
        <div class="item-fake-chart" ref="scrollContainer">
            <div
                v-for="(itemDay, index) in itemDays"
                :key="index"
                class="item-column"
            >
                <div class="item-list">
                    <div
                        v-for="(item, itemIndex) in itemDay.items"
                        :key="itemIndex"
                    >
                        <img
                            :src="`https://s1-de.ogame.gameforge.com/cdn/img/item-images/${item.image}-small.png`"
                            width="32"
                            height="32"
                            class="item-image"
                            :class="`grade-${item.grade}`"
                        />
                    </div>
                </div>

                <div class="label">
                    <span>{{ $i18n.formatDate(itemDay.day, "short") }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ExpoEventItem } from '@/models/expeditions/ExpoEvent';
    import ExpoType from '@/models/expeditions/ExpoType';
    import Items from '@/models/items';
    import Item from '@/models/items/Item';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { startOfDay, sub } from 'date-fns';
    import add from 'date-fns/add';
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ExpeditionItemChart extends Vue {
        private get shownDays() {
            return SettingsModule.settings.charts.days;
        }

        private get firstDay() {
            return startOfDay(ExpoModule.firstExpo?.date
                ?? sub(new Date(), { days: this.shownDays }));
        }

        private get itemDays(): { day: Date; items: Item[] }[] {
            const result: { [key: number]: { day: Date; items: Item[] } } = {};
            const itemExpos = ExpoModule.expos.filter(expo => expo.type == ExpoType.item) as ExpoEventItem[];
            itemExpos.forEach(itemExpo => {
                const day = startOfDay(itemExpo.date).getTime();
                if (result[day] == null) {
                    result[day] = {
                        day: new Date(day),
                        items: [],
                    };
                }

                result[day].items.push(Items[itemExpo.itemHash]);
            });

            const days: { day: Date; items: Item[] }[] = [];
            let cur = startOfDay(this.firstDay);
            const end = startOfDay(new Date());
            while (cur <= end) {
                days.push({
                    day: cur,
                    items: result[cur.getTime()]?.items ?? [],
                });

                cur = add(cur, { days: 1 });
            }

            return days;
        }

        private mounted() {
            const scrollContainer = this.$refs.scrollContainer as HTMLDivElement;
            scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/styles/colors";
    $col-width: 50px;

    .item-fake-chart-wrapper {
        padding-left: 100px;
        height: 100%;
    }

    .item-fake-chart {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        min-height: 100%;
        max-height: 100%;
        overflow-x: auto;
        padding-left: 16px;
    }

    .item-column {
        min-height: 100%;
        max-height: 100%;
        display: grid;
        grid-template-rows: 1fr 100px;
        width: $col-width;
    }

    .item-list {
        display: flex;
        flex-direction: column-reverse;
        position: relative;

        &::before {
            position: absolute;
            content: "";
            top: 0;
            bottom: 0;
            left: 50%;
            width: 0.5px;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.1);
        }

        & > div {
            width: $col-width;
            text-align: center;
            margin-bottom: 4px;
        }
    }

    .label {
        height: 100px;
        width: $col-width;

        & > span {
            transform: translateX(-50%) rotate(-60deg);
            transform-origin: right;
            display: inline-block;
            font-size: 10px;
        }
    }

    .item-image {
        border: 2px solid;
        border-radius: 4px;

        &.grade-none {
            border-color: $ogame-item-grade-none;
        }

        &.grade-bronze {
            border-color: $ogame-item-grade-bronze;
        }

        &.grade-silver {
            border-color: $ogame-item-grade-silver;
        }

        &.grade-gold {
            border-color: $ogame-item-grade-gold;
        }

        &.grade-platinum {
            border-color: $ogame-item-grade-platinum;
        }
    }
</style>