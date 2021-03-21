<template>
    <b-col class="overflow-auto flex-column">
        <b-row
            v-for="day in allDays"
            :key="day.text"
            class="mb-1 border-bottom"
        >
            <b-col md="auto" style="width: 150px">
                <span class="text-white">
                    {{ day.text }}
                </span>
            </b-col>
            <b-col>
                <div
                    v-for="(item, index) in itemsAtDay(day.date)"
                    :key="index"
                    class="py-1"
                >
                    <img
                        :src="`https://s146-de.ogame.gameforge.com/cdn/img/item-images/${item.image}-small.png`"
                        width="32"
                        height="32"
                    />
                    <span>
                        {{ item.name }}
                    </span>
                </div>
            </b-col>
        </b-row>
    </b-col>
</template>
<script lang="ts">
    import { ExpoEventItem } from '@/models/expeditions/ExpoEvent';
    import ExpoType from '@/models/expeditions/ExpoType';
    import Item from '@/models/items/Item';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { startOfDay, format, isSameDay } from 'date-fns';
    import { Component, Vue } from 'vue-property-decorator';
    import Items from '@/models/items/';

    @Component({})
    export default class ExpeditionItemChart extends Vue {
        private readonly dateFormat = 'dd.MM.yyyy';

        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;
        private readonly items = Items;

        private get allDays() {
            const days = new Set(this.expoModule.expos
                .filter(expo => expo.type == ExpoType.item)
                .map(expo => startOfDay(expo.date).getTime()));
                
            return [...days].sort((a, b) => a - b)
                .map(date => ({
                    text: format(date, this.dateFormat),
                    date: new Date(date)
                }))
                .reverse();
        }

        private itemsAtDay(day: Date): Item[] {
            const itemExpos: ExpoEventItem[] = this.expoModule.expos.filter(expo => expo.type == ExpoType.item && isSameDay(day, expo.date)) as ExpoEventItem[];
            return itemExpos.map(expo => this.items[expo.item.hash]);
        }
    }
</script>