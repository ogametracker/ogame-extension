<template>
    <div class="table-container">
        <div style="grid-column: 1 / span 2; display: grid; grid-template-rows: auto 1fr; max-height: 100%; overflow: hidden">
            <div>
                <button @click="showProductionSettings = !showProductionSettings">
                    <span class="mdi mdi-cogs" />
                    <span class="mdi mdi-menu-down" v-if="!showSettings" />
                    <span class="mdi mdi-menu-up" v-else />

                    <span v-if="!showProductionSettings" v-text="$i18n.$t.extension.empire.production.settings.header" />
                    <span v-else v-text="$i18n.$t.extension.empire.production.settings.applyAndClose" />
                </button>
                <button @click="resetProductionSettings()" class="ml-2">
                    <span class="mdi mdi-refresh" />
                    <span v-text="$i18n.$t.extension.empire.production.settings.reset" />
                </button>
            </div>

            <div v-show="showProductionSettings" class="mt-2" style="overflow: auto">
                <div style="display: flex; gap: 8px; flex-wrap: wrap">
                    <amortization-player-settings-inputs
                        v-model="playerSettings"
                        :lifeform-levels="playerSettings.lifeformLevels"
                        production-mode
                        style="height: max-content; margin-top: 44px"
                    />

                    <amortization-planet-settings-inputs
                        v-for="planetSetting in planetSettings"
                        :key="planetSetting.id"
                        :value="planetSetting"
                        :planetData="empire.planets[planetSetting.id]"
                        production-mode
                    />
                </div>
            </div>
        </div>

        <div v-text="$i18n.$t.extension.empire.production.messageProduction100" style="grid-column: 1 / span 2" v-show="!showProductionSettings" />
        <grid-table
            :columns="columns"
            :items="items"
            sticky="100%"
            :footerItems="footerItems"
            class="resources-production-table"
            :style="`--item-count: ${maxItemCount}`"
            v-show="!showProductionSettings"
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
            <template #header-total> {{ $i18n.$t.extension.common.resourceUnits }} </template>
            <template #header-totalConverted>
                {{ `${$i18n.$t.extension.common.resourceUnits} (${conversionModeText})` }}
            </template>

            <template #header-productionSettings>
                <div class="production-settings-mini-table">
                    <span class="header" v-text="$i18n.$t.extension.empire.production.activeProductionSettings" />
                    <o-building :building="BuildingType.metalMine" />
                    <o-building :building="BuildingType.crystalMine" />
                    <o-building :building="BuildingType.deuteriumSynthesizer" />
                    <o-building :building="BuildingType.solarPlant" />
                    <o-building :building="BuildingType.fusionReactor" />
                    <o-ship :ship="ShipType.solarSatellite" />
                    <o-ship :ship="ShipType.crawler" />
                    <span style="grid-column: auto / span 4" v-text="$i18n.$t.extension.empire.production.items" />
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
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.basicIncome" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.mineProduction" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.consumption" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.lifeformBuildings" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.crawlers" />
                    <div v-text="$i18n.$t.ogame.research[ResearchType.plasmaTechnology]" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.items" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.geologist" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.commandStaff" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.playerClass" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.allianceClass" />
                    <div v-text="$i18n.$t.extension.empire.production.breakdown.lifeformTechnologies" />
                    <div class="breakdown-sum" v-text="$i18n.$t.extension.common.sum" />
                </div>
            </template>
            <template #cell-metal="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <decimal-number :value="value.baseProduction" />
                        <decimal-number :value="value.mineProduction" />
                        <decimal-number :value="0" />
                        <decimal-number :value="value.lifeformBuildingsProduction" />
                        <decimal-number :value="value.crawlerProduction" />
                        <decimal-number :value="value.plasmaTechnologyProduction" />
                        <decimal-number :value="value.itemProduction" />
                        <decimal-number :value="value.geologistProduction" />
                        <decimal-number :value="value.commandStaffProduction" />
                        <decimal-number :value="value.playerClassProduction" />
                        <decimal-number :value="value.allianceClassProduction" />
                        <decimal-number :value="value.lifeformTechnologiesProduction" />
                    </template>

                    <decimal-number class="breakdown-sum" :value="value.total" />
                </div>
            </template>
            <template #cell-crystal="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <decimal-number :value="value.baseProduction" />
                        <decimal-number :value="value.mineProduction" />
                        <decimal-number :value="0" />
                        <decimal-number :value="value.lifeformBuildingsProduction" />
                        <decimal-number :value="value.crawlerProduction" />
                        <decimal-number :value="value.plasmaTechnologyProduction" />
                        <decimal-number :value="value.itemProduction" />
                        <decimal-number :value="value.geologistProduction" />
                        <decimal-number :value="value.commandStaffProduction" />
                        <decimal-number :value="value.playerClassProduction" />
                        <decimal-number :value="value.allianceClassProduction" />
                        <decimal-number :value="value.lifeformTechnologiesProduction" />
                    </template>

                    <decimal-number class="breakdown-sum" :value="value.total" />
                </div>
            </template>
            <template #cell-deuterium="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <decimal-number :value="value.baseProduction" />
                        <decimal-number :value="value.mineProduction" />
                        <decimal-number :class="{ 'negative-value': -item.fusionReactorConsumption < 0 }" :value="-item.fusionReactorConsumption" />
                        <decimal-number :value="value.lifeformBuildingsProduction" />
                        <decimal-number :value="value.crawlerProduction" />
                        <decimal-number :value="value.plasmaTechnologyProduction" />
                        <decimal-number :value="value.itemProduction" />
                        <decimal-number :value="value.geologistProduction" />
                        <decimal-number :value="value.commandStaffProduction" />
                        <decimal-number :value="value.playerClassProduction" />
                        <decimal-number :value="value.allianceClassProduction" />
                        <decimal-number :value="value.lifeformTechnologiesProduction" />
                    </template>

                    <decimal-number class="breakdown-sum" :value="value.total - item.fusionReactorConsumption" />
                </div>
            </template>
            <template #cell-total="{ value }">
                <div class="breakdown-list">
                    <decimal-number :value="value" />
                </div>
            </template>
            <template #cell-totalConverted="{ value }">
                <div class="breakdown-list">
                    <decimal-number :value="value" />
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
                    <decimal-number :value="value.total" />
                </div>
            </template>
            <template #footer-crystal="{ value }">
                <div class="breakdown-list">
                    <decimal-number :value="value.total" />
                </div>
            </template>
            <template #footer-deuterium="{ value }">
                <div class="breakdown-list">
                    <decimal-number :value="value.total" />
                </div>
            </template>
            <template #footer-total="{ value }">
                <div class="breakdown-list">
                    <decimal-number :value="value" />
                </div>
            </template>
            <template #footer-totalConverted="{ value }">
                <div class="breakdown-list">
                    <decimal-number :value="value" />
                </div>
            </template>
        </grid-table>

        <floating-menu v-model="showSettings" left v-show="!showProductionSettings">
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
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { LocalPlayerData } from '@/shared/models/empire/LocalPlayerData';
    import { createRecord } from '@/shared/utils/createRecord';
    import { ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { AmortizationPlayerSettings } from '@/shared/models/empire/amortization/AmortizationPlayerSettings';
    import AmortizationPlanetSettingsInputs from '@stats/components/empire/amortization/AmortizationPlanetSettingsInputs.vue';
    import AmortizationPlayerSettingsInputs from '@stats/components/empire/amortization/AmortizationPlayerSettingsInputs.vue';
    import { AmortizationPlanetSettings } from '@/shared/models/empire/amortization/AmortizationPlanetSettings';
    import { _throw } from '@/shared/utils/_throw';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { getLifeformExperienceNeededForLevel, getLifeformLevel } from '@/shared/models/ogame/lifeforms/experience';

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
            AmortizationPlanetSettingsInputs,
            AmortizationPlayerSettingsInputs,
        },
    })
    export default class Resources extends Vue {
        private readonly ItemHash = ItemHash;
        private readonly BuildingType = BuildingType;
        private readonly ShipType = ShipType;
        private readonly ResearchType = ResearchType;

        private showSettings = false;

        private showProductionSettings = false;
        private playerSettings: AmortizationPlayerSettings = {
            optimizeForResources: [],
            officers: {
                admiral: false,
                commander: false,
                engineer: false,
                geologist: false,
                technocrat: false,
            },
            playerClass: PlayerClass.none,
            allianceClass: AllianceClass.none,
            levelPlasmaTechnology: 0,
            levelAstrophysics: 0,
            numberOfUnusedRaidColonySlots: 0,
            lifeformLevels: createRecord(ValidLifeformTypes, 0),
        };
        private planetSettings: AmortizationPlanetSettings[] = [];

        private mounted() {
            this.resetProductionSettings();
        }

        private resetProductionSettings() {
            const empire = EmpireDataModule.empire;

            this.playerSettings = {
                officers: { ...empire.officers },
                playerClass: empire.playerClass,
                allianceClass: empire.allianceClass,
                levelPlasmaTechnology: empire.research[ResearchType.plasmaTechnology],
                lifeformLevels: createRecord(ValidLifeformTypes, lf => getLifeformLevel(empire.lifeformExperience[lf])),

                // don't matter
                optimizeForResources: [],
                levelAstrophysics: 0,
                numberOfUnusedRaidColonySlots: 0,
            };
            this.planetSettings = this.getPlanetSettings();
        }

        private get empire(): LocalPlayerData {
            const empire = JSON.parse(JSON.stringify(EmpireDataModule.empire)) as LocalPlayerData;
            empire.playerClass = this.playerSettings.playerClass;
            empire.allianceClass = this.playerSettings.allianceClass;
            empire.officers = this.playerSettings.officers;
            empire.research[ResearchType.plasmaTechnology] = this.playerSettings.levelPlasmaTechnology;

            this.planetSettings.forEach(ps => {
                const planet = empire.planets[ps.id] as PlanetData;
                planet.maxTemperature = ps.maxTemperature;
                planet.coordinates.position = ps.position;
                planet.activeItems = createRecord(ps.activeItems, 'permanent');
                planet.buildings[BuildingType.metalMine] = ps.mines?.metalMine ?? _throw('no metal mine level');
                planet.buildings[BuildingType.crystalMine] = ps.mines?.crystalMine ?? _throw('no crystal mine level');
                planet.buildings[BuildingType.deuteriumSynthesizer] = ps.mines?.deuteriumSynthesizer ?? _throw('no deuterium synthesizer level');
                planet.ships[ShipType.crawler] = ps.crawlers.max ? 10_000 : ps.crawlers.count;
                planet.productionSettings[ShipType.crawler] = ps.crawlers.percentage;
                planet.activeLifeform = ps.lifeform;
                planet.activeLifeformTechnologies = ps.activeLifeformTechnologies;
                planet.lifeformTechnologies = {
                    ...planet.lifeformTechnologies,
                    ...ps.lifeformTechnologyLevels,
                };
                planet.lifeformBuildings = {
                    ...planet.lifeformBuildings,
                    ...ps.lifeformBuildingLevels,
                };
            });

            return empire;
        }

        private readonly resourcePackageAmounts = {
            all: 0,
            metal: 0,
            crystal: 0,
            deuterium: 0,
        };

        private get conversionModeText() {
            return SettingsDataModule.settings.conversionRates.mode == 'msu'
                ? this.$i18n.$t.extension.common.msu
                : this.$i18n.$t.extension.common.dsu;
        }

        private getPlanetSettings(): AmortizationPlanetSettings[] {
            return this.planets.map<AmortizationPlanetSettings>(planet => ({
                include: true,
                ignoreEmptyLifeformTechnologySlots: false,

                id: planet.id,
                name: planet.name,
                position: planet.coordinates.position,
                maxTemperature: planet.maxTemperature,
                activeItems: Object.keys(planet.activeItems) as ItemHash[],
                lifeform: planet.activeLifeform,
                activeLifeformTechnologies: [...planet.activeLifeformTechnologies],
                lifeformBuildingLevels: { ...planet.lifeformBuildings },
                lifeformTechnologyLevels: { ...planet.lifeformTechnologies },
                mines: {
                    metalMine: planet.buildings[BuildingType.metalMine],
                    crystalMine: planet.buildings[BuildingType.crystalMine],
                    deuteriumSynthesizer: planet.buildings[BuildingType.deuteriumSynthesizer],
                },
                crawlers: {
                    percentage: planet.productionSettings[ShipType.crawler],
                    count: planet.ships[ShipType.crawler],
                    max: false,
                },
            }));
        }

        private get columns(): GridTableColumn<keyof ProductionItem | 'breakdown'>[] {
            const result: GridTableColumn<keyof ProductionItem | 'breakdown'>[] = [
                {
                    key: 'planet',
                    label: this.$i18n.$t.extension.empire.planet,
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
            const lifeformExperience = createRecord(
                ValidLifeformTypes,
                lf => getLifeformExperienceNeededForLevel(this.playerSettings.lifeformLevels[lf]),
            );

            return getProductionBreakdowns(this.empire, lifeformExperience);
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
            if(this.planetSettings.length == 0) {
                return [];
            }

            const productionBreakdowns = this.productionBreakdowns;
            const fusionReactorConsumptions = this.fusionReactorConsumptions;

            return this.planets.map<ProductionItem>(planet => {
                const production = {
                    metal: productionBreakdowns.metal.getProductionBreakdown(planet.id),
                    crystal: productionBreakdowns.crystal.getProductionBreakdown(planet.id),
                    deuterium: productionBreakdowns.deuterium.getProductionBreakdown(planet.id),
                };
                
                const settings = this.planetSettings.find(p => p.id == planet.id) ?? _throw('no planet settings found');

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
                        metalMine:  planet.productionSettings[BuildingType.metalMine],
                        crystalMine: planet.productionSettings[BuildingType.crystalMine],
                        deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                        solarPlant: planet.productionSettings[BuildingType.solarPlant],
                        fusionReactor: planet.productionSettings[BuildingType.fusionReactor],

                        solarSatellite: planet.productionSettings[ShipType.solarSatellite],
                        crawler: settings.crawlers.percentage,
                    },

                    activeItems: settings.activeItems,
                };
            });
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
                        name: this.$i18n.$t.extension.empire.production.averagePerHour,
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
                        name: this.$i18n.$t.extension.empire.production.totalPerHour,
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
                        name: this.$i18n.$t.extension.empire.production.totalPerDay,
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
                        name: this.$i18n.$t.extension.empire.production.totalPerWeek,
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
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - this.empire.planetOrder.indexOf(b.id)) as PlanetData[];
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
        grid-template-rows: auto auto 1fr;
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

        .negative-value {
            color: rgb(209, 21, 21);
        }
    }
</style>