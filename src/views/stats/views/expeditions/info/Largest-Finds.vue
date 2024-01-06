<template>
    <loading-spinner v-if="loading" />
    <div v-else>
        <div v-for="key in keys" :key="key" class="find-column">
            <h3 v-text="$i18n.$t.extension.expeditions.topFinds.title(keyTranslations[key])" />

            <grid-table inline :columns="columns" :items="largestFinds[key].values" :style="`--color: ${colors[key]}`">
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

        <div class="find-column">
            <h3 v-text="`LOCA: Top-Funde (Anzahl ${selectedShip})`" />

            <grid-table inline :columns="columns" :items="largestFinds.shipAmounts[selectedShip].values" :style="`--color: 255,0,0`">
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
    import { ExpeditionDataModule } from '../../../data/ExpeditionDataModule';
    import ExpeditionSizeIcon from '@/views/stats/components/expeditions/ExpeditionSizeIcon.vue';
    import { ExpeditionEventDarkMatter, ExpeditionEventFleet, ExpeditionEventResources, ExpeditionFindableShipTypes, ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { GridTableColumn } from '../../../components/common/GridTable.vue';
    import { SettingsDataModule } from '../../../data/SettingsDataModule';
    import { getRGBString } from '../../../utils/getRGBString';
    import { ShipByTypes } from '@/shared/models/ogame/ships/ShipTypes';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { TopList } from '@/views/stats/models/TopList';
    import { getMsuOrDsu } from '@/views/stats/models/settings/getMsuOrDsu';
    import { createRecord } from "@/shared/utils/createRecord";

    type Find = {
        size: ExpeditionEventSize;
        amount: number;
        date: number;
    }
    type ShipAmountFind = {
        amount: number;
        date: number;
    }

    type Finds = {
        metal: TopList<Find>;
        crystal: TopList<Find>;
        deuterium: TopList<Find>;
        shipUnits: TopList<Find>;
        shipUnitsConverted: TopList<Find>;
        darkMatter: TopList<Find>;
        shipAmounts: Record<ExpeditionFindableShipType, TopList<ShipAmountFind>>;
    }

    @Component({
        components: {
            ExpeditionSizeIcon,
        }
    })
    export default class LargestFinds extends Vue {

        private loading = true;

        private largestFinds: Finds = {
            metal: new TopList<Find>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            }),
            crystal: new TopList<Find>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            }),
            deuterium: new TopList<Find>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            }),
            shipUnits: new TopList<Find>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            }),
            shipUnitsConverted: new TopList<Find>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            }),
            darkMatter: new TopList<Find>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            }),
            shipAmounts: createRecord(ExpeditionFindableShipTypes, ship => new TopList<ShipAmountFind>({
                comparator: (a, b) => b.amount - a.amount,
                maxSize: 25,
            })),
        };

        private readonly keys: (keyof Finds)[] = ['metal', 'crystal', 'deuterium', 'shipUnits', 'shipUnitsConverted', 'darkMatter'];

        private selectedShip: ExpeditionFindableShipType = ShipType.espionageProbe;

        private get keyTranslations(): Record<keyof Finds, string> {
            return {
                metal: this.$i18n.$t.ogame.resources.metal,
                crystal: this.$i18n.$t.ogame.resources.crystal,
                deuterium: this.$i18n.$t.ogame.resources.deuterium,
                shipUnits: this.$i18n.$t.extension.expeditions.topFinds.shipUnits,
                shipUnitsConverted: this.$i18n.$t.extension.expeditions.topFinds.shipUnits + ` (${
                    SettingsDataModule.settings.conversionRates.mode == 'msu'
                        ? this.$i18n.$t.extension.common.msu
                        : this.$i18n.$t.extension.common.dsu
                })`,
                darkMatter: this.$i18n.$t.ogame.premium.darkMatter,
            };
        }

        private get colors(): Record<keyof Finds, string> {
            const colors = SettingsDataModule.settings.colors;

            return {
                metal: getRGBString(colors.resources.metal)!,
                crystal: getRGBString(colors.resources.crystal)!,
                deuterium: getRGBString(colors.resources.deuterium)!,
                darkMatter: getRGBString(colors.expeditions.events.darkMatter)!,
                shipUnits: getRGBString(colors.expeditions.events.fleet)!,
                shipUnitsConverted: getRGBString(colors.expeditions.events.fleet)!,
            };
        }

        private get columns(): GridTableColumn<keyof Find>[] {
            return [
                {
                    key: 'size',
                    label: this.$i18n.$t.extension.expeditions.topFinds.size,
                },
                {
                    key: 'amount',
                    label: this.$i18n.$t.extension.expeditions.topFinds.amount,
                },
                {
                    key: 'date',
                    label: this.$i18n.$t.extension.expeditions.topFinds.date,
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

            this.loading = false;
        }

        private addDarkMatterExpo(expo: ExpeditionEventDarkMatter) {
            this.largestFinds.darkMatter.add({
                size: expo.size,
                amount: expo.darkMatter,
                date: expo.date,
            });
        }

        private addFleetExpo(expo: ExpeditionEventFleet) {
            // ship units (metal + crystal)
            {
                const units = ExpeditionFindableShipTypes.map(shipType => {
                    const count = expo.fleet[shipType] ?? 0;
                    const ship = ShipByTypes[shipType];

                    const cost = ship.cost;
                    return (cost.metal + cost.crystal) * count;
                }).reduce((total, cur) => total + cur, 0);

                this.largestFinds.shipUnits.add({
                    size: expo.size,
                    amount: units,
                    date: expo.date,
                });
            }
            // ship units (MSU)
            {
                const unitsMsu = ExpeditionFindableShipTypes.map(shipType => {
                    const count = expo.fleet[shipType] ?? 0;
                    const ship = ShipByTypes[shipType];

                    const cost = ship.cost;
                    return getMsuOrDsu(cost) * count;
                }).reduce((total, cur) => total + cur, 0);

                this.largestFinds.shipUnitsConverted.add({
                    size: expo.size,
                    amount: unitsMsu,
                    date: expo.date,
                });
            }

            // per ship type
            ExpeditionFindableShipTypes.forEach(ship => {
                const amount = expo.fleet[ship] ?? 0;
                if(amount == 0) {
                    return;
                }

                this.largestFinds.shipAmounts[ship].add({
                    date: expo.date,
                    amount,
                });
            });
        }

        private addResourceExpo(expo: ExpeditionEventResources) {
            const resource = expo.resources.metal > 0
                ? ResourceType.metal
                : expo.resources.crystal > 0
                    ? ResourceType.crystal
                    : ResourceType.deuterium;
                    
            if(expo.resources[resource] == 0) {
                return;
            }

            this.largestFinds[resource].add({
                size: expo.size,
                amount: expo.resources[resource],
                date: expo.date,
            });
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