<template>
    <div>
        <expo-ranged-table :items="items" no-percentage>
            <template #value="{ value: items }">
                <span v-for="(item, index) in items" :key="index">
                    <img
                        :src="`https://s1-de.ogame.gameforge.com/cdn/img/item-images/${item.image}-small.png`"
                        width="32"
                        height="32"
                    />
                    {{ item.name }}
                </span>
            </template>
        </expo-ranged-table>
    </div>
</template>
<script lang="ts">
    import { ExpoEventItem } from '@/models/expeditions/ExpoEvent';
    import ExpoType from '@/models/expeditions/ExpoType';
    import Item from '@/models/items/Item';
    import ExpoModule from '@/store/modules/ExpoModule';
    import { startOfDay } from 'date-fns';
    import { Component, Vue } from 'vue-property-decorator';
    import Items from '@/models/items/';
    import ExpoRangedTable, { ExpoRangeTableItem } from '../ExpoRangedTable.vue';

    @Component({
        components: {
            ExpoRangedTable,
        },
    })
    export default class ExpeditionItemChart extends Vue {
        private get items(): ExpoRangeTableItem[] {
            const itemDays = this.itemDays.reverse();
            return itemDays.map(itemDay => ({
                label: this.$d(itemDay.day, 'short') as string,
                getValue: (expos) => expos.some(expo => expo.type == ExpoType.item) ? itemDay.items : [],
            }));
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

                result[day].items.push(Items[itemExpo.item.hash]);
            });

            return Object.values(result).sort((a, b) => a.day.getTime() - b.day.getTime());
        }
    }
</script>