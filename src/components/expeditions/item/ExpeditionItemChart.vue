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
                        <o-item :item="item.hash" :size="32" />
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
            const firstTrackedDay = ExpoModule.firstExpo?.date;
            const xDaysAgo = startOfDay(sub(new Date(), { days: SettingsModule.settings.charts.days - 1 }));
            return firstTrackedDay == null || startOfDay(firstTrackedDay) > xDaysAgo
                ? xDaysAgo
                : startOfDay(firstTrackedDay);
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