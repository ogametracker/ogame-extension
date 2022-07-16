<template>
    <div class="amortization">
        <div class="amortization-container">
            <div class="amortization-settings">
                <button @click="toggleSettings()">
                    <span class="mdi mdi-cog" />
                    <span class="mdi mdi-menu-down" v-if="!showSettings" />
                    <span class="mdi mdi-menu-up" v-else />

                    <span v-if="!showSettings" v-text="$i18n.$t.empire.amortization.settings.header" />
                    <span v-else v-text="$i18n.$t.empire.amortization.settings.applyAndClose" />
                </button>

                <div v-show="showSettings" class="amortization-settings-container">
                    <div class="flex-settings">
                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.playerSettings.header" />
                            <amortization-player-settings-inputs v-model="playerSettings" />
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.astrophysicsSettings.header" />
                            <div class="astrophysics-settings">
                                <checkbox
                                    v-model="astrophysicsSettings.show"
                                    :label="$i18n.$t.empire.amortization.settings.astrophysicsSettings.showAstrophysics"
                                />

                                <amortization-planet-settings-inputs v-model="astrophysicsSettings.planet" />
                            </div>
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.plasmatechSettings.header" />
                            <div class="plasma-tech-settings">
                                <checkbox v-model="showPlasmaTechnology" :label="$i18n.$t.empire.amortization.settings.plasmatechSettings.showPlasmatech" />
                            </div>
                        </div>

                        <div>
                            <h3 v-text="$i18n.$t.empire.amortization.settings.planetSettings.header" />
                            <div style="display: flex; gap: 8px; flex-wrap: wrap">
                                <amortization-planet-settings-inputs
                                    v-for="planetSetting in planetSettingsSorted"
                                    :key="planetSetting.id"
                                    v-model="planetSettings[planetSetting.id]"
                                    toggleable
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="amortization-table" v-if="!showSettings">
                <grid-table
                    :items="items"
                    :columns="columns"
                    :footerItems="footerItems"
                    sticky="100%"
                    sticky-footer
                    @scroll="onTableScroll($event)"
                    :cellClassProvider="cellClassProvider"
                >
                    <template #header-checkbox>
                        <checkbox :value="selectedItemIndizes.length == items.length" @input="toggleItemSelection()" />
                    </template>

                    <template #header-cost>
                        <div class="cost-grid">
                            <span v-text="$i18n.$t.empire.amortization.table.cost" style="grid-column: 2" />
                            <o-resource resource="metal" style="grid-column: 1" />
                            <o-resource resource="crystal" />
                            <o-resource resource="deuterium" />
                        </div>
                    </template>

                    <template #cell-checkbox="{ index }">
                        <checkbox :value="selectedItemIndizes.includes(index)" @input="toggleItemSelection(index)" />
                    </template>
                    <template #cell-what="{ item }">
                        <div
                            v-if="item.type == 'mine' || item.type == 'lifeform-building' || item.type == 'lifeform-technology'"
                            class="what-cell"
                            :class="`what-cell--${item.type}`"
                        >
                            <span v-if="item.planetId > 0" class="planet">
                                <span v-text="empire.planets[item.planetId].name" />
                                <span v-text="formatCoordinates(empire.planets[item.planetId].coordinates)" />
                            </span>
                            <span v-else class="planet">
                                <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                                <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                            </span>

                            <template v-if="item.type == 'mine'">
                                <o-building :building="item.mine" size="36px" />
                                <span class="name-and-level">
                                    <span v-text="buildableTranslations[item.mine]" />
                                    <span v-text="item.level" />
                                </span>
                            </template>
                            <template v-else-if="item.type == 'lifeform-building'">
                                <o-lifeform-building :building="item.building" size="36px" />
                                <span class="name-and-level">
                                    <span v-text="buildableTranslations[item.building]" />
                                    <span v-text="item.level" />
                                </span>
                            </template>
                            <template v-else-if="item.type == 'lifeform-technology'">
                                <o-lifeform-technology :technology="item.technology" size="36px" />
                                <span class="name-and-level">
                                    <span v-text="buildableTranslations[item.technology]" />
                                    <span v-text="item.level" />
                                </span>
                            </template>
                            <span v-else v-text="'??? contact developer'" />
                        </div>
                        <div v-else-if="item.type == 'plasma-technology'" class="what-cell what-cell--plasma-technology">
                            <span />
                            <o-research :research="ResearchType.plasmaTechnology" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[item.type]" />
                                <span v-text="item.level" />
                            </span>
                        </div>
                        <div v-else-if="item.type == 'astrophysics-colony'" class="what-cell what-cell--colony">
                            <span class="planet">
                                <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`" />
                                <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                            </span>

                            <o-research :research="ResearchType.astrophysics" :disabled="item.levels.length == 0" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations['astrophysics-colony']" />

                                <span v-if="item.levels.length == 0" v-text="'-'" />
                                <span v-else-if="item.levels.length == 1" v-text="item.levels[0]" />
                                <span v-else v-text="`${item.levels[0]} + ${item.levels[1]}`" />
                            </span>

                            <o-building :building="BuildingType.metalMine" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[BuildingType.metalMine]" />
                                <span v-text="`1 - ${item.mineLevels.metalMine}`" />
                            </span>

                            <o-building :building="BuildingType.crystalMine" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[BuildingType.crystalMine]" />
                                <span v-text="`1 - ${item.mineLevels.crystalMine}`" />
                            </span>

                            <o-building :building="BuildingType.deuteriumSynthesizer" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[BuildingType.deuteriumSynthesizer]" />
                                <span v-text="`1 - ${item.mineLevels.deuteriumSynthesizer}`" />
                            </span>
                        </div>
                        <div v-else v-text="'??? contact developer'" />
                    </template>

                    <template #cell-cost="{ value }">
                        <div class="cost-grid">
                            <span v-text="$i18n.$n(value.metal)" :class="{ zero: value.metal == 0 }" />
                            <span v-text="$i18n.$n(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                            <span v-text="$i18n.$n(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
                        </div>
                    </template>
                    <template #cell-costMsu="{ value }">
                        <span v-text="$i18n.$n(value)" />
                    </template>

                    <template #cell-productionDelta="{ value }">
                        <span v-text="$i18n.$n(Math.max(value.metal, value.crystal, value.deuterium))" />
                    </template>
                    <template #cell-productionDeltaMsu="{ value }">
                        <span v-text="$i18n.$n(value)" />
                    </template>

                    <template #cell-timeInHours="{ value }">
                        <span v-text="$i18n.$timespan(value * 60 * 60)" />
                    </template>

                    <template #footer-cost="{ value }">
                        <div class="cost-grid">
                            <span v-text="$i18n.$n(value.metal)" :class="{ zero: value.metal == 0 }" />
                            <span v-text="$i18n.$n(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                            <span v-text="$i18n.$n(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
                        </div>
                    </template>
                    <template #footer-costMsu="{ value }">
                        <span v-text="$i18n.$n(value)" :class="{ zero: value == 0 }" />
                    </template>
                    <template #footer-productionDelta />
                    <template #footer-productionDeltaMsu />
                    <template #footer-timeInHours />
                </grid-table>
            </div>
        </div>

        <floating-menu v-model="showSettingsMenu" left>
            <template #activator>
                <button @click="showSettingsMenu = !showSettingsMenu">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <show-msu-cells-settings>
                <div class="msu-settings-amortization-info">
                    <span class="mdi mdi-alert" />
                    <span v-text="$i18n.$t.settings.showMsuInTables.infoAmortization" />
                </div>
            </show-msu-cells-settings>
        </floating-menu>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { BuildingType, BuildingTypes } from '@/shared/models/ogame/buildings/BuildingType';
    import { CrystalMine } from '@/shared/models/ogame/buildings/CrystalMine';
    import { DeuteriumSynthesizer } from '@/shared/models/ogame/buildings/DeuteriumSynthesizer';
    import { MetalMine } from '@/shared/models/ogame/buildings/MetalMine';
    import { ProductionBuilding, ProductionBuildingDependencies } from '@/shared/models/ogame/buildings/ProductionBuilding';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { addCost, Cost, subCost } from '@/shared/models/ogame/common/Cost';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { ShipType, ShipTypes } from '@/shared/models/ogame/ships/ShipType';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import AmortizationPlanetSettingsInputs, { AmortizationPlanetSettings } from '../../components/empire/production/amortization/AmortizationPlanetSettingsInputs.vue';
    import AmortizationPlayerSettingsInputs, { AmortizationPlayerSettings } from '../../components/empire/production/amortization/AmortizationPlayerSettingsInputs.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';
    import { Astrophysics } from '@/shared/models/ogame/research/Astrophysics';
    import { PlasmaTechnology } from '@/shared/models/ogame/research/PlasmaTechnology';
    import { GridTableColumn, GridTableScrollEvent } from '../../components/common/GridTable.vue';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { ServerSettingsDataModule } from '../../data/ServerSettingsDataModule';
    import ShowMsuCellsSettings from '@stats/components/settings/ShowMsuCellsSettings.vue';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologyType, LifeformTechnologyTypes, LifeformTechnologyTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { DefenseCount } from '@/shared/models/empire/DefenseCount';
    import { ProductionSettings } from '@/shared/models/empire/ProductionSettings';
    import { LifeformBuildingsByType, LifeformTechnologyBonusLifeformBuildings, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { _throw } from '@/shared/utils/_throw';
    import { CollectorClassBonusLifeformTechnologies, CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies, LifeformTechnologiesByType, ResourceProductionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';

    interface AmortizationAstrophysicsSettings {
        show: boolean;
        planet: AmortizationPlanetSettings;
    }

    type MineBuildingType = BuildingType.metalMine | BuildingType.crystalMine | BuildingType.deuteriumSynthesizer;

    interface BaseAmortizationItem {
        cost: Cost;
        costMsu: number;
        productionDelta: Cost;
        productionDeltaMsu: number;
        timeInHours: number;
    }


    interface MineAmortizationItem extends BaseAmortizationItem {
        type: 'mine';
        planetId: number;
        mine: MineBuildingType;
        level: number;
    }

    interface PlasmaTechnologyAmortizationItem extends BaseAmortizationItem {
        type: 'plasma-technology';
        level: number;
    }

    interface AstrophysicsAmortizationItem extends BaseAmortizationItem {
        type: 'astrophysics-and-colony';
        levels: number[];
        newPlanetId: number;

        builtLevels: AmortizationCalculationData;
    }

    interface LifeformBuildingAmortizationItem extends BaseAmortizationItem {
        type: 'lifeform-building';
        planetId: number;
        building: LifeformBuildingType;
        level: number;
    }

    interface LifeformTechnologyAmortizationItem extends BaseAmortizationItem {
        type: 'lifeform-technology';
        planetId: number;
        technology: LifeformTechnologyType;
        level: number;
    }

    type AmortizationItem =
        | MineAmortizationItem
        | PlasmaTechnologyAmortizationItem
        | AstrophysicsAmortizationItem
        | LifeformBuildingAmortizationItem
        | LifeformTechnologyAmortizationItem;


    interface MineLevels {
        [BuildingType.metalMine]: number;
        [BuildingType.crystalMine]: number;
        [BuildingType.deuteriumSynthesizer]: number;
    }

    interface AmortizationGenerationSettings {
        player: AmortizationPlayerSettings;
        planets: Record<number, AmortizationPlanetSettings>;
        astrophysics: AmortizationAstrophysicsSettings;
    }


    interface AmortizationCalculationData {
        mineLevels: MineLevels;
        lifeformBuildingLevels: Record<LifeformBuildingType, number>;
        lifeformTechnologyLevels: Record<LifeformTechnologyType, number>;
    }

    @Component({
        components: {
            AmortizationPlanetSettingsInputs,
            AmortizationPlayerSettingsInputs,
            ShowMsuCellsSettings,
        },
    })
    export default class Amortization extends Vue {
        private showSettingsMenu = false;
        private readonly BuildingType = BuildingType;
        private readonly ResearchType = ResearchType;

        private readonly applicableLifeformBuildingTypes = [
            ...ResourceProductionBonusLifeformBuildings,
            ...LifeformTechnologyBonusLifeformBuildings,
        ].map(b => b.type);

        private getApplicableLifeformBuildingTypesByLifeform(lifeform: LifeformType): LifeformBuildingType[] {
            return this.applicableLifeformBuildingTypes.filter(type => LifeformBuildingTypesByLifeform[lifeform].includes(type));
        }

        private readonly applicableLifeformTechnologyTypes = [
            ...ResourceProductionBonusLifeformTechnologies,
            ...CollectorClassBonusLifeformTechnologies,
            ...CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies,
        ].map(tech => tech.type);

        private readonly mineBuildingTypes: MineBuildingType[] = [BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer];
        private readonly minesByType: Record<MineBuildingType, ProductionBuilding> = {
            [BuildingType.metalMine]: MetalMine,
            [BuildingType.crystalMine]: CrystalMine,
            [BuildingType.deuteriumSynthesizer]: DeuteriumSynthesizer,
        };

        /**********************************/
        /* START amortization calculation */
        /**********************************/
        private playerSettings: AmortizationPlayerSettings = {
            msuConversionRates: {
                crystal: 2,
                deuterium: 3,
            },
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
        };
        private planetSettings: Record<number, AmortizationPlanetSettings> = {};
        private astrophysicsSettings: AmortizationAstrophysicsSettings = {
            show: true,
            planet: {
                show: true,
                id: -1,
                name: '',
                position: 0,
                maxTemperature: 0,
                activeItems: [],
                crawlers: {
                    enabled: false,
                    overload: false,
                    count: 0,
                    max: false,
                },
                lifeform: LifeformType.rocktal,
                activeLifeformTechnologies: [...LifeformTechnologyTypesByLifeform[LifeformType.rocktal]],
            },
        };
        private showPlasmaTechnology = true;

        private showSettings = true;

        private readonly empire = EmpireDataModule.empire;
        private amortizationItems: AmortizationItem[] = [];
        private generator: Generator<AmortizationItem, void, unknown> = null!;
        private selectedItemIndizes: number[] = [];
        private generationSettings: AmortizationGenerationSettings = this.getAmortizationGenerationSettings();

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private get planetSettingsSorted(): AmortizationPlanetSettings[] {
            return Object.values(this.planetSettings)
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - EmpireDataModule.empire.planetOrder.indexOf(b.id));
        }

        @Watch('astrophysicsSettings.planet.position')
        private onAstrophysicsSettingsPlanetPositionChanged(newPosition: number, oldPosition: number) {
            this.astrophysicsSettings.planet.maxTemperature = this.getAverageTemperature(newPosition);
        }

        private mounted() {
            this.initSettings();
        }

        private toggleSettings() {
            if (!this.showSettings) {
                this.showSettings = true;
            } else {
                this.showSettings = false;
                this.initItems();
            }
        }

        private initItems(): void {
            this.generationSettings = this.getAmortizationGenerationSettings();
            this.generator = this.generateAmortizationItems(this.generationSettings);
            this.amortizationItems = [];
        }

        private getAmortizationGenerationSettings(): AmortizationGenerationSettings {
            const settings: AmortizationGenerationSettings = {
                player: {
                    ...this.playerSettings,
                    msuConversionRates: SettingsDataModule.settings.msuConversionRates,
                },
                planets: this.planetSettings,
                astrophysics: this.astrophysicsSettings,
            };

            return JSON.parse(JSON.stringify(settings));
        }

        private insertNextAmortizationItems(count: number): void {
            while (count > 0) {
                const next = this.generator.next();

                if (next.done) {
                    break;
                }

                this.amortizationItems.push(next.value);
                count--;
            }
        }

        private initSettings() {
            const empire = this.empire;

            this.playerSettings = {
                msuConversionRates: this.msuConversionRates,
                officers: { ...empire.officers },
                playerClass: empire.playerClass,
                allianceClass: empire.allianceClass,
                levelPlasmaTechnology: empire.research[ResearchType.plasmaTechnology],
                levelAstrophysics: empire.research[ResearchType.astrophysics],
            };

            this.planetSettings = (Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[])
                .reduce((acc, planet) => {
                    const settings: AmortizationPlanetSettings = {
                        show: true,
                        id: planet.id,
                        name: planet.name,
                        maxTemperature: planet.maxTemperature,
                        coordinates: planet.coordinates,
                        position: planet.coordinates.position,
                        mines: {
                            metalMine: planet.buildings[BuildingType.metalMine],
                            crystalMine: planet.buildings[BuildingType.crystalMine],
                            deuteriumSynthesizer: planet.buildings[BuildingType.deuteriumSynthesizer],
                        },
                        activeItems: Object.keys(planet.activeItems) as ItemHash[],
                        crawlers: {
                            enabled: true,
                            overload: empire.playerClass == PlayerClass.collector && ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
                            count: planet.ships[ShipType.crawler],
                            max: empire.playerClass == PlayerClass.collector,
                        },
                        lifeform: planet.activeLifeform,
                        activeLifeformTechnologies: [...planet.activeLifeformTechnologies],
                        lifeformTechnologyLevels: { ...planet.lifeformTechnologies },
                        lifeformBuildingLevels: { ...planet.lifeformBuildings },
                    };
                    acc[planet.id] = settings;
                    return acc;
                }, {} as Record<number, AmortizationPlanetSettings>);

            this.astrophysicsSettings = {
                show: true,
                planet: {
                    show: true,
                    id: -1,
                    name: this.$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony,
                    position: 8,
                    maxTemperature: this.getAverageTemperature(8),
                    activeItems: [],
                    crawlers: {
                        enabled: empire.playerClass == PlayerClass.collector,
                        overload: empire.playerClass == PlayerClass.collector && ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
                        count: 0,
                        max: empire.playerClass == PlayerClass.collector,
                    },
                    lifeform: LifeformType.rocktal,
                    activeLifeformTechnologies: [...LifeformTechnologyTypesByLifeform[LifeformType.rocktal]],
                },
            };
        }

        private * generateAmortizationItems(settings: AmortizationGenerationSettings): Generator<AmortizationItem, void, unknown> {
            if (Object.keys(settings.planets).length == 0) {
                return;
            }

            let { levelPlasmaTechnology, levelAstrophysics } = settings.player;

            const planets = { ...this.empire.planets } as Record<number, PlanetData>;
            const planetSettings = { ...settings.planets };
            const planetIds: number[] = Object.values(planetSettings).map(planet => planet.id);

            const calculationData: Record<number, AmortizationCalculationData> = {};
            Object.values(planetSettings).forEach(planet => {
                calculationData[planet.id] = {
                    mineLevels: {
                        [BuildingType.metalMine]: planet.mines?.metalMine ?? 0,
                        [BuildingType.crystalMine]: planet.mines?.crystalMine ?? 0,
                        [BuildingType.deuteriumSynthesizer]: planet.mines?.deuteriumSynthesizer ?? 0,
                    },
                    lifeformBuildingLevels: createRecord(LifeformBuildingTypes, type => planet.lifeformBuildingLevels?.[type] ?? 0),
                    lifeformTechnologyLevels: createRecord(LifeformTechnologyTypes, type => planet.lifeformTechnologyLevels?.[type] ?? 0),
                };
            });

            let newPlanets = 0;

            const itemsPerTimeout = 10;
            let curItems = 0;
            while (true) {
                const mineItems = planetIds.flatMap(
                    planetId => this.mineBuildingTypes.map(
                        building => this.getMineAmortizationItem(
                            planetId,
                            building,
                            calculationData[planetId],
                            levelPlasmaTechnology,
                            planets[planetId] as PlanetData,
                            planetSettings[planetId],
                            settings,
                        ),
                    ),
                );
                const plasmaTechItem = this.getPlasmaTechnologyAmortizationItem(calculationData, levelPlasmaTechnology, settings);
                const astrophysicsItem = this.getAstrophysicsAmortizationItem(levelAstrophysics, levelPlasmaTechnology, planetIds.length, -(newPlanets + 1), settings);
                const lifeformBuildingItems = planetIds.flatMap(
                    planetId => this.getApplicableLifeformBuildingTypesByLifeform(planetSettings[planetId].lifeform).map(
                        building => this.getLifeformBuildingAmortizationItem(
                            planetId,
                            building,
                            calculationData[planetId],
                            levelPlasmaTechnology,
                            planets[planetId] as PlanetData,
                            planetSettings[planetId],
                            settings,
                        ),
                    ),
                );
                const lifeformTechnologyItems = planetIds.flatMap(
                    planetId => planetSettings[planetId].activeLifeformTechnologies
                        .filter(tech => this.applicableLifeformTechnologyTypes.includes(tech))
                        .map(tech => this.getLifeformTechnologyAmortizationItem(
                            planetId,
                            tech,
                            calculationData[planetId],
                            levelPlasmaTechnology,
                            planets[planetId] as PlanetData,
                            planetSettings[planetId],
                            settings,
                        )),
                );

                const items = [
                    ...mineItems,
                    plasmaTechItem,
                    astrophysicsItem,
                    ...lifeformBuildingItems,
                    ...lifeformTechnologyItems,
                ].filter(item => item.productionDeltaMsu > 0); //remove items with production delta = 0, because plasmatech and others can have no effect if there are no mines at all

                const bestItem = items.reduce(
                    (best, item) => item.timeInHours < best.timeInHours ? item : best,
                    { timeInHours: Infinity } as AmortizationItem
                );

                let yieldItem: boolean;

                switch (bestItem.type) {
                    case 'mine': {
                        calculationData[bestItem.planetId].mineLevels[bestItem.mine] = bestItem.level;
                        yieldItem = this.planetSettings[bestItem.planetId].show;
                        break;
                    }

                    case 'plasma-technology': {
                        levelPlasmaTechnology = bestItem.level;
                        yieldItem = this.showPlasmaTechnology;
                        break;
                    }

                    case 'astrophysics-and-colony': {
                        levelAstrophysics = bestItem.levels[bestItem.levels.length - 1] ?? levelAstrophysics;
                        newPlanets++;

                        // add new planet that has to be considered for future amortization items
                        planetIds.push(bestItem.newPlanetId);
                        planetSettings[bestItem.newPlanetId] = this.astrophysicsSettings.planet;
                        calculationData[bestItem.newPlanetId] = { ...bestItem.builtLevels };

                        const fakePlanet = this.getFakePlanet();
                        planets[bestItem.newPlanetId] = this.buildProductionDependencies(calculationData[bestItem.newPlanetId], 0, fakePlanet, this.astrophysicsSettings.planet, settings).planet;

                        yieldItem = this.astrophysicsSettings.show;
                        break;
                    }

                    case 'lifeform-building': {
                        calculationData[bestItem.planetId].lifeformBuildingLevels[bestItem.building] = bestItem.level;
                        yieldItem = this.planetSettings[bestItem.planetId].show;
                        break;
                    }

                    case 'lifeform-technology': {
                        calculationData[bestItem.planetId].lifeformTechnologyLevels[bestItem.technology] = bestItem.level;
                        yieldItem = this.planetSettings[bestItem.planetId].show;
                        break;
                    }
                }

                if (yieldItem) {
                    yield bestItem;
                }

                curItems++;
                if (curItems >= itemsPerTimeout) {
                    curItems = 0;
                }
            }
        }

        private getFakePlanet(): PlanetData {
            return {
                isMoon: false,
                maxTemperature: 0,
                buildings: createRecord(BuildingTypes, 0),
                ships: createRecord(ShipTypes, 0),
                activeLifeform: LifeformType.none,
                lifeformBuildings: createRecord(LifeformBuildingTypes, 0),
                lifeformTechnologies: createRecord(LifeformTechnologyTypes, 0),
                productionSettings: {} as ProductionSettings,
                activeLifeformTechnologies: [],
                id: 0,
                name: '',
                coordinates: {} as Coordinates,
                defense: {} as DefenseCount,
                activeItems: {},
            };
        }

        private getAstrophysicsAmortizationItem(
            levelAstrophysics: number,
            levelPlasmaTechnology: number,
            curPlanetCount: number,
            newPlanetId: number,
            settings: AmortizationGenerationSettings
        ): AstrophysicsAmortizationItem {

            const maxPlanetCount = Math.ceil(levelAstrophysics / 2) + 1;
            const nextLevelAstrophysics = levelAstrophysics + levelAstrophysics % 2 + 1;

            const levels: number[] = [];
            let cost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            // if there are unused colony slots, then we don't need a higher astrophysics level
            if (curPlanetCount == maxPlanetCount) {
                for (let l = levelAstrophysics + 1; l <= nextLevelAstrophysics; l++) {
                    levels.push(l);

                    const levelCost = Astrophysics.getCost(l);
                    cost = addCost(cost, levelCost);
                }
            }

            const fakePlanet = this.getFakePlanet();

            const calcData: AmortizationCalculationData = {
                mineLevels: createRecord(this.mineBuildingTypes, 0),
                lifeformBuildingLevels: createRecord(LifeformBuildingTypes, 0),
                lifeformTechnologyLevels: createRecord(LifeformTechnologyTypes, 0),
            };
            let totalCost: Cost = { ...cost };
            let production: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            let timeInHours = Infinity;
            do {
                const metalMineItem = this.getMineAmortizationItem(-1, BuildingType.metalMine, calcData, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings);
                const crystalMineItem = this.getMineAmortizationItem(-1, BuildingType.crystalMine, calcData, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings);
                const deutSynthItem = this.getMineAmortizationItem(-1, BuildingType.deuteriumSynthesizer, calcData, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings);

                //TODO: lf buildings and tech
                const bestItem = [metalMineItem, crystalMineItem, deutSynthItem].reduce(
                    (best, item) => item.timeInHours < best.timeInHours ? item : best,
                    { timeInHours: Infinity } as MineAmortizationItem
                );

                const newTotalCost = addCost(totalCost, bestItem.cost);
                const newTotalCostMsu = this.getMsu(newTotalCost, settings);

                const newProduction = addCost(production, bestItem.productionDelta);
                const newProductionMsu = this.getMsu(newProduction, settings);

                const newTimeInHours = newTotalCostMsu / newProductionMsu;
                if (newTimeInHours > timeInHours) {
                    break;
                }

                timeInHours = newTimeInHours;
                production = newProduction;
                totalCost = newTotalCost;

                calcData.mineLevels[bestItem.mine]++;
            } while (true);

            return {
                type: 'astrophysics-and-colony',
                levels,
                builtLevels: calcData,
                cost: totalCost,
                costMsu: this.getMsu(totalCost, settings),
                productionDelta: production,
                productionDeltaMsu: this.getMsu(production, settings),
                timeInHours: timeInHours,
                newPlanetId,
            };
        }

        private getPlasmaTechnologyAmortizationItem(
            data: Record<number, AmortizationCalculationData>,
            levelPlasmaTechnology: number,
            settings: AmortizationGenerationSettings
        ): PlasmaTechnologyAmortizationItem {
            const newLevel = levelPlasmaTechnology + 1;

            const cost = PlasmaTechnology.getCost(newLevel);
            const costMsu = this.getMsu(cost, settings);

            const production = Object.values(this.planetSettings)
                .flatMap(planetSettings => {
                    const levels = data[planetSettings.id].mineLevels;
                    const dependencies = this.buildProductionDependencies(data[planetSettings.id], levelPlasmaTechnology, this.empire.planets[planetSettings.id] as PlanetData, planetSettings, settings);

                    return this.mineBuildingTypes.map(mineType =>
                        this.minesByType[mineType].getProduction(levels[mineType], dependencies)
                    );
                }).reduce(
                    (total, prod) => addCost(total, prod),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
                );

            const newProduction = Object.values(this.planetSettings)
                .flatMap(planetSettings => {
                    const levels = data[planetSettings.id].mineLevels;
                    const dependencies = this.buildProductionDependencies(data[planetSettings.id], newLevel, this.empire.planets[planetSettings.id] as PlanetData, planetSettings, settings);
                    return this.mineBuildingTypes.map(mineType =>
                        this.minesByType[mineType].getProduction(levels[mineType], dependencies)
                    );
                }).reduce(
                    (total, prod) => addCost(total, prod),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
                );

            const productionDelta = subCost(newProduction, production);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'plasma-technology',
                level: newLevel,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private getLifeformBuildingAmortizationItem(
            planetId: number,
            buildingType: LifeformBuildingType,
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): LifeformBuildingAmortizationItem {
            const building = LifeformBuildingsByType[buildingType];
            const newLevel = data.lifeformBuildingLevels[buildingType] + 1;

            const cost = building.getCost(newLevel);
            const costMsu = this.getMsu(cost, settings);

            const curDependencies = this.buildProductionDependencies(data, levelPlasmaTechnology, planet, planetSettings, settings);
            const curProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], curDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const newDependencies = this.buildProductionDependencies({
                ...data,
                lifeformBuildingLevels: {
                    ...data.lifeformBuildingLevels,
                    [buildingType]: newLevel,
                },
            }, levelPlasmaTechnology, planet, planetSettings, settings);

            const newProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], newDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const productionDelta = subCost(newProduction, curProduction);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'lifeform-building',
                planetId,
                building: buildingType,
                level: newLevel,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private getLifeformTechnologyAmortizationItem(
            planetId: number,
            technologyType: LifeformTechnologyType,
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): LifeformTechnologyAmortizationItem {
            const technology = LifeformTechnologiesByType[technologyType];
            const newLevel = data.lifeformTechnologyLevels[technologyType] + 1;

            const cost = technology.getCost(newLevel);
            const costMsu = this.getMsu(cost, settings);

            const curDependencies = this.buildProductionDependencies(data, levelPlasmaTechnology, planet, planetSettings, settings);
            const curProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], curDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const newDependencies = this.buildProductionDependencies({
                ...data,
                lifeformTechnologyLevels: {
                    ...data.lifeformTechnologyLevels,
                    [technologyType]: newLevel,
                },
            }, levelPlasmaTechnology, planet, planetSettings, settings);

            const newProduction = this.mineBuildingTypes
                .map(mineType => this.minesByType[mineType].getProduction(data.mineLevels[mineType], newDependencies))
                .reduce<Cost>((acc, cur) => addCost(acc, cur), { metal: 0, crystal: 0, deuterium: 0, energy: 0 });

            const productionDelta = subCost(newProduction, curProduction);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'lifeform-technology',
                planetId,
                technology: technologyType,
                level: newLevel,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private getMineAmortizationItem(
            planetId: number,
            mineType: MineBuildingType,
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): MineAmortizationItem {
            const mineLevel = data.mineLevels[mineType];

            const mine = {
                [BuildingType.metalMine]: MetalMine,
                [BuildingType.crystalMine]: CrystalMine,
                [BuildingType.deuteriumSynthesizer]: DeuteriumSynthesizer,
            }[mineType];

            const cost = mine.getCost(mineLevel + 1);
            const costMsu = this.getMsu(cost, settings);

            const dependencies = this.buildProductionDependencies(data, levelPlasmaTechnology, planet, planetSettings, settings);
            const curProduction = mine.getProduction(mineLevel, dependencies);
            const newProduction = mine.getProduction(mineLevel + 1, dependencies);
            const productionDelta = subCost(newProduction, curProduction);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'mine',
                planetId,
                mine: mineType,
                level: mineLevel + 1,

                cost,
                costMsu,
                productionDelta,
                productionDeltaMsu,
                timeInHours: costMsu / productionDeltaMsu,
            };
        }

        private buildProductionDependencies(
            data: AmortizationCalculationData,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings,
        ): ProductionBuildingDependencies {
            const builtPlanet: PlanetData = {
                ...planet,
                activeLifeform: planetSettings.lifeform,
                coordinates: {
                    ...planet.coordinates,
                    position: planetSettings.position,
                },
                maxTemperature: planetSettings.maxTemperature,
                productionSettings: {
                    [BuildingType.metalMine]: 100,
                    [BuildingType.crystalMine]: 100,
                    [BuildingType.deuteriumSynthesizer]: 100,
                    [BuildingType.solarPlant]: 100,
                    [BuildingType.fusionReactor]: 100,
                    [ShipType.crawler]: planetSettings.crawlers.enabled
                        ? planetSettings.crawlers.overload
                            ? 150
                            : 100
                        : 0,
                    [ShipType.solarSatellite]: 100,
                },
                activeItems: {
                    ...planet.activeItems,
                    ...planetSettings.activeItems.reduce(
                        (acc, item) => {
                            acc[item] = 'permanent';
                            return acc;
                        },
                        {} as Partial<Record<ItemHash, number | "permanent">>
                    ),
                },
                buildings: {
                    ...planet.buildings,
                    ...data.mineLevels,
                },
                ships: {
                    ...planet.ships,
                    [ShipType.crawler]: planetSettings.crawlers.max ? 10_000 : planetSettings.crawlers.count,
                },
                lifeformBuildings: {
                    ...data.lifeformBuildingLevels,
                },
                activeLifeformTechnologies: [...planetSettings.activeLifeformTechnologies],
                lifeformTechnologies: {
                    ...data.lifeformTechnologyLevels,
                },
            };

            const planets = { ...this.empire.planets } as Record<number, PlanetData>;

            Object.values(settings.planets).forEach(planetSettings =>
                planets[planetSettings.id] = {
                    ...planets[planetSettings.id],
                    activeLifeform: planetSettings.lifeform,
                    activeLifeformTechnologies: planetSettings.activeLifeformTechnologies,
                    lifeformTechnologies: planetSettings.lifeformTechnologyLevels ?? createRecord(LifeformTechnologyTypes, 0),
                }
            );

            planets[builtPlanet.id] = builtPlanet;
            return {
                serverSettings: ServerSettingsDataModule.serverSettings,
                planet: builtPlanet,
                player: {
                    ...this.empire,
                    playerClass: settings.player.playerClass,
                    allianceClass: settings.player.allianceClass,
                    officers: settings.player.officers,
                    research: {
                        ...this.empire.research,
                        [ResearchType.plasmaTechnology]: levelPlasmaTechnology,
                    },
                    planets,
                },
            };
        }

        private getMsu(cost: Cost, settings: AmortizationGenerationSettings): number {
            return cost.metal
                + cost.crystal * settings.player.msuConversionRates.crystal
                + cost.deuterium * settings.player.msuConversionRates.deuterium;
        }

        /** 
         * Returns the average position at the given position using the official list:
         * https://board.de.ogame.gameforge.com/index.php?thread/193098-offizielle-planetengr%C3%B6%C3%9Fen-in-version-6-1/
         */
        private getAverageTemperature(position: number): number {
            switch (position) {
                case 1: return 240;
                case 2: return 190;
                case 3: return 140;
                case 4: return 90;
                case 5: return 80;
                case 6: return 70;
                case 7: return 60;
                case 8: return 50;
                case 9: return 40;
                case 10: return 30;
                case 11: return 20;
                case 12: return 10;
                case 13: return -30;
                case 14: return -70;
                case 15: return -110;

                default: throw new Error('invalid position');
            }
        }
        /**********************************/
        /*  END amortization calculation  */
        /**********************************/



        private get columns(): GridTableColumn<keyof BaseAmortizationItem | 'what' | 'checkbox'>[] {
            const showMsu = SettingsDataModule.settings.showMsuCells;

            const result: GridTableColumn<keyof BaseAmortizationItem | 'what' | 'checkbox'>[] = [
                { key: 'checkbox', size: 'auto' },
                { key: 'what', size: 'auto' },
                { key: 'cost', size: '3fr' },
            ];

            if (showMsu) {
                result.push({
                    key: 'costMsu',
                    label: this.$i18n.$t.empire.amortization.table.costMsu,
                    size: '1fr',
                });
            }

            result.push({
                key: 'productionDelta',
                label: this.$i18n.$t.empire.amortization.table.productionPlus,
                size: '1fr',
            });

            if (showMsu) {
                result.push({
                    key: 'productionDeltaMsu',
                    label: this.$i18n.$t.empire.amortization.table.productionPlusMsu,
                    size: '1fr',
                });
            }

            result.push({
                key: 'timeInHours',
                label: this.$i18n.$t.empire.amortization.table.amortizationTime,
                size: '1fr',
            });

            return result;
        }

        private get items(): AmortizationItem[] {
            return this.amortizationItems;
        }

        private get footerItems(): AmortizationItem[] {
            const zeroCost: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };

            const cost = this.selectedItemIndizes
                .map(i => this.amortizationItems[i])
                .reduce<Cost>((total, cur) => addCost(total, cur.cost), zeroCost);

            return [{
                type: 'mine',
                planetId: 0,
                mine: BuildingType.metalMine,
                level: 0,
                cost,
                costMsu: this.getMsu(cost, this.generationSettings),
                productionDelta: zeroCost,
                productionDeltaMsu: 0,
                timeInHours: 0,
            }];
        }

        private formatCoordinates(coordinates: Coordinates): string {
            return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
        }

        private timeout: number | undefined = undefined;
        @Watch('items')
        private onItemsChanged() {
            if (this.items.length < 25) {
                console.log('items changed');
                this.setTimeout(() => this.insertNextAmortizationItems(25 - this.items.length));
            }
        }

        private onTableScroll(event: GridTableScrollEvent): void {
            if (event.y.max - event.y.current < 50) {
                console.log('table scroll');
                this.setTimeout(() => this.insertNextAmortizationItems(10));
            }
        }

        private setTimeout(action: () => any) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(action, 250);
        }

        private get buildableTranslations() {
            const translations: Record<any, string> = {
                'plasma-technology': this.$i18n.$t.research[ResearchType.plasmaTechnology],
                'astrophysics-colony': this.$i18n.$t.research[ResearchType.astrophysics],
            };

            BuildingTypes.forEach(building => translations[building] = this.$i18n.$t.buildings[building]);
            LifeformBuildingTypes.forEach(building => translations[building] = this.$i18n.$t.lifeformBuildings[building]);
            LifeformTechnologyTypes.forEach(tech => translations[tech] = this.$i18n.$t.lifeformTechnologies[tech]);

            return translations;
        }

        private cellClassProvider(_: any, item: AmortizationItem): string {
            switch (item.type) {
                case 'astrophysics-and-colony': return 'astrophysics-cell';
                case 'plasma-technology': return 'plasmatech-cell';

                default: return '';
            }
        }

        private toggleItemSelection(index?: number) {
            if (index == null) {
                if (this.selectedItemIndizes.length == this.items.length) {
                    this.selectedItemIndizes = [];
                }
                else {
                    this.selectedItemIndizes = this.items.map((_, i) => i);
                }
                return;
            }

            if (this.selectedItemIndizes.includes(index)) {
                this.selectedItemIndizes = this.selectedItemIndizes.filter(i => i != index);
            }
            else {
                this.selectedItemIndizes.push(index);
            }
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

    .what-cell {
        display: grid;
        justify-items: center;
        align-items: center;
        column-gap: 8px;
        width: 100%;

        grid-template-columns: 150px auto 1fr;

        .planet {
            display: grid;
            justify-self: end;
        }

        &--colony .planet {
            grid-row: 1 / span 4;
        }
    }

    .name-and-level {
        display: grid;
        text-align: left;
        justify-self: start;
    }

    .new-colony-mines {
        display: grid;
        grid-template-columns: repeat(3, auto);
        column-gap: 16px;
        align-items: center;
        justify-items: center;

        > * {
            display: grid;
            grid-template-columns: auto auto;
            column-gap: 8px;
            justify-items: start;
            align-items: center;
        }
    }

    .amortization {
        display: grid;
        column-gap: 4px;
        grid-template-columns: 1fr auto;
        align-items: start;
        height: 100%;

        &-container {
            display: grid;
            grid-template-rows: auto 1fr;
            max-height: 100%;
            overflow: auto;
        }

        &-table {
            overflow: auto;
            min-height: 300px;

            &::v-deep {
                .astrophysics-cell,
                .astrophysics-cell ~ .grid-table-cell {
                    background-color: rgba(64, 129, 152, 0.25) !important;
                }

                .plasmatech-cell,
                .plasmatech-cell ~ .grid-table-cell {
                    background-color: rgba(123, 255, 95, 0.1) !important;
                }
            }
        }

        &-settings {
            max-height: 100%;
            overflow: auto;
            display: grid;
            grid-template-rows: auto 1fr;
            justify-items: start;

            > button {
                margin-bottom: 4px;
            }
        }
    }

    .flex-settings {
        display: flex;
        flex-wrap: wrap;
        column-gap: 48px;
    }

    .zero {
        opacity: 0.4;
    }

    .amortization-settings-container {
        overflow: auto;
        border: 1px solid rgba(var(--color), 0.25);
        padding: 12px;
        overflow: auto;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: rgba(var(--color), 0.05);
    }

    .msu-settings-amortization-info {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 2px;
        border-top: 1px solid rgba(var(--color), 0.5);

        .mdi {
            font-size: 1.333rem;
        }
    }
</style>