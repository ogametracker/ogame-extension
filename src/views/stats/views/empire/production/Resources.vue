<template>
    <div class="table-container">
        <div v-text="$i18n.$t.empire.production.messageProduction100" style="grid-column: 1 / span 2" />

        <grid-table
            :columns="columns"
            :items="items"
            sticky
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
            <template #header-totalConverted>
                {{ `${$i18n.$t.common.resourceUnits} (${conversionModeText})` }}
            </template>

            <template #header-productionSettings>
                <div class="production-settings-mini-table">
                    <span class="header" v-text="$i18n.$t.empire.production.activeProductionSettings" />
                    <o-building :building="BuildingType.metalMine" />
                    <o-building :building="BuildingType.crystalMine" />
                    <o-building :building="BuildingType.deuteriumSynthesizer" />
                    <o-building :building="BuildingType.solarPlant" />
                    <o-building :building="BuildingType.fusionReactor" />
                    <o-ship :ship="ShipType.solarSatellite" />
                    <o-ship :ship="ShipType.crawler" />
                    <span style="grid-column: auto / span 4" v-text="$i18n.$t.empire.production.items" />
                </div>
            </template>

            <template #cell-planet="{ value: planet }">
                <div class="planet-info">
                    <span v-text="planet.name" />
                    <span> [{{ planet.coordinates.galaxy }}:{{ planet.coordinates.system }}:{{ planet.coordinates.position }}] </span>
                    <span
                        class="mdi toggle-breakdown"
                        :class="showBreakdown[planet.id] ? 'mdi-menu-up' : 'mdi-menu-down'"
                        @click="toggleBreakdown(planet.id)"
                    />
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

            <template #cell-breakdown="{ item }">
                <div v-if="showBreakdown[item.planet.id]" class="breakdown-list">
                    <div v-text="$i18n.$t.empire.production.breakdown.basicIncome" />
                    <div v-text="$i18n.$t.empire.production.breakdown.mineProduction" />
                    <div v-text="$i18n.$t.empire.production.breakdown.consumption" />
                    <div v-text="$i18n.$t.empire.production.breakdown.lifeformBuildings" />
                    <div v-text="$i18n.$t.empire.production.breakdown.crawlers" />
                    <div v-text="$i18n.$t.empire.production.breakdown.plasmaTechnology" />
                    <div v-text="$i18n.$t.empire.production.breakdown.items" />
                    <div v-text="$i18n.$t.empire.production.breakdown.geologist" />
                    <div v-text="$i18n.$t.empire.production.breakdown.commandStaff" />
                    <div v-text="$i18n.$t.empire.production.breakdown.playerClass" />
                    <div v-text="$i18n.$t.empire.production.breakdown.allianceClass" />
                    <div v-text="$i18n.$t.empire.production.breakdown.lifeformTechnologies" />
                    <div class="breakdown-sum" v-text="$i18n.$t.common.sum" />
                </div>
            </template>
            <template #cell-metal="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <div
                            :class="{ 'fade-value': value.baseProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.baseProduction), numberFormat)"
                            :fraction="$i18n.$n(value.baseProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.mineProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.mineProduction), numberFormat)"
                            :fraction="$i18n.$n(value.mineProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div class="fade-value" v-text="0" :fraction="$i18n.$n(0, fractionNumberFormat).substring(1)" />
                        <div
                            :class="{ 'fade-value': value.lifeformBuildingsProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.lifeformBuildingsProduction), numberFormat)"
                            :fraction="$i18n.$n(value.lifeformBuildingsProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.crawlerProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.crawlerProduction), numberFormat)"
                            :fraction="$i18n.$n(value.crawlerProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.plasmaTechnologyProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.plasmaTechnologyProduction), numberFormat)"
                            :fraction="$i18n.$n(value.plasmaTechnologyProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.itemProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.itemProduction), numberFormat)"
                            :fraction="$i18n.$n(value.itemProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.geologistProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.geologistProduction), numberFormat)"
                            :fraction="$i18n.$n(value.geologistProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.commandStaffProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.commandStaffProduction), numberFormat)"
                            :fraction="$i18n.$n(value.commandStaffProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.playerClassProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.playerClassProduction), numberFormat)"
                            :fraction="$i18n.$n(value.playerClassProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.allianceClassProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.allianceClassProduction), numberFormat)"
                            :fraction="$i18n.$n(value.allianceClassProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.lifeformTechnologiesProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.lifeformTechnologiesProduction), numberFormat)"
                            :fraction="$i18n.$n(value.lifeformTechnologiesProduction % 1, fractionNumberFormat).substring(1)"
                        />
                    </template>
                    <div
                        class="breakdown-sum"
                        v-text="$i18n.$n(Math.trunc(value.total), numberFormat)"
                        :fraction="$i18n.$n(value.total % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #cell-crystal="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <div
                            :class="{ 'fade-value': value.baseProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.baseProduction), numberFormat)"
                            :fraction="$i18n.$n(value.baseProduction - Math.trunc(value.baseProduction), fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.mineProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.mineProduction), numberFormat)"
                            :fraction="$i18n.$n(value.mineProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div class="fade-value" v-text="0" :fraction="$i18n.$n(0, fractionNumberFormat).substring(1)" />
                        <div
                            :class="{ 'fade-value': value.lifeformBuildingsProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.lifeformBuildingsProduction), numberFormat)"
                            :fraction="$i18n.$n(value.lifeformBuildingsProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.crawlerProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.crawlerProduction), numberFormat)"
                            :fraction="$i18n.$n(value.crawlerProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.plasmaTechnologyProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.plasmaTechnologyProduction), numberFormat)"
                            :fraction="$i18n.$n(value.plasmaTechnologyProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.itemProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.itemProduction), numberFormat)"
                            :fraction="$i18n.$n(value.itemProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.geologistProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.geologistProduction), numberFormat)"
                            :fraction="$i18n.$n(value.geologistProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.commandStaffProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.commandStaffProduction), numberFormat)"
                            :fraction="$i18n.$n(value.commandStaffProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.playerClassProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.playerClassProduction), numberFormat)"
                            :fraction="$i18n.$n(value.playerClassProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.allianceClassProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.allianceClassProduction), numberFormat)"
                            :fraction="$i18n.$n(value.allianceClassProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.lifeformTechnologiesProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.lifeformTechnologiesProduction), numberFormat)"
                            :fraction="$i18n.$n(value.lifeformTechnologiesProduction % 1, fractionNumberFormat).substring(1)"
                        />
                    </template>
                    <div
                        class="breakdown-sum"
                        v-text="$i18n.$n(Math.trunc(value.total), numberFormat)"
                        :fraction="$i18n.$n(value.total % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #cell-deuterium="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <div
                            :class="{ 'fade-value': value.baseProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.baseProduction), numberFormat)"
                            :fraction="$i18n.$n(value.baseProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.mineProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.mineProduction), numberFormat)"
                            :fraction="$i18n.$n(value.mineProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{
                                'fade-value': item.fusionReactorConsumption == 0,
                                'negative-value': -item.fusionReactorConsumption < 0,
                            }"
                            v-text="$i18n.$n(Math.trunc(-item.fusionReactorConsumption), numberFormat)"
                            :fraction="$i18n.$n(item.fusionReactorConsumption % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.lifeformBuildingsProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.lifeformBuildingsProduction), numberFormat)"
                            :fraction="$i18n.$n(value.lifeformBuildingsProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.crawlerProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.crawlerProduction), numberFormat)"
                            :fraction="$i18n.$n(value.crawlerProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.plasmaTechnologyProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.plasmaTechnologyProduction), numberFormat)"
                            :fraction="$i18n.$n(value.plasmaTechnologyProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.itemProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.itemProduction), numberFormat)"
                            :fraction="$i18n.$n(value.itemProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.geologistProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.geologistProduction), numberFormat)"
                            :fraction="$i18n.$n(value.geologistProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.commandStaffProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.commandStaffProduction), numberFormat)"
                            :fraction="$i18n.$n(value.commandStaffProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.playerClassProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.playerClassProduction), numberFormat)"
                            :fraction="$i18n.$n(value.playerClassProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.allianceClassProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.allianceClassProduction), numberFormat)"
                            :fraction="$i18n.$n(value.allianceClassProduction % 1, fractionNumberFormat).substring(1)"
                        />
                        <div
                            :class="{ 'fade-value': value.lifeformTechnologiesProduction == 0 }"
                            v-text="$i18n.$n(Math.trunc(value.lifeformTechnologiesProduction), numberFormat)"
                            :fraction="$i18n.$n(value.lifeformTechnologiesProduction % 1, fractionNumberFormat).substring(1)"
                        />
                    </template>
                    <div
                        class="breakdown-sum"
                        v-text="$i18n.$n(Math.trunc(value.total - item.fusionReactorConsumption), numberFormat)"
                        :fraction="$i18n.$n((value.total - item.fusionReactorConsumption) % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #cell-total="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value == 0 }"
                        v-text="$i18n.$n(Math.trunc(value), numberFormat)"
                        :fraction="$i18n.$n(value % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #cell-totalConverted="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value == 0 }"
                        v-text="$i18n.$n(Math.trunc(value), numberFormat)"
                        :fraction="$i18n.$n(value % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>

            <template #footer-planet="{ value, item }">
                <span v-if="!item.isResourcePackageRow" v-text="value.name" />
                <span v-else class="resource-packages-cell">
                    <o-item :item="ItemHash.resourcePackage_all" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.all" min="0" step="1" />

                    <o-item :item="ItemHash.resourcePackage_metal" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.metal" min="0" step="1" />

                    <o-item :item="ItemHash.resourcePackage_crystal" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.crystal" min="0" step="1" />

                    <o-item :item="ItemHash.resourcePackage_deuterium" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.deuterium" min="0" step="1" />
                </span>
            </template>
            <template #footer-metal="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value.total == 0 }"
                        v-text="$i18n.$n(Math.trunc(value.total), numberFormat)"
                        :fraction="$i18n.$n(value.total % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #footer-crystal="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value.total == 0 }"
                        v-text="$i18n.$n(Math.trunc(value.total), numberFormat)"
                        :fraction="$i18n.$n(value.total % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #footer-deuterium="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value.total == 0 }"
                        v-text="$i18n.$n(Math.trunc(value.total), numberFormat)"
                        :fraction="$i18n.$n(value.total % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #footer-total="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value == 0 }"
                        v-text="$i18n.$n(Math.trunc(value), numberFormat)"
                        :fraction="$i18n.$n(value % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
            <template #footer-totalCnoverted="{ value }">
                <div class="breakdown-list">
                    <div
                        :class="{ 'fade-value': value == 0 }"
                        v-text="$i18n.$n(Math.trunc(value), numberFormat)"
                        :fraction="$i18n.$n(value % 1, fractionNumberFormat).substring(1)"
                    />
                </div>
            </template>
        </grid-table>

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <show-converted-resources-in-cells-settings />
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { FusionReactor } from '@/shared/models/ogame/buildings/FusionReactor';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { ItemHash, ItemHashes } from '@/shared/models/ogame/items/ItemHash';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
    import { CrawlerProductionPercentage } from '@/shared/models/empire/CrawlerProductionPercentage';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
    import { PlanetProductionBreakdown } from '@/shared/models/ogame/resource-production/types';
    import { getMsuOrDsu } from '@/views/stats/models/settings/getMsuOrDsu';
    import { getProductionBreakdowns } from '@stats/models/empire/production';

    interface ProductionItem {
        planet: {
            id: number;
            name: string;
            coordinates: Coordinates;
        };
        metal: PlanetProductionBreakdown;
        crystal: PlanetProductionBreakdown;
        deuterium: PlanetProductionBreakdown;
        fusionReactorConsumption: number;
        total: number;
        totalConverted: number;

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


    @Component({
        components: {
            ShowConvertedResourcesInCellsSettings,
        },
    })
    export default class Resources extends Vue {
        private readonly ItemHash = ItemHash;
        private readonly BuildingType = BuildingType;
        private readonly ShipType = ShipType;
        private showSettings = false;

        private readonly numberFormat: Intl.NumberFormatOptions = {
            maximumFractionDigits: 0,
        };
        private readonly fractionNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };

        private readonly resourcePackageAmounts = {
            all: 0,
            metal: 0,
            crystal: 0,
            deuterium: 0,
        };

        private get conversionModeText() {
            return SettingsDataModule.settings.conversionRates.mode == 'msu'
                ? this.$i18n.$t.common.msu
                : this.$i18n.$t.common.dsu;
        }

        private get columns(): GridTableColumn<keyof ProductionItem | 'breakdown'>[] {
            const result: GridTableColumn<keyof ProductionItem | 'breakdown'>[] = [
                {
                    key: 'planet',
                    label: this.$i18n.$t.empire.planet,
                },
                { key: 'breakdown', size: '200px' },
                { key: 'metal' },
                { key: 'crystal' },
                { key: 'deuterium' },
                {
                    key: 'total',
                    class: 'total-column',
                },
            ];

            if (SettingsDataModule.settings.showCellsWithConvertedResourceUnits) {
                result.push({ key: 'totalConverted' });
            }

            result.push({
                key: 'productionSettings',
                class: 'production-settings-column',
                headerClass: 'production-settings-header-column',
                size: 'max-content',
            });

            return result;
        }

        private get maxItemCount() {
            return Math.max(...this.items.map(i => i.activeItems.length));
        }

        private get productionBreakdowns() {
            return getProductionBreakdowns();
        }

        private get fusionReactorConsumptions(): Record<number, number> {
            const result: Record<number, number> = {};

            this.planets.forEach(planet => {
                const fusionReactorConsumption = FusionReactor.getConsumption(planet.buildings[BuildingType.fusionReactor], {
                    planet: {
                        position: planet.coordinates.position,
                        temperature: planet.maxTemperature,
                    },
                    productionSettings: {
                        metalMine: planet.productionSettings[BuildingType.metalMine],
                        crystalMine: planet.productionSettings[BuildingType.crystalMine],
                        deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                        fusionReactor: planet.productionSettings[BuildingType.fusionReactor],
                    },
                    serverSettings: {
                        economySpeed: ServerSettingsDataModule.serverSettings.speed.economy,
                        crystalBoost: ServerSettingsDataModule.serverSettings.resourceProduction.productionFactorBonus.crystal,
                    },
                }).deuterium;

                result[planet.id] = fusionReactorConsumption;
            });

            return result;
        }

        private get items(): ProductionItem[] {
            const productionBreakdowns = this.productionBreakdowns;
            const fusionReactorConsumptions = this.fusionReactorConsumptions;

            return this.planets.map(planet => {
                const production = {
                    metal: productionBreakdowns.metal.getProductionBreakdown(planet.id),
                    crystal: productionBreakdowns.crystal.getProductionBreakdown(planet.id),
                    deuterium: productionBreakdowns.deuterium.getProductionBreakdown(planet.id),
                };

                return {
                    planet,
                    ...production,
                    fusionReactorConsumption: fusionReactorConsumptions[planet.id],
                    total: production.metal.total + production.crystal.total + production.deuterium.total - fusionReactorConsumptions[planet.id],
                    totalConverted: getMsuOrDsu({
                        metal: production.metal.total,
                        crystal: production.crystal.total,
                        deuterium: production.deuterium.total - fusionReactorConsumptions[planet.id],
                    }),

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
            const productionBreakdowns = this.productionBreakdowns;
            const productionPerHour = productionBreakdowns.getTotal();

            const metalPerHour = productionPerHour.metal;
            const crystalPerHour = productionPerHour.crystal;
            const deuteriumPerHour = productionPerHour.deuterium - Object.values(this.fusionReactorConsumptions).reduce((total, cur) => total + cur, 0);
            const totalPerHour = metalPerHour + crystalPerHour + deuteriumPerHour;
            const totalConvertedPerHour = getMsuOrDsu({
                metal: metalPerHour,
                crystal: crystalPerHour,
                deuterium: deuteriumPerHour,
            });

            const metalPackages = metalPerHour * 24 * (this.resourcePackageAmounts.all + this.resourcePackageAmounts.metal);
            const crystalPackages = crystalPerHour * 24 * (this.resourcePackageAmounts.all + this.resourcePackageAmounts.crystal);
            const deuteriumPackages = deuteriumPerHour * 24 * (this.resourcePackageAmounts.all + this.resourcePackageAmounts.deuterium);

            return [
                {
                    planet: {
                        id: 0,
                        name: this.$i18n.$t.empire.production.averagePerHour,
                        coordinates: null!,
                    },
                    metal: { total: metalPerHour / this.planets.length } as PlanetProductionBreakdown,
                    crystal: { total: crystalPerHour / this.planets.length } as PlanetProductionBreakdown,
                    deuterium: { total: deuteriumPerHour / this.planets.length } as PlanetProductionBreakdown,
                    fusionReactorConsumption: 0,
                    total: totalPerHour / this.planets.length,
                    totalConverted: totalConvertedPerHour / this.planets.length,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    planet: {
                        id: 0,
                        name: this.$i18n.$t.empire.production.totalPerHour,
                        coordinates: null!,
                    },
                    metal: { total: metalPerHour } as PlanetProductionBreakdown,
                    crystal: { total: crystalPerHour } as PlanetProductionBreakdown,
                    deuterium: { total: deuteriumPerHour } as PlanetProductionBreakdown,
                    fusionReactorConsumption: 0,
                    total: totalPerHour,
                    totalConverted: totalConvertedPerHour,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    planet: {
                        id: 0,
                        name: this.$i18n.$t.empire.production.totalPerDay,
                        coordinates: null!,
                    },
                    metal: { total: metalPerHour * 24 } as PlanetProductionBreakdown,
                    crystal: { total: crystalPerHour * 24 } as PlanetProductionBreakdown,
                    deuterium: { total: deuteriumPerHour * 24 } as PlanetProductionBreakdown,
                    fusionReactorConsumption: 0,
                    total: totalPerHour * 24,
                    totalConverted: totalConvertedPerHour * 24,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    planet: {
                        id: 0,
                        name: this.$i18n.$t.empire.production.totalPerWeek,
                        coordinates: null!,
                    },
                    metal: { total: metalPerHour * 24 * 7 } as PlanetProductionBreakdown,
                    crystal: { total: crystalPerHour * 24 * 7 } as PlanetProductionBreakdown,
                    deuterium: { total: deuteriumPerHour * 24 * 7 } as PlanetProductionBreakdown,
                    fusionReactorConsumption: 0,
                    total: totalPerHour * 24 * 7,
                    totalConverted: totalConvertedPerHour * 24 * 7,

                    productionSettings: null!,
                    activeItems: [],
                },
                {
                    isResourcePackageRow: true,
                    planet: {
                        id: 0,
                        name: 'row-for-resource-packages',
                        coordinates: null!,
                    },
                    metal: { total: metalPackages } as PlanetProductionBreakdown,
                    crystal: { total: crystalPackages } as PlanetProductionBreakdown,
                    deuterium: { total: deuteriumPackages } as PlanetProductionBreakdown,
                    fusionReactorConsumption: 0,
                    total: metalPackages + crystalPackages + deuteriumPackages,
                    totalConverted: getMsuOrDsu({
                        metal: metalPackages,
                        crystal: crystalPackages,
                        deuterium: deuteriumPackages,
                    }),

                    productionSettings: null!,
                    activeItems: [],
                },
            ];
        }

        private showBreakdown: Record<number, boolean> = {};

        @Watch('planets', { immediate: true })
        private onPlanetsChanged() {
            this.planets.forEach(planet => {
                if (this.showBreakdown[planet.id] == null) {
                    this.$set(this.showBreakdown, planet.id, false);
                }
            });
        }

        private toggleBreakdown(planetId: number) {
            this.showBreakdown[planetId] = !this.showBreakdown[planetId];
        }

        private get planets(): PlanetData[] {
            return Object.values(EmpireDataModule.empire.planets)
                .filter(planet => !planet.isMoon)
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - EmpireDataModule.empire.planetOrder.indexOf(b.id)) as PlanetData[];
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
    .resources-production-table {
        max-height: 100%;
        overflow: auto;

        &::v-deep {
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
    }

    .planet-info {
        display: grid;
        grid-template-columns: 1fr auto auto;
        justify-items: end;
        column-gap: 8px;
        align-self: start;
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

    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 1fr;
        align-items: start;
        height: 100%;
    }

    .toggle-breakdown {
        transform: scale(1.5);
        cursor: pointer;
    }

    .breakdown-list {
        display: flex;
        flex-direction: column;

        &--expanded .breakdown-sum {
            font-weight: bold;
            border-top: 1px solid rgba(var(--color), 0.5);
            margin-top: 1px;
        }

        .fade-value {
            color: rgba(white, 0.1);

            &[fraction]::after {
                color: rgba(white, 0.1);
            }
        }

        .negative-value {
            color: rgb(209, 21, 21);
        }

        [fraction]::after {
            content: attr(fraction);
            color: rgba(white, 0.333);
            font-size: 0.65em;
        }
    }
</style>