<template>
    <grid-table :items="groupedItems" :footerItems="footerItems" :columns="columns" sticky="100%" sticky-footer row-borders>
        <template #header-cost>
            <div class="cost-grid">
                <span v-text="$i18n.$t.extension.empire.amortization.table.cost" style="grid-column: 2" />
                <o-resource resource="metal" style="grid-column: 1" />
                <o-resource resource="crystal" />
                <o-resource resource="deuterium" />
            </div>
        </template>

        <template #cell-planet="{ item }">
            <template v-if="item.planetId != null">
                <span v-if="item.planetId > 0" class="planet">
                    <span v-text="getPlanetName(item.planetId)" />
                    <span v-text="formatPlanetCoordinates(item.planetId)" />
                </span>
                <span v-else class="planet">
                    <span v-text="`${$i18n.$t.extension.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                    <span v-text="`[-:-:${newColonyPosition}]`" />
                </span>
            </template>
        </template>

        <template #cell-item="{ item }">
            <div v-if="item.type == 'plasma-technology'" class="build-grid">TODO:</div>
            <div v-else class="build-grid">
                <template v-if="item.astrophysicsLevels.length > 0">
                    <o-research :research="ResearchType.astrophysics" size="36px" />
                    <span class="name-and-level">
                        <span v-text="$i18n.$t.ogame.research[ResearchType.astrophysics]" />
                        <span v-if="item.astrophysicsLevels.length == 1" v-text="item.astrophysicsLevels[0]" />
                        <span v-else v-text="`${item.astrophysicsLevels[0]} - ${item.astrophysicsLevels[item.astrophysicsLevels.length - 1]}`" />
                    </span>
                </template>

                <template v-for="lfBuilding in LifeformBuildingTypes">
                    <template v-if="item.lifeformBuildings[lfBuilding].length > 0">
                        <o-lifeform-building :building="lfBuilding" size="36px" :key="`image-${lfBuilding}`" />
                        <span class="name-and-level" :key="`level-${lfBuilding}`">
                            <span v-text="$i18n.$t.ogame.lifeformBuildings[lfBuilding]" />
                            <span v-if="item.lifeformBuildings[lfBuilding].length == 1" v-text="item.lifeformBuildings[lfBuilding][0]" />
                            <span
                                v-else
                                v-text="
                                    `${item.lifeformBuildings[lfBuilding][0]} - ${
                                        item.lifeformBuildings[lfBuilding][item.lifeformBuildings[lfBuilding].length - 1]
                                    }`
                                "
                            />
                        </span>
                    </template>
                </template>

                <template v-for="mine in mineBuildingTypes">
                    <template v-if="item.mines[mine].length > 0">
                        <o-building :building="mine" size="36px" :key="`image-${mine}`" />
                        <span class="name-and-level" :key="`level-${mine}`">
                            <span v-text="$i18n.$t.ogame.buildings[mine]" />
                            <span v-if="item.mines[mine].length == 1" v-text="item.mines[mine][0]" />
                            <span v-else v-text="`${item.mines[mine][0]} - ${item.mines[mine][item.mines[mine].length - 1]}`" />
                        </span>
                    </template>
                </template>

                <template v-for="lfTech in LifeformTechnologyTypes">
                    <template v-if="item.lifeformTechnologies[lfTech].length > 0">
                        <o-lifeform-technology :technology="lfTech" size="36px" :key="`image-${lfTech}`" />
                        <span class="name-and-level" :key="`level-${lfTech}`">
                            <span v-text="$i18n.$t.ogame.lifeformTechnologies[lfTech]" />
                            <span v-if="item.lifeformTechnologies[lfTech].length == 1" v-text="item.lifeformTechnologies[lfTech][0]" />
                            <span
                                v-else
                                v-text="
                                    `${item.lifeformTechnologies[lfTech][0]} - ${
                                        item.lifeformTechnologies[lfTech][item.lifeformTechnologies[lfTech].length - 1]
                                    }`
                                "
                            />
                        </span>
                    </template>
                </template>
            </div>
        </template>

        <template #cell-cost="{ value }">
            <div class="cost-grid">
                <span v-text="$i18n.$n(value.metal)" :class="{ zero: value.metal == 0 }" />
                <span v-text="$i18n.$n(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                <span v-text="$i18n.$n(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
            </div>
        </template>

        <template #cell-costConverted="{ value }">
            <decimal-number :value="value" />
        </template>

        <template #footer-cost="{ value }">
            <div class="cost-grid">
                <span v-text="$i18n.$n(value.metal)" :class="{ zero: value.metal == 0 }" />
                <span v-text="$i18n.$n(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                <span v-text="$i18n.$n(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
            </div>
        </template>

        <template #footer-costConverted="{ value }">
            <decimal-number :value="value" />
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GroupedAmortizationItem } from '@stats/models/empire/amortization';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { MineBuildingType } from '@/shared/models/empire/amortization/models';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { LifeformBuildingTypes } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologyTypes } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { GridTableColumn } from '../../common/GridTable.vue';
    import { addCost, Cost } from '@/shared/models/ogame/common/Cost';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    interface TableItem {
        planet?: number;
        item: GroupedAmortizationItem;
        cost: Cost;
        costConverted: number;
    }

    @Component({})
    export default class AmortizationGroupedItemTable extends Vue {
        @Prop({ required: true, type: Array as PropType<GroupedAmortizationItem[]> })
        private groupedItems!: GroupedAmortizationItem[];

        @Prop({ required: true, type: Number })
        private newColonyPosition!: number;

        private readonly ResearchType = ResearchType;
        private readonly mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
        private readonly LifeformBuildingTypes = LifeformBuildingTypes;
        private readonly LifeformTechnologyTypes = LifeformTechnologyTypes;

        private get columns(): GridTableColumn<keyof TableItem>[] {
            return [
                {
                    key: 'planet',
                    label: this.$i18n.$t.extension.empire.planet,
                    size: 'auto',
                },
                {
                    key: 'item',
                    label: this.$i18n.$t.extension.empire.amortization.table.levels,
                    size: '1fr',
                },
                {
                    key: 'cost',
                    label: this.$i18n.$t.extension.empire.amortization.table.cost,
                    size: '3fr',
                },
                {
                    key: 'costConverted',
                    label: `${this.$i18n.$t.extension.empire.amortization.table.cost} (${SettingsDataModule.settings.conversionRates.mode == 'msu'
                        ? this.$i18n.$t.extension.common.msu
                        : this.$i18n.$t.extension.common.dsu
                        })`,
                    size: '1fr',
                },
            ];
        }

        private get footerItems(): [TableItem] {
            return [{
                item: null!,
                
                cost: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                costConverted: 0,
                /* TODO: total best cost after reduction
                cost: this.groupedItems.reduce<Cost>(
                    (total, cur) => addCost(total, cur.cost),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                ),
                costConverted: this.groupedItems.reduce<number>(
                    (total, cur) => total + cur.costConverted,
                    0,
                ),
                */
            }];
        }


        private getPlanetName(id: number): string {
            return EmpireDataModule.empire.planets[id]?.name
                ?? `${this.$i18n.$t.extension.empire.amortization.saveLoad.abandonedPlanet} (${id})`;
        }

        private formatPlanetCoordinates(id: number): string {
            const coordinates = EmpireDataModule.empire.planets[id]?.coordinates as Coordinates | undefined;
            if (coordinates == null) {
                return '';
            }

            return this.formatCoordinates(coordinates);
        }

        private formatCoordinates(coordinates: Coordinates): string {
            return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
        }
    }
</script>
<style lang="scss" scoped>
    .cost-grid {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(3, 1fr);
        justify-items: end;
    }

    .name-and-level {
        display: grid;
        text-align: left;
        justify-self: start;
    }

    .build-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px;
        align-items: center;
    }

    .planet {
        display: grid;
        justify-self: end;
    }
</style>