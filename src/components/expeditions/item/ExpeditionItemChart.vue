<template>
    <div class="item-fake-chart">
        <div class="item-cols" :style="gridColumnStyle">
            <div v-for="(itemDay, index) in itemDays" :key="index">
                <div
                    v-for="(item, itemIndex) in itemDay.items"
                    :key="itemIndex"
                >
                    <img
                        :src="`https://s1-de.ogame.gameforge.com/cdn/img/item-images/${item.image}-small.png`"
                        width="32"
                        height="32"
                    />
                </div>
            </div>
        </div>
        <div class="label-cols" :style="gridColumnStyle">
            <div
                v-for="(itemDay, index) in itemDays"
                :key="index"
                class="column-label"
            >
                <span>{{ $d(itemDay.day, "short") }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { ExpoEventItem } from '@/models/expeditions/ExpoEvent';
    import ExpoType from '@/models/expeditions/ExpoType';
    import items from '@/models/items';
    import Item from '@/models/items/Item';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { startOfDay, sub } from 'date-fns';
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ExpeditionItemChart extends Vue {
        private get colWidth() {
            return '32px';
        }

        private get gridColumnStyle() {
            return {
                'grid-template-columns': `repeat(auto-fill, ${this.colWidth})`,
            };
        }

        private get firstDay() {
            return startOfDay(ExpoModule.firstExpo?.date
                ?? sub(new Date(), { days: SettingsModule.settings.charts.days }));
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

                result[day].items.push(items[itemExpo.item.hash]);
            });

            return Object.values(result).sort((a, b) => a.day.getTime() - b.day.getTime());
        }
    }
</script>
<style lang="scss" scoped>
    .item-fake-chart {
        display: grid;
        grid-template-rows: 1fr 100px;
        height: 100%;
        overflow: auto;
    }

    .item-cols,
    .label-cols {
        display: grid;
        grid-auto-flow: column;
        grid-column-gap: 4px;
    }

    .column-label {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-size: 9px;
    }
</style>