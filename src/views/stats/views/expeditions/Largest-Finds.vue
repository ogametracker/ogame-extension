<template>
    <div>
        <div v-for="key in keys" :key="key" class="find-column">
            <h3 v-text="`TODO: ${key} finds`" />

            <grid-table inline :columns="columns" :items="largestFinds[key]" :style="`--color: ${colors[key]}`">
                <template #cell-size="{ value }">
                    <expedition-size-icon :size="value" class="scaled-icon" />
                </template>
                <template #cell-amount="{ value }">
                    <span v-text="$i18n.$n(value)" />
                </template>
                <template #cell-date="{ value }">
                    <span v-text="$i18n.$d(value, 'date')" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventSize } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { Component, Vue } from 'vue-property-decorator';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import ExpeditionSizeIcon from '@/views/stats/components/expeditions/ExpeditionSizeIcon.vue';
    import { ExpeditionEventDarkMatter, ExpeditionEventFleet, ExpeditionEventResources } from '@/shared/models/expeditions/ExpeditionEvents';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { getRGBString } from '../../utils/getRGBString';

    type Find = {
        size: ExpeditionEventSize;
        amount: number;
        date: number;
    }

    type Finds = {
        metal: Find[];
        crystal: Find[];
        deuterium: Find[];
        shipUnits: Find[];
        darkMatter: Find[];
    }

    @Component({
        components: {
            ExpeditionSizeIcon,
        }
    })
    export default class LargestFinds extends Vue {

        private readonly maxCount = 25;

        private largestFinds: Finds = {
            metal: [],
            crystal: [],
            deuterium: [],
            shipUnits: [],
            darkMatter: [],
        };

        private readonly keys: (keyof Finds)[] = ['metal', 'crystal', 'deuterium', 'shipUnits', 'darkMatter'];

        private get colors(): Record<keyof Finds, string> {
            const colors = SettingsDataModule.settings.colors;

            return {
                metal: getRGBString(colors.resources.metal)!,
                crystal: getRGBString(colors.resources.crystal)!,
                deuterium: getRGBString(colors.resources.deuterium)!,
                darkMatter: getRGBString(colors.expeditions.events.darkMatter)!,
                shipUnits: getRGBString(colors.expeditions.events.fleet)!,
            };
        }

        private get columns(): GridTableColumn<keyof Find>[] {
            return [
                {
                    key: 'size',
                    label: 'LOCA: Size',
                },
                {
                    key: 'amount',
                    label: 'LOCA: Amount',
                },
                {
                    key: 'date',
                    label: 'LOCA: Date',
                },
            ];
        }

        async mounted() {
            const expeditions = await ExpeditionDataModule.getRawData();

            expeditions.forEach(expo => {
                if (expo.type == ExpeditionEventType.resources) {
                    this.addResourceExpo(expo);
                }
                else if (expo.type == ExpeditionEventType.fleet) {
                    this.addFleetExpo(expo);
                }
                else if (expo.type == ExpeditionEventType.darkMatter) {
                    this.addDarkMatterExpo(expo);
                }
            });
        }

        private addDarkMatterExpo(expo: ExpeditionEventDarkMatter) {
            const finds = this.largestFinds.darkMatter;
            const smallestFind: Find = finds[finds.length - 1] ?? {
                size: ExpeditionEventSize.small,
                amount: 0,
                date: 0,
            };
            if (smallestFind.amount >= expo.darkMatter) {
                return;
            }

            const index = finds.findIndex(find => find.amount < expo.darkMatter);
            finds.splice(index, 0, {
                size: expo.size,
                amount: expo.darkMatter,
                date: expo.date,
            });

            this.largestFinds.darkMatter = finds.slice(0, this.maxCount);
        }

        private addFleetExpo(expo: ExpeditionEventFleet) {
            //TODO: add to ship units
        }

        private addResourceExpo(expo: ExpeditionEventResources) {
            const resource = expo.resources.metal > 0
                ? ResourceType.metal
                : expo.resources.crystal > 0
                    ? ResourceType.crystal
                    : ResourceType.deuterium;

            const ressFinds = this.largestFinds[resource];
            const smallestFind: Find = ressFinds[ressFinds.length - 1] ?? {
                size: ExpeditionEventSize.small,
                amount: 0,
                date: 0,
            };
            if (smallestFind.amount >= expo.resources[resource]) {
                return;
            }

            const index = ressFinds.findIndex(find => find.amount < expo.resources[resource]);
            ressFinds.splice(index, 0, {
                size: expo.size,
                amount: expo.resources[resource],
                date: expo.date,
            });

            this.largestFinds[resource] = ressFinds.slice(0, this.maxCount);
        }
    }
</script>
<style lang="scss" scoped>
    .scaled-icon {
        transform: scale(1.6);
    }

    .find-column {
        display: inline-flex;
        flex-direction: column;
        margin-right: 16px;
    }
</style>