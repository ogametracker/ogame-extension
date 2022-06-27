<template>
    <grid-table
        :columns="columns"
        :items="items"
        :footerItems="footerItems"
        class="resources-production-table"
        :style="`--item-count: ${maxItemCount}`"
    >
        <template #header-metal>
            <o-resource resource="metal" size="75px" />
        </template>
        <template #header-crystal>
            <o-resource resource="crystal" size="75px" />
        </template>
        <template #header-deuterium>
            <o-resource resource="deuterium" size="75px" />
        </template>
        <template #header-total> {{ $i18n.$t.common.resourceUnits }} </template>
        <template #header-totalMsu>
            {{ $i18n.$t.common.resourceUnitsMsu }}
        </template>

        <template #header-productionSettings>
            <div class="production-settings-mini-table">
                <span
                    class="header"
                    v-text="$i18n.$t.empire.production.activeProductionSettings"
                />
                <o-building building="metal-mine" />
                <o-building building="crystal-mine" />
                <o-building building="deuterium-synthesizer" />
                <o-building building="solar-plant" />
                <o-building building="fusion-reactor" />
                <o-ship ship="solar-satellite" />
                <o-ship ship="crawler" />
                <span
                    style="grid-column: auto / span 4"
                    v-text="$i18n.$t.empire.production.items"
                />
            </div>
        </template>

        <template #cell-planet="{ value: planet }">
            <div class="planet-info">
                <span v-text="planet.name" />
                <span>
                    [{{ planet.coordinates.galaxy }}:{{
                        planet.coordinates.system
                    }}:{{ planet.coordinates.position }}]
                </span>
            </div>
        </template>

        <template #cell-productionSettings="{ value: settings, item: prodItem }">
            <div class="production-settings-mini-table">
                <span v-text="settings.metalMine" />
                <span v-text="settings.crystalMine" />
                <span v-text="settings.deuteriumSynthesizer" />
                <span v-text="settings.solarPlant" />
                <span v-text="settings.fusionReactor" />
                <span v-text="settings.solarSatellite" />
                <span v-text="settings.crawler" />

                <template v-for="(item, i) in getActiveItems(prodItem)">
                    <span v-if="item == null" :key="i" />
                    <o-item v-else :key="i" :item="item" size="24px" />
                </template>
            </div>
        </template>

        <template #footer-planet="{ value, item }">
            <span v-if="!item.isResourcePackageRow" v-text="value.name" />
            <span v-else class="resource-packages-cell">
                <o-item
                    :item="ItemHash.resourcePackage_all"
                    size="32px"
                    hide-item-grade
                />
                <input
                    type="number"
                    v-model.number="resourcePackageAmounts.all"
                    min="0"
                    step="1"
                />

                <o-item
                    :item="ItemHash.resourcePackage_metal"
                    size="32px"
                    hide-item-grade
                />
                <input
                    type="number"
                    v-model.number="resourcePackageAmounts.metal"
                    min="0"
                    step="1"
                />

                <o-item
                    :item="ItemHash.resourcePackage_crystal"
                    size="32px"
                    hide-item-grade
                />
                <input
                    type="number"
                    v-model.number="resourcePackageAmounts.crystal"
                    min="0"
                    step="1"
                />

                <o-item
                    :item="ItemHash.resourcePackage_deuterium"
                    size="32px"
                    hide-item-grade
                />
                <input
                    type="number"
                    v-model.number="resourcePackageAmounts.deuterium"
                    min="0"
                    step="1"
                />
            </span>
        </template>
        <template #cell-metal="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #cell-crystal="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #cell-deuterium="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #cell-total="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #cell-totalMsu="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #footer-metal="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #footer-crystal="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #footer-deuterium="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #footer-total="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
        <template #footer-totalMsu="{ value }">
            {{ $i18n.$n(value, numberFormat) }}
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Vue } from 'vue-property-decorator';
    import { MetalMine } from '@/shared/models/ogame/buildings/MetalMine';
    import { CrystalMine } from '@/shared/models/ogame/buildings/CrystalMine';
    import { DeuteriumSynthesizer } from '@/shared/models/ogame/buildings/DeuteriumSynthesizer';
    import { FusionReactor } from '@/shared/models/ogame/buildings/FusionReactor';
    import { ProductionBuildingDependencies } from '@/shared/models/ogame/buildings/ProductionBuilding';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { ItemHash, ItemHashes } from '@/shared/models/ogame/items/ItemHash';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
    import { CrawlerProductionPercentage } from '@/shared/models/empire/CrawlerProductionPercentage';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';

    interface Production {
        metal: number;
        crystal: number;
        deuterium: number;
    }

    interface ProductionItem {
        planet: {
            name: string;
            coordinates: Coordinates;
        };
        metal: number;
        crystal: number;
        deuterium: number;
        total: number;
        totalMsu: number;

        productionSettings: ProductionSettingsItem;
        activeItems: ItemHash[];

        isResourcePackageRow?: boolean;
    }

    interface ProductionSettingsItem {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;
        solarPlant: number;
        fusionReactor: number;
        solarSatellite: number;
        crawler: number;
    }

    @Component({})
    export default class Resources extends Vue {
        private readonly ItemHash = ItemHash;

        private readonly numberFormat: Intl.NumberFormatOptions = {
            maximumFractionDigits: 0,
        };

        private readonly resourcePackageAmounts = {
            all: 0,
            metal: 0,
            crystal: 0,
            deuterium: 0,
        };

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get columns(): GridTableColumn<keyof ProductionItem>[] {
            return [
                {
                    key: 'planet',
                    label: this.$i18n.$t.empire.planet,
                },
                { key: 'metal' },
                { key: 'crystal' },
                { key: 'deuterium' },
                {
                    key: 'total',
                    class: 'total-column',
                },
                { key: 'totalMsu' },
                {
                    key: 'productionSettings',
                    class: 'production-settings-column',
                    headerClass: 'production-settings-header-column',
                    size: 'max-content',
                },
            ];
        }

        private get maxItemCount() {
            return Math.max(...this.items.map(i => i.activeItems.length));
        }

        private get items(): ProductionItem[] {
            return this.planets.map(planet => {
                const production = this.getProduction(planet);

                return {
                    planet,
                    ...production,
                    total: production.metal + production.crystal + production.deuterium,
                    totalMsu: production.metal + production.crystal * this.msuConversionRates.crystal + production.deuterium * this.msuConversionRates.deuterium,

                    productionSettings: {
                        metalMine: planet.productionSettings[BuildingType.metalMine],
                        crystalMine: planet.productionSettings[BuildingType.crystalMine],
                        deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                        solarPlant: planet.productionSettings[BuildingType.solarPlant],
                        fusionReactor: planet.productionSettings[BuildingType.fusionReactor],

                        solarSatellite: planet.productionSettings[ShipType.solarSatellite],
                        crawler: this.correctCrawlerProductionSettings(planet.productionSettings[ShipType.crawler]),
                    },

                    activeItems: ItemHashes.filter(item => planet.activeItems[item]! > Date.now() || planet.activeItems[item] == 'permanent'),
                };
            });
        }

        private correctCrawlerProductionSettings(production: CrawlerProductionPercentage): CrawlerProductionPercentage {
            if (EmpireDataModule.empire?.playerClass == PlayerClass.collector) {
                return production;
            }

            return Math.min(100, production) as CrawlerProductionPercentage;
        }

        private get footerItems(): ProductionItem[] {
            const planets = this.planets;

            const metalPerHour = planets.reduce((acc, cur) => acc + this.getProduction(cur).metal, 0);
            const crystalPerHour = planets.reduce((acc, cur) => acc + this.getProduction(cur).crystal, 0);
            const deuteriumPerHour = planets.reduce((acc, cur) => acc + this.getProduction(cur).deuterium, 0);
            const totalPerHour = metalPerHour + crystalPerHour + deuteriumPerHour;
            const totalMsuPerHour = metalPerHour + crystalPerHour * this.msuConversionRates.crystal + deuteriumPerHour * this.msuConversionRates.deuterium;

            const metalPackages = metalPerHour * 24 * (this.resourcePackageAmounts.all + this.resourcePackageAmounts.metal);
            const crystalPackages = crystalPerHour * 24 * (this.resourcePackageAmounts.all + this.resourcePackageAmounts.crystal);
            const deuteriumPackages = deuteriumPerHour * 24 * (this.resourcePackageAmounts.all + this.resourcePackageAmounts.deuterium);

            return [
                {
                    planet: {
                        name: this.$i18n.$t.empire.production.averagePerHour,
                        coordinates: null!,
                    },
                    metal: metalPerHour / planets.length,
                    crystal: crystalPerHour / planets.length,
                    deuterium: deuteriumPerHour / planets.length,
                    total: totalPerHour / planets.length,
                    totalMsu: totalMsuPerHour / planets.length,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    planet: {
                        name: this.$i18n.$t.empire.production.totalPerHour,
                        coordinates: null!,
                    },
                    metal: metalPerHour,
                    crystal: crystalPerHour,
                    deuterium: deuteriumPerHour,
                    total: totalPerHour,
                    totalMsu: totalMsuPerHour,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    planet: {
                        name: this.$i18n.$t.empire.production.totalPerDay,
                        coordinates: null!,
                    },
                    metal: metalPerHour * 24,
                    crystal: crystalPerHour * 24,
                    deuterium: deuteriumPerHour * 24,
                    total: totalPerHour * 24,
                    totalMsu: totalMsuPerHour * 24,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    planet: {
                        name: this.$i18n.$t.empire.production.totalPerWeek,
                        coordinates: null!,
                    },
                    metal: metalPerHour * 24 * 7,
                    crystal: crystalPerHour * 24 * 7,
                    deuterium: deuteriumPerHour * 24 * 7,
                    total: totalPerHour * 24 * 7,
                    totalMsu: totalMsuPerHour * 24 * 7,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    isResourcePackageRow: true,
                    planet: {
                        name: 'row-for-resource-packages',
                        coordinates: null!,
                    },
                    metal: metalPackages,
                    crystal: crystalPackages,
                    deuterium: deuteriumPackages,
                    total: metalPackages + crystalPackages + deuteriumPackages,
                    totalMsu: metalPackages + crystalPackages * this.msuConversionRates.crystal + deuteriumPackages * this.msuConversionRates.deuterium,

                    productionSettings: null!,
                    activeItems: [],
                },
            ];
        }


        private get planets(): PlanetData[] {
            return Object.values(EmpireDataModule.empire.planets)
                .filter(planet => !planet.isMoon)
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - EmpireDataModule.empire.planetOrder.indexOf(b.id)) as PlanetData[];
        }

        private getProduction(planet: PlanetData): Production {
            const deps: ProductionBuildingDependencies = {
                serverSettings: ServerSettingsDataModule.serverSettings,
                planet: {
                    ...planet,
                    productionSettings: {
                        ...planet.productionSettings,
                        [ShipType.crawler]: this.correctCrawlerProductionSettings(planet.productionSettings[ShipType.crawler]),
                    },
                },
                player: EmpireDataModule.empire, 
            };

            return {
                metal: MetalMine.getProduction(planet.buildings[BuildingType.metalMine], deps).metal,
                crystal: CrystalMine.getProduction(planet.buildings[BuildingType.crystalMine], deps).crystal,
                deuterium: DeuteriumSynthesizer.getProduction(planet.buildings[BuildingType.deuteriumSynthesizer], deps).deuterium
                    - FusionReactor.getConsumption(planet.buildings[BuildingType.fusionReactor], deps).deuterium,
            };
        }

        private readonly productionBoostItems_metal: ItemHash[] = [
            ItemHash.metalBooster_bronze_1day,
            ItemHash.metalBooster_bronze_7days,
            ItemHash.metalBooster_silver_7days,
            ItemHash.metalBooster_silver_30days,
            ItemHash.metalBooster_silver_90days,
            ItemHash.metalBooster_gold_7days,
            ItemHash.metalBooster_gold_30days,
            ItemHash.metalBooster_gold_90days,
            ItemHash.metalBooster_platinum_7days,
            ItemHash.metalBooster_platinum_30days,
            ItemHash.metalBooster_platinum_90days,
        ];
        private readonly productionBoostItems_crystal: ItemHash[] = [
            ItemHash.crystalBooster_bronze_1day,
            ItemHash.crystalBooster_bronze_7days,
            ItemHash.crystalBooster_silver_7days,
            ItemHash.crystalBooster_silver_30days,
            ItemHash.crystalBooster_silver_90days,
            ItemHash.crystalBooster_gold_7days,
            ItemHash.crystalBooster_gold_30days,
            ItemHash.crystalBooster_gold_90days,
            ItemHash.crystalBooster_platinum_7days,
            ItemHash.crystalBooster_platinum_30days,
            ItemHash.crystalBooster_platinum_90days,
        ];
        private readonly productionBoostItems_deuterium: ItemHash[] = [
            ItemHash.deuteriumBooster_bronze_1day,
            ItemHash.deuteriumBooster_bronze_7days,
            ItemHash.deuteriumBooster_silver_7days,
            ItemHash.deuteriumBooster_silver_30days,
            ItemHash.deuteriumBooster_silver_90days,
            ItemHash.deuteriumBooster_gold_7days,
            ItemHash.deuteriumBooster_gold_30days,
            ItemHash.deuteriumBooster_gold_90days,
            ItemHash.deuteriumBooster_platinum_7days,
            ItemHash.deuteriumBooster_platinum_30days,
            ItemHash.deuteriumBooster_platinum_90days,
        ];
        private readonly productionBoostItems_energy: ItemHash[] = [
            ItemHash.energyBooster_bronze_7days,
            ItemHash.energyBooster_silver_7days,
            ItemHash.energyBooster_silver_30days,
            ItemHash.energyBooster_silver_90days,
            ItemHash.energyBooster_gold_7days,
            ItemHash.energyBooster_gold_30days,
            ItemHash.energyBooster_gold_90days,
            ItemHash.energyBooster_platinum_7days,
            ItemHash.energyBooster_platinum_30days,
            ItemHash.energyBooster_platinum_90days,
        ];

        private getActiveItems(item: ProductionItem): (ItemHash | null)[] {
            return [
                item.activeItems.find(item => this.productionBoostItems_metal.includes(item)) ?? null,
                item.activeItems.find(item => this.productionBoostItems_crystal.includes(item)) ?? null,
                item.activeItems.find(item => this.productionBoostItems_deuterium.includes(item)) ?? null,
                item.activeItems.find(item => this.productionBoostItems_energy.includes(item)) ?? null,
            ];
        }
    }
</script>
<style lang="scss" scoped>
    .resources-production-table::v-deep {
        .total-column {
            border-left: 1px solid rgba(var(--color), 0.33);
        }

        .production-settings-column {
            border-left: 3px double rgba(var(--color), 0.5);
        }
        .production-settings-header-column {
            border-left: 3px solid transparent;
        }

        > .grid-table-foot > .grid-table-row:last-of-type > .grid-table-cell {
            border-top: 3px double rgba(var(--color), 0.5);
        }
    }

    .planet-info {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: end;
        column-gap: 8px;
    }

    .production-settings-mini-table {
        display: grid;
        grid-template-columns: repeat(7, 1fr) repeat(4, 24px);
        width: 100%;
        justify-items: center;
        align-items: center;
        gap: 8px;

        > .header {
            grid-column: 1 / span 11;
        }
        > * {
            padding: 0 4px;
        }
    }

    .resource-packages-cell {
        display: grid;
        grid-template-columns: repeat(2, auto);

        > input[type="number"] {
            width: 60px;
        }
    }
</style>