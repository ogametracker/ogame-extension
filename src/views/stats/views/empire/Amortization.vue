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
                <grid-table :items="items" :columns="columns" sticky="100%" @scroll="onTableScroll($event)" :cellClassProvider="cellClassProvider">
                    <template #header-cost>
                        <div class="cost-grid">
                            <span v-text="$i18n.$t.empire.amortization.table.cost" style="grid-column: 2" />
                            <o-resource resource="metal" style="grid-column: 1" />
                            <o-resource resource="crystal" />
                            <o-resource resource="deuterium" />
                        </div>
                    </template>

                    <template #cell-what="{ value }">
                        <div
                            v-if="[BuildingType.metalMine, BuildingType.crystalMine, BuildingType.deuteriumSynthesizer].includes(value.type)"
                            class="what-cell what-cell--mine"
                        >
                            <span v-if="value.planetId > 0" class="planet">
                                <span v-text="empire.planets[value.planetId].name" />
                                <span v-text="formatCoordinates(empire.planets[value.planetId].coordinates)" />
                            </span>
                            <span v-else class="planet">
                                <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-value.planetId}`" />
                                <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                            </span>

                            <o-building :building="value.type" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[value.type]" />
                                <span v-text="value.level" />
                            </span>
                        </div>
                        <div v-else-if="value.type == 'plasma-technology'" class="what-cell what-cell--plasma-technology">
                            <span />
                            <o-research :research="ResearchType.plasmaTechnology" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations[value.type]" />
                                <span v-text="value.level" />
                            </span>
                        </div>
                        <div v-else-if="value.type == 'astrophysics-colony'" class="what-cell what-cell--colony">
                            <span class="planet">
                                <span v-text="`${$i18n.$t.empire.amortization.settings.astrophysicsSettings.newColony} ${-value.planetId}`" />
                                <span v-text="`[-:-:${astrophysicsSettings.planet.position}]`" />
                            </span>

                            <o-research :research="ResearchType.astrophysics" :disabled="value.levels.length == 0" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations['astrophysics-colony']" />

                                <span v-if="value.levels.length == 0" v-text="'-'" />
                                <span v-else-if="value.levels.length == 1" v-text="value.levels[0]" />
                                <span v-else v-text="`${value.levels[0]} + ${value.levels[1]}`" />
                            </span>

                            <o-building :building="BuildingType.metalMine" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations['metal-mine']" />
                                <span v-text="`1 - ${value.mineLevels.metalMine}`" />
                            </span>

                            <o-building :building="BuildingType.crystalMine" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations['crystal-mine']" />
                                <span v-text="`1 - ${value.mineLevels.crystalMine}`" />
                            </span>

                            <o-building :building="BuildingType.deuteriumSynthesizer" size="36px" />
                            <span class="name-and-level">
                                <span v-text="buildableTranslations['deuterium-synthesizer']" />
                                <span v-text="`1 - ${value.mineLevels.deuteriumSynthesizer}`" />
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

                    <template #cell-amortizationTimeInH="{ value }">
                        <span v-text="$i18n.$timespan(value * 60 * 60)" />
                    </template>
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
    import { ProductionBuildingDependencies } from '@/shared/models/ogame/buildings/ProductionBuilding';
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
    import { LifeformBuildingTypes } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologyTypes } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { DefenseTypes } from '@/shared/models/ogame/defenses/DefenseType';
    import { DefenseCount } from '@/shared/models/empire/DefenseCount';
    import { ProductionSettings } from '@/shared/models/empire/ProductionSettings';

    interface AmortizationAstrophysicsSettings {
        show: boolean;
        planet: AmortizationPlanetSettings;
    }

    type MineBuildingType = BuildingType.metalMine | BuildingType.crystalMine | BuildingType.deuteriumSynthesizer;

    interface MineAmortizationItem {
        type: 'mine';
        planetId: number;
        mine: MineBuildingType;
        level: number;

        cost: Cost;
        costMsu: number;
        productionDelta: Cost;
        productionDeltaMsu: number;
        timeInHours: number;
    }

    interface PlasmaTechnologyAmortizationItem {
        type: 'plasma-technology';
        level: number;

        cost: Cost;
        costMsu: number;
        productionDelta: Cost;
        productionDeltaMsu: number;
        timeInHours: number;
    }

    interface AstrophysicsAmortizationItem {
        type: 'astrophysics-and-colony';
        levels: number[];
        newPlanetId: number;

        mineLevels: MineLevels;

        cost: Cost;
        costMsu: number;
        productionDelta: Cost;
        productionDeltaMsu: number;
        timeInHours: number;
    }

    type AmortizationItem = MineAmortizationItem | PlasmaTechnologyAmortizationItem | AstrophysicsAmortizationItem;

    interface MineLevels {
        metalMine: number;
        crystalMine: number;
        deuteriumSynthesizer: number;
    }

    interface AmortizationGenerationSettings {
        player: AmortizationPlayerSettings;
        planets: Record<number, AmortizationPlanetSettings>;
        astrophysics: AmortizationAstrophysicsSettings;
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
                activeLifeformTechnologies: [],
            },
        };
        private showPlasmaTechnology = true;

        private showSettings = false;

        private readonly empire = EmpireDataModule.empire;
        private amortizationItems: AmortizationItem[] = [];
        private generator: Generator<AmortizationItem, void, unknown> = null!;

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

            this.initItems();
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
            this.amortizationItems = [];

            const generationSettings = this.getAmortizationGenerationSettings();
            this.generator = this.generateAmortizationItems(generationSettings);
            this.insertNextAmortizationItems(25);
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
                            metalMine: {
                                level: planet.buildings[BuildingType.metalMine],
                                show: true,
                            },
                            crystalMine: {
                                level: planet.buildings[BuildingType.crystalMine],
                                show: true,
                            },
                            deuteriumSynthesizer: {
                                level: planet.buildings[BuildingType.deuteriumSynthesizer],
                                show: true,
                            },
                        },
                        activeItems: Object.keys(planet.activeItems) as ItemHash[],
                        crawlers: {
                            enabled: true,
                            overload: empire.playerClass == PlayerClass.collector && ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
                            count: planet.ships[ShipType.crawler],
                            max: empire.playerClass == PlayerClass.collector,
                        },
                        lifeform: planet.activeLifeform,
                        activeLifeformTechnologies: planet.activeLifeformTechnologies,
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
                    lifeform: LifeformType.rocktal,
                    activeItems: [],
                    crawlers: {
                        enabled: empire.playerClass == PlayerClass.collector,
                        overload: empire.playerClass == PlayerClass.collector && ServerSettingsDataModule.serverSettings.playerClasses.collector.crawlers.isOverloadEnabled,
                        count: 0,
                        max: empire.playerClass == PlayerClass.collector,
                    },
                    activeLifeformTechnologies: [],
                },
            };
        }

        private * generateAmortizationItems(settings: AmortizationGenerationSettings): Generator<AmortizationItem, void, unknown> {
            if (Object.keys(settings.planets).length == 0) {
                return;
            }

            let { levelPlasmaTechnology, levelAstrophysics } = settings.player;

            const planets = { ...this.empire.planets };

            const mineLevels: Record<number, MineLevels> = {};
            const planetIds: number[] = [];
            const planetSettings = { ...settings.planets };
            Object.values(planetSettings).forEach(planet => {
                mineLevels[planet.id] = {
                    metalMine: planet.mines?.metalMine.level ?? 0,
                    crystalMine: planet.mines?.crystalMine.level ?? 0,
                    deuteriumSynthesizer: planet.mines?.deuteriumSynthesizer.level ?? 0,
                };
                planetIds.push(planet.id);
            });
            const mineLevelsArray = Object.values(mineLevels);

            let newPlanets = 0;


            const itemsPerTimeout = 10;
            let curItems = 0;
            while (true) {
                const mineItems = planetIds.flatMap(planetId => [
                    this.getMineAmortizationItem(planetId, BuildingType.metalMine, mineLevels[planetId], levelPlasmaTechnology, planets[planetId] as PlanetData, planetSettings[planetId], settings),
                    this.getMineAmortizationItem(planetId, BuildingType.crystalMine, mineLevels[planetId], levelPlasmaTechnology, planets[planetId] as PlanetData, planetSettings[planetId], settings),
                    this.getMineAmortizationItem(planetId, BuildingType.deuteriumSynthesizer, mineLevels[planetId], levelPlasmaTechnology, planets[planetId] as PlanetData, planetSettings[planetId], settings),
                ]);
                const plasmaTechItem = this.getPlasmaTechnologyAmortizationItem(mineLevels, levelPlasmaTechnology, settings);
                const astrophysicsItem = this.getAstrophysicsAmortizationItem(levelAstrophysics, levelPlasmaTechnology, planetIds.length, -(newPlanets + 1), settings);

                const items = [
                    ...mineItems,
                    plasmaTechItem,
                    astrophysicsItem,
                ].filter(item => item.productionDeltaMsu > 0); //remove items with production delta = 0, because plasmatech can have no effect if there are no mines at all

                const bestItem = items.reduce(
                    (best, item) => item.timeInHours < best.timeInHours ? item : best,
                    { timeInHours: Infinity } as AmortizationItem
                );

                let yieldItem: boolean;

                switch (bestItem.type) {
                    case 'mine': {
                        const mine = (<Record<MineBuildingType, keyof MineLevels>>{
                            [BuildingType.metalMine]: 'metalMine',
                            [BuildingType.crystalMine]: 'crystalMine',
                            [BuildingType.deuteriumSynthesizer]: 'deuteriumSynthesizer',
                        })[bestItem.mine];
                        mineLevels[bestItem.planetId][mine] = bestItem.level;

                        const planetSettings = this.planetSettings[bestItem.planetId] as AmortizationPlanetSettings | undefined;
                        yieldItem = (planetSettings?.show && planetSettings?.mines![mine].show) ?? this.astrophysicsSettings.show;
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
                        const newPlanetMineLevels = { ...bestItem.mineLevels };
                        mineLevels[bestItem.newPlanetId] = newPlanetMineLevels;
                        mineLevelsArray.push(newPlanetMineLevels);

                        const fakePlanet = this.getFakePlanet();
                        planets[bestItem.newPlanetId] = this.buildProductionDependencies(bestItem.mineLevels, 0, fakePlanet, this.astrophysicsSettings.planet, settings).planet;

                        yieldItem = this.astrophysicsSettings.show;
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

            const mineLevels: MineLevels = {
                metalMine: 0,
                crystalMine: 0,
                deuteriumSynthesizer: 0,
            };
            let totalCost: Cost = { ...cost };
            let production: Cost = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
            let timeInHours = Infinity;
            do {
                const metalMineItem = this.getMineAmortizationItem(-1, BuildingType.metalMine, mineLevels, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings);
                const crystalMineItem = this.getMineAmortizationItem(-1, BuildingType.crystalMine, mineLevels, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings);
                const deutSynthItem = this.getMineAmortizationItem(-1, BuildingType.deuteriumSynthesizer, mineLevels, levelPlasmaTechnology, fakePlanet, this.astrophysicsSettings.planet, settings);

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
                const mine = (<Record<MineBuildingType, keyof MineLevels>>{
                    [BuildingType.metalMine]: 'metalMine',
                    [BuildingType.crystalMine]: 'crystalMine',
                    [BuildingType.deuteriumSynthesizer]: 'deuteriumSynthesizer',
                })[bestItem.mine];
                mineLevels[mine]++;
            } while (true);

            return {
                type: 'astrophysics-and-colony',
                levels,
                mineLevels,
                cost: totalCost,
                costMsu: this.getMsu(totalCost, settings),
                productionDelta: production,
                productionDeltaMsu: this.getMsu(production, settings),
                timeInHours: timeInHours,
                newPlanetId,
            };
        }

        private getPlasmaTechnologyAmortizationItem(
            mineLevels: Record<number, MineLevels>,
            levelPlasmaTechnology: number,
            settings: AmortizationGenerationSettings
        ): PlasmaTechnologyAmortizationItem {
            const level = levelPlasmaTechnology + 1;

            const cost = PlasmaTechnology.getCost(level);
            const costMsu = this.getMsu(cost, settings);

            const production = Object.values(this.planetSettings)
                .flatMap(planetSettings => {
                    const levels = mineLevels[planetSettings.id];
                    const dependencies = this.buildProductionDependencies(levels, levelPlasmaTechnology, this.empire.planets[planetSettings.id] as PlanetData, planetSettings, settings);
                    const prodMetalMine = MetalMine.getProduction(levels.metalMine, dependencies);
                    const prodCrystalMine = CrystalMine.getProduction(levels.crystalMine, dependencies);
                    const prodDeuteriumSynthesizer = DeuteriumSynthesizer.getProduction(levels.deuteriumSynthesizer, dependencies);

                    return [prodMetalMine, prodCrystalMine, prodDeuteriumSynthesizer];
                }).reduce(
                    (total, prod) => addCost(total, prod),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
                );

            const newProduction = Object.values(this.planetSettings)
                .flatMap(planetSettings => {
                    const levels = mineLevels[planetSettings.id];
                    const dependencies = this.buildProductionDependencies(levels, level, this.empire.planets[planetSettings.id] as PlanetData, planetSettings, settings);
                    const prodMetalMine = MetalMine.getProduction(levels.metalMine, dependencies);
                    const prodCrystalMine = CrystalMine.getProduction(levels.crystalMine, dependencies);
                    const prodDeuteriumSynthesizer = DeuteriumSynthesizer.getProduction(levels.deuteriumSynthesizer, dependencies);

                    return [prodMetalMine, prodCrystalMine, prodDeuteriumSynthesizer];
                }).reduce(
                    (total, prod) => addCost(total, prod),
                    { metal: 0, crystal: 0, deuterium: 0, energy: 0 } as Cost
                );

            const productionDelta = subCost(newProduction, production);
            const productionDeltaMsu = this.getMsu(productionDelta, settings);

            return {
                type: 'plasma-technology',
                level,

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
            levels: MineLevels,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): MineAmortizationItem {
            const mineLevel = {
                [BuildingType.metalMine]: levels.metalMine,
                [BuildingType.crystalMine]: levels.crystalMine,
                [BuildingType.deuteriumSynthesizer]: levels.deuteriumSynthesizer,
            }[mineType];

            const mine = {
                [BuildingType.metalMine]: MetalMine,
                [BuildingType.crystalMine]: CrystalMine,
                [BuildingType.deuteriumSynthesizer]: DeuteriumSynthesizer,
            }[mineType];

            const cost = mine.getCost(mineLevel + 1);
            const costMsu = this.getMsu(cost, settings);

            const dependencies = this.buildProductionDependencies(levels, levelPlasmaTechnology, planet, planetSettings, settings);
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
            levels: MineLevels,
            levelPlasmaTechnology: number,
            planet: PlanetData,
            planetSettings: AmortizationPlanetSettings,
            settings: AmortizationGenerationSettings
        ): ProductionBuildingDependencies {
            return {
                serverSettings: ServerSettingsDataModule.serverSettings,
                planet: {
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
                        [BuildingType.metalMine]: levels.metalMine,
                        [BuildingType.crystalMine]: levels.crystalMine,
                        [BuildingType.deuteriumSynthesizer]: levels.deuteriumSynthesizer,
                    },
                    ships: {
                        ...planet.ships,
                        [ShipType.crawler]: planetSettings.crawlers.max ? 10_000 : planetSettings.crawlers.count,
                    },
                },
                player: {
                    ...this.empire,
                    playerClass: settings.player.playerClass,
                    allianceClass: settings.player.allianceClass,
                    officers: settings.player.officers,
                    research: {
                        ...this.empire.research,
                        [ResearchType.plasmaTechnology]: levelPlasmaTechnology,
                    },
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



        private get columns(): GridTableColumn<keyof AmortizationTableItem>[] {
            const showMsu = SettingsDataModule.settings.showMsuCells;

            const result: GridTableColumn<keyof AmortizationTableItem>[] = [
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
                key: 'amortizationTimeInH',
                label: this.$i18n.$t.empire.amortization.table.amortizationTime,
                size: '1fr',
            });

            return result;
        }

        private get items(): AmortizationTableItem[] {
            function getWhat(item: AmortizationItem): AmortizationTableItemWhat {
                switch (item.type) {
                    case 'mine': {
                        const type = item.mine;

                        return {
                            type,
                            level: item.level,
                            planetId: item.planetId,
                        };
                    }

                    case 'plasma-technology': return {
                        type: 'plasma-technology',
                        level: item.level,
                    };

                    case 'astrophysics-and-colony': return {
                        type: 'astrophysics-colony',
                        levels: item.levels,
                        planetId: item.newPlanetId,
                        mineLevels: item.mineLevels,
                    };
                }
            };

            return this.amortizationItems
                .map(item => ({
                    cost: item.cost,
                    costMsu: item.costMsu,
                    productionDelta: item.productionDelta,
                    productionDeltaMsu: item.productionDeltaMsu,
                    amortizationTimeInH: item.timeInHours,
                    what: getWhat(item),
                }));
        }

        private formatCoordinates(coordinates: Coordinates): string {
            return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
        }

        @Watch('items')
        private onItemsChanged(items: AmortizationTableItem[]) {
            if (items.length < 100) {
                this.queueTimeout(() => this.insertNextAmortizationItems(20));
            }
        }

        private onTableScroll(event: GridTableScrollEvent): void {
            if (event.y.max - event.y.current < 150) {
                this.queueTimeout(() => this.insertNextAmortizationItems(20));
            }
        }

        private timeoutQueue: (() => any)[] = [];
        private timeout: number | null = null;
        private queueTimeout(action: () => any) {
            this.timeoutQueue.push(action);
            this.updateTimeout();
        }

        private updateTimeout() {
            if (this.timeout == null) {
                this.timeout = setTimeout(() => this.invokeNextTimeoutQueueAction(), 250);
            }
        }

        private invokeNextTimeoutQueueAction() {
            const action = this.timeoutQueue.shift();
            action?.();

            this.timeout = null;
            this.updateTimeout();
        }

        private get buildableTranslations(): Record<AmortizationTableItemWhat['type'], string> {
            return {
                [BuildingType.metalMine]: this.$i18n.$t.buildings[BuildingType.metalMine],
                [BuildingType.crystalMine]: this.$i18n.$t.buildings[BuildingType.crystalMine],
                [BuildingType.deuteriumSynthesizer]: this.$i18n.$t.buildings[BuildingType.deuteriumSynthesizer],
                'plasma-technology': this.$i18n.$t.research[ResearchType.plasmaTechnology],
                'astrophysics-colony': this.$i18n.$t.research[ResearchType.astrophysics],
            };
        }

        private cellClassProvider(item: AmortizationTableItemWhat): string {
            switch (item.type) {
                case 'astrophysics-colony': return 'astrophysics-cell';
                case 'plasma-technology': return 'plasmatech-cell';

                default: return '';
            }
        }
    }

    type AmortizationMineTableItemType = BuildingType.metalMine | BuildingType.crystalMine | BuildingType.deuteriumSynthesizer;
    interface AmortizationMineTableItem {
        type: AmortizationMineTableItemType;
        level: number;
        planetId: number;
    }

    interface AmortizationPlasmaTechnologyTableItem {
        type: 'plasma-technology';
        level: number;
    }

    interface AmortizationAstrophysicsTableItem {
        type: 'astrophysics-colony';
        levels: number[];
        planetId: number;
        mineLevels: MineLevels;
    }

    type AmortizationTableItemWhat = AmortizationMineTableItem | AmortizationPlasmaTechnologyTableItem | AmortizationAstrophysicsTableItem;

    interface AmortizationTableItem {
        what: AmortizationTableItemWhat;
        cost: Cost;
        costMsu: number;
        productionDelta: Cost;
        productionDeltaMsu: number;
        amortizationTimeInH: number;
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
            margin-bottom: 4px;
            max-height: 100%;
            overflow: auto;
            display: grid;
            grid-template-rows: auto 1fr;
            justify-items: start;
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