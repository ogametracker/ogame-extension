<template>
    <div class="table-container">
        <div v-text="$i18n.$t.empire.production.messageProduction100" style="grid-column: 1 / span 2" />

        <grid-table :columns="columns" :items="items" :footerItems="footerItems" class="resources-production-table" :style="`--item-count: ${maxItemCount}`">
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
            <template #cell-metal="{ value }">
                {{ $i18n.$n(Math.floor(value), numberFormat) }}
            </template>
            <template #cell-crystal="{ value }">
                {{ $i18n.$n(Math.floor(value), numberFormat) }}
            </template>
            <template #cell-deuterium="{ value }">
                {{ $i18n.$n(Math.floor(value), numberFormat) }}
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

        <floating-menu v-model="showSettings" left>
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <show-msu-cells-settings />
        </floating-menu>
    </div>
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
    import ShowMsuCellsSettings from '@stats/components/settings/ShowMsuCellsSettings.vue';
    import { EmpireProductionBreakdown, EmpireProductionPlanetState } from '@/shared/models/ogame/resource-production/types';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { addCost, Cost } from '@/shared/models/ogame/common/Cost';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { hasCommandStaff } from '@/shared/models/ogame/premium/hasCommandStaff';
    import { LifeformType, LifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { getLifeformTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { CollectorClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, ResourceProductionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { LifeformTechnologyBonusLifeformBuildingsByLifeform, ResourceProductionBonusLifeformBuildingsByLifeform } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { getMetalBaseProduction } from '@/shared/models/ogame/resource-production/getMetalProduction';
    import { getCrystalBaseProduction } from '@/shared/models/ogame/resource-production/getCrystalProduction';
    import { getItemBonus } from '@/shared/models/ogame/resource-production/getItemBonus';

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


    interface EmpireProductionBreakdowns extends Record<ResourceType, EmpireProductionBreakdown> {
        getTotal(): Cost;
    }

    @Component({
        components: {
            ShowMsuCellsSettings,
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
            const result: GridTableColumn<keyof ProductionItem>[] = [
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
            ];

            if (SettingsDataModule.settings.showMsuCells) {
                result.push({ key: 'totalMsu' });
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

        get_planetCollectorClassBonusFactor(planet: PlanetData) {
            return CollectorClassBonusLifeformTechnologies
                .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
                .reduce(
                    (total, tech) => total + tech.getCollectorClassBonus(planet.lifeformTechnologies[tech.type]),
                    0
                );
        }

        get_planetLifeformTechnologyBoost(planet: PlanetData) {
            return LifeformTechnologyBonusLifeformBuildingsByLifeform[planet.activeLifeform]
                .reduce(
                    (total, building) => total + building.getLifeformTechnologyBonus(planet.lifeformBuildings[building.type]),
                    0
                );
        }

        get_planetLifeformTechnologyCrawlerProductionBonusFactor(planet: PlanetData) {
            return CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies
                .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
                .reduce(
                    (total, tech) => total + tech.getCrawlerProductionBonus(planet.lifeformTechnologies[tech.type]),
                    0
                );
        }

        get_planetLifeformBuildingBonusProductionFactor(planet: PlanetData): Cost {
            return ResourceProductionBonusLifeformBuildingsByLifeform[planet.activeLifeform].reduce<Cost>(
                (total, building) => addCost(total, building.getProductionBonus(planet.lifeformBuildings[building.type])),
                { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
            );
        }

        get_planetLifeformTechnologyBonusProductionFactor(planet: PlanetData): Cost {
            return ResourceProductionBonusLifeformTechnologies
                .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
                .reduce<Cost>(
                    (total, tech) => addCost(total, tech.getProductionBonus(planet.lifeformTechnologies[tech.type])),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                );
        }

        private get productionBreakdowns() {
            const empire = EmpireDataModule.empire;
            const plasmaTechLevel = empire.research[ResearchType.plasmaTechnology];

            const serverSettings = ServerSettingsDataModule.serverSettings;
            const productionServerSettings = {
                collectorProductionFactor: serverSettings.playerClasses.collector.productionFactorBonus,
                geologistActiveCrawlerFactorBonus: serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
                collectorCrawlerProductionFactorBonus: serverSettings.playerClasses.collector.crawlers.productionFactorBonus,
                crawlerProductionFactorPerUnit: serverSettings.playerClasses.crawlers.productionBoostFactorPerUnit,
                crawlerMaxProductionFactor: serverSettings.playerClasses.crawlers.maxProductionFactor,
            };

            const empireProductionPlanetStates = {
                metal: {} as Record<number, EmpireProductionPlanetState>,
                crystal: {} as Record<number, EmpireProductionPlanetState>,
                deuterium: {} as Record<number, EmpireProductionPlanetState>,
            };
            const lifeformXpBoost = createRecord(LifeformTypes, lf => lf == LifeformType.none ? 0 : getLifeformTechnologyBonus(empire.lifeformExperience[lf]));

            this.planets.forEach(planet => {
                const levelMetalMine = planet.buildings[BuildingType.metalMine];
                const levelCrystalMine = planet.buildings[BuildingType.crystalMine];
                const levelDeuteriumSynthesizer = planet.buildings[BuildingType.deuteriumSynthesizer];
                const totalMineLevel = levelMetalMine + levelCrystalMine + levelDeuteriumSynthesizer;

                const crawlerConfig = {
                    available: planet.ships[ShipType.crawler],
                    percentage: planet.productionSettings[ShipType.crawler],
                    totalMineLevel,
                };

                const baseProductionConfig = {
                    crawlers: crawlerConfig,
                    lifeformExperienceBoost: lifeformXpBoost[planet.activeLifeform],
                    collectorClassBonusFactor: this.get_planetCollectorClassBonusFactor(planet),
                    lifeformBuildingBonusProductionFactor: this.get_planetLifeformBuildingBonusProductionFactor(planet),
                    lifeformTechnologyBonusProductionFactor: this.get_planetLifeformTechnologyBonusProductionFactor(planet),
                    lifeformTechnologyCrawlerProductionBonusFactor: this.get_planetLifeformTechnologyCrawlerProductionBonusFactor(planet),
                    lifeformTechnologyBoost: this.get_planetLifeformTechnologyBoost(planet),
                };

                const productionBuildingDependencies: ProductionBuildingDependencies = {
                    planet: {
                        position: planet.coordinates.position,
                        temperature: planet.maxTemperature,
                    },
                    serverSettings: {
                        economySpeed: serverSettings.speed.economy,
                        crystalBoost: {
                            default: serverSettings.resourceProduction.productionFactorBonus.crystal.default,
                            pos1: serverSettings.resourceProduction.productionFactorBonus.crystal.pos1,
                            pos2: serverSettings.resourceProduction.productionFactorBonus.crystal.pos2,
                            pos3: serverSettings.resourceProduction.productionFactorBonus.crystal.pos3,
                        },
                    },
                    productionSettings: {
                        metalMine: planet.productionSettings[BuildingType.metalMine],
                        crystalMine: planet.productionSettings[BuildingType.crystalMine],
                        deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                        fusionReactor: 0,
                    },
                };


                empireProductionPlanetStates.metal[planet.id] = {
                    baseProduction: getMetalBaseProduction({
                        planetPosition: planet.coordinates.position,
                        serverEconomySpeed: serverSettings.speed.economy,
                    }),
                    mineProduction: MetalMine.getProduction(levelMetalMine, productionBuildingDependencies),
                    itemBonusProductionFactor: getItemBonus(ResourceType.metal, planet.activeItems),
                    ...baseProductionConfig,
                    lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.metal,
                    lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.metal,
                };

                empireProductionPlanetStates.crystal[planet.id] = {
                    baseProduction: getCrystalBaseProduction({
                        planetPosition: planet.coordinates.position,
                        serverEconomySpeed: serverSettings.speed.economy,
                        serverPositionBoost: serverSettings.resourceProduction.productionFactorBonus.crystal,
                    }),
                    mineProduction: CrystalMine.getProduction(levelCrystalMine, productionBuildingDependencies),
                    itemBonusProductionFactor: getItemBonus(ResourceType.crystal, planet.activeItems),
                    ...baseProductionConfig,
                    lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.crystal,
                    lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.crystal,
                };

                empireProductionPlanetStates.deuterium[planet.id] = {
                    baseProduction: 0,
                    mineProduction: DeuteriumSynthesizer.getProduction(levelDeuteriumSynthesizer, productionBuildingDependencies),
                    itemBonusProductionFactor: getItemBonus(ResourceType.deuterium, planet.activeItems),
                    ...baseProductionConfig,
                    lifeformBuildingBonusProductionFactor: baseProductionConfig.lifeformBuildingBonusProductionFactor.deuterium,
                    lifeformTechnologyBonusProductionFactor: baseProductionConfig.lifeformTechnologyBonusProductionFactor.deuterium,
                };
            });

            const empireProductionBreakdowns: EmpireProductionBreakdowns = {
                metal: new EmpireProductionBreakdown(
                    ResourceType.metal,
                    plasmaTechLevel,
                    empire.playerClass,
                    empire.allianceClass,
                    empire.officers.geologist,
                    hasCommandStaff(empire.officers),
                    productionServerSettings,
                    empireProductionPlanetStates.metal,
                ),
                crystal: new EmpireProductionBreakdown(
                    ResourceType.crystal,
                    plasmaTechLevel,
                    empire.playerClass,
                    empire.allianceClass,
                    empire.officers.geologist,
                    hasCommandStaff(empire.officers),
                    productionServerSettings,
                    empireProductionPlanetStates.crystal,
                ),
                deuterium: new EmpireProductionBreakdown(
                    ResourceType.deuterium,
                    plasmaTechLevel,
                    empire.playerClass,
                    empire.allianceClass,
                    empire.officers.geologist,
                    hasCommandStaff(empire.officers),
                    productionServerSettings,
                    empireProductionPlanetStates.deuterium,
                ),

                getTotal(): Cost {
                    return {
                        metal: this.metal.getTotal(),
                        crystal: this.crystal.getTotal(),
                        deuterium: this.deuterium.getTotal(),
                        energy: 0,
                    };
                },
            };

            return empireProductionBreakdowns;
        }

        private get items(): ProductionItem[] {
            const productionBreakdowns = this.productionBreakdowns;

            return this.planets.map(planet => {
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

                const production = {
                    metal: productionBreakdowns.metal.getPlanetProduction(planet.id),
                    crystal: productionBreakdowns.crystal.getPlanetProduction(planet.id),
                    deuterium: productionBreakdowns.deuterium.getPlanetProduction(planet.id) - fusionReactorConsumption,
                };

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
            const productionBreakdowns = this.productionBreakdowns;
            const productionPerHour = productionBreakdowns.getTotal();

            const metalPerHour = productionPerHour.metal;
            const crystalPerHour = productionPerHour.crystal;
            const deuteriumPerHour = productionPerHour.deuterium;
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
                    metal: metalPerHour / this.planets.length,
                    crystal: crystalPerHour / this.planets.length,
                    deuterium: deuteriumPerHour / this.planets.length,
                    total: totalPerHour / this.planets.length,
                    totalMsu: totalMsuPerHour / this.planets.length,

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

    .table-container {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 1fr;
        align-items: start;
        height: 100%;
    }
</style>