<template>
    <div class="amortization">
        <div class="amortization-settings">
            <h3>LOCA: Player Settings</h3>
            <amortization-player-settings-inputs v-model="playerSettings" />
            <hr />

            <h3>LOCA: Planet Settings</h3>
            <div>
                <amortization-planet-settings-inputs
                    v-for="(planetSetting, id) in planetSettings"
                    :key="id"
                    v-model="planetSettings[id]"
                    toggleable
                />
            </div>
            <hr />

            <h3>LOCA: Plasmatechnology</h3>
            <div class="plasma-tech-settings">
                <span>LOCA: Show plasmatech in result</span>
                <span>
                    TODO
                    <input type="checkbox" v-model="showPlasmaTechnology" />
                </span>
            </div>
            <hr />

            <h3>LOCA: Astrophysics</h3>
            <div class="astrophysics-settings">
                <span>LOCA: Show astrophysics + new colony in result</span>
                <span>
                    TODO
                    <input
                        type="checkbox"
                        v-model="astrophysicsSettings.show"
                    />
                </span>

                <amortization-planet-settings-inputs
                    v-model="astrophysicsSettings.planet"
                />
            </div>

            <button @click="initItems()">LOCA: Update</button>
            <hr />
        </div>

        <div class="amortization-table">
            <grid-table
                :items="items"
                :columns="columns"
                sticky="100%"
                @scroll="onTableScroll($event)"
                :hide-row="(item) => !item.visible"
            >
                <template #header-cost>
                    <div class="cost-grid">
                        <span v-text="'LOCA: Cost'" style="grid-column: 2" />
                        <o-resource resource="metal" style="grid-column: 1" />
                        <o-resource resource="crystal" />
                        <o-resource resource="deuterium" />
                    </div>
                </template>

                <template #cell-what="{ value }">
                    <div
                        v-if="
                            [
                                'metal-mine',
                                'crystal-mine',
                                'deuterium-synthesizer',
                            ].includes(value.type)
                        "
                        class="what-cell what-cell--mine"
                    >
                        <span v-if="value.planetId > 0">
                            <span
                                v-text="empire.planets[value.planetId].name"
                            />
                            <span
                                v-text="
                                    formatCoordinates(
                                        empire.planets[value.planetId]
                                            .coordinates
                                    )
                                "
                            />
                        </span>
                        <span
                            v-else
                            v-text="`LOCA: new Colony ${-value.planetId}`"
                        />

                        <o-building :building="value.type" />
                        <span v-text="value.level" />
                    </div>
                    <div
                        v-else-if="value.type == 'plasma-technology'"
                        class="what-cell what-cell--plasma-technology"
                    >
                        <o-research research="plasma-technology" />
                        <span v-text="value.level" />
                    </div>
                    <div
                        v-else-if="value.type == 'astrophysics-colony'"
                        class="what-cell what-cell--colony"
                    >
                        <o-research
                            research="astrophysics"
                            :disabled="value.levels.length == 0"
                        />
                        <span v-if="value.levels.length == 0" v-text="'-'" />
                        <span
                            v-else-if="value.levels.length == 1"
                            v-text="value.levels[0]"
                        />
                        <span
                            v-else
                            v-text="`${value.levels[0]}+${value.levels[1]}`"
                        />

                        <span
                            class="mdi mdi-arrow-right-thin"
                            style="font-size: 20px"
                        />

                        <span class="new-colony-mines">
                            <span
                                v-text="`LOCA: new Colony ${-value.planetId}`"
                                style="grid-column: 1 / span 3"
                            />

                            <span>
                                <o-building building="metal-mine" />
                                <span v-text="value.mineLevels.metalMine" />
                            </span>

                            <span>
                                <o-building building="crystal-mine" />
                                <span v-text="value.mineLevels.crystalMine" />
                            </span>

                            <span>
                                <o-building building="deuterium-synthesizer" />
                                <span
                                    v-text="
                                        value.mineLevels.deuteriumSynthesizer
                                    "
                                />
                            </span>
                        </span>
                    </div>
                    <div v-else v-text="'???'" />
                </template>

                <template #cell-cost="{ value }">
                    <div class="cost-grid">
                        <span v-text="$number(value.metal)" />
                        <span v-text="$number(value.crystal)" />
                        <span v-text="$number(value.deuterium)" />
                    </div>
                </template>
                <template #cell-costMsu="{ value }">
                    <span v-text="$number(value)" />
                </template>

                <template #cell-productionDelta="{ value }">
                    <span
                        v-text="
                            $number(
                                Math.max(
                                    value.metal,
                                    value.crystal,
                                    value.deuterium
                                )
                            )
                        "
                    />
                </template>
                <template #cell-productionDeltaMsu="{ value }">
                    <span v-text="$number(value)" />
                </template>

                <template #cell-amortizationTimeInH="{ value }">
                    <span v-text="$timespan(value * 60 * 60)" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script lang="ts">
    /* 
     * - player wide settings
     *      + MSU conversion rates
     *      + active officers
     *      + player class
     *      + alliance class
     *      + current level plasma tech
     *      + current level astrophysics
     * 
     * - checkbox for each planet (on = use in calculation)
     *      + for each planet there are the following settings
     *          = position
     *          = temperature
     *          = active items (metal/crystal/deut)
     *          = crawler settings
     *              ~ on/off
     *              ~ crawler overload
     *              ~ toggle between "fix crawler count" and "max crawler count"
     *          = current mine levels
     * 
     * - checkbox for plasma technology (on = use in calculation)
     * 
     * - checkbox to consider astrophysics (on = use in calculation)
     *      + same settings as for planets EXCEPT current mine levels
     *          = prefill temperature with avg. value based on position (see official list: https://board.de.ogame.gameforge.com/index.php?thread/193098-offizielle-planetengr%C3%B6%C3%9Fen-in-version-6-1/)
     * 
     * - max. levels for each mine, plasma tech, and astrophysics (higher = more computational expensive, defaults: [60/60/60, 28, 35])
     */

    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { CrystalMine } from '@/shared/models/ogame/buildings/CrystalMine';
    import { DeuteriumSynthesizer } from '@/shared/models/ogame/buildings/DeuteriumSynthesizer';
    import { MetalMine } from '@/shared/models/ogame/buildings/MetalMine';
    import { ProductionBuildingDependencies } from '@/shared/models/ogame/buildings/ProductionBuilding';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { addCost, Cost, subCost } from '@/shared/models/ogame/common/Cost';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import AmortizationPlanetSettingsInputs, { AmortizationPlanetSettings } from '../../../components/empire/production/amortization/AmortizationPlanetSettingsInputs.vue';
    import AmortizationPlayerSettingsInputs, { AmortizationPlayerSettings } from '../../../components/empire/production/amortization/AmortizationPlayerSettingsInputs.vue';
    import { EmpireDataModule } from '../../../data/EmpireDataModule';
    import { Astrophysics } from '@/shared/models/ogame/research/Astrophysics';
    import { PlasmaTechnology } from '@/shared/models/ogame/research/PlasmaTechnology';
    import { GridTableColumn, GridTableScrollEvent } from '../../../components/common/GridTable.vue';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { SettingsDataModule } from '../../../data/SettingsDataModule';

    interface AmortizationMaxLevels {
        mine: number;
        plasmaTechnology: number;
        astrophysics: number;
    }

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
        maxLevels: AmortizationMaxLevels;
        astrophysics: AmortizationAstrophysicsSettings;
    }

    @Component({
        components: {
            AmortizationPlanetSettingsInputs,
            AmortizationPlayerSettingsInputs,
        },
    })
    export default class ResourceProduction extends Vue {

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
        private maxLevels: AmortizationMaxLevels = {
            mine: 60,
            plasmaTechnology: 30,
            astrophysics: 37,
        };
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
                },
            },
        };
        private showPlasmaTechnology = true;


        private readonly empire = EmpireDataModule.empire;
        private amortizationItems: AmortizationItem[] = [];
        private generator: Generator<AmortizationItem, void, unknown> = null!;

        private get msuConversionRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        private mounted() {
            this.initSettings();

            this.initItems();
        }

        private initItems(): void {
            this.amortizationItems = [];

            const generationSettings = this.getAmortizationGenerationSettings();
            this.generator = this.generateAmortizationItems(generationSettings);
            this.insertNextAmortizationItems(100);
        }

        private getAmortizationGenerationSettings(): AmortizationGenerationSettings {
            const settings: AmortizationGenerationSettings = {
                player: this.playerSettings,
                planets: this.planetSettings,
                maxLevels: this.maxLevels,
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
                    acc[planet.id] = {
                        show: true,
                        id: planet.id,
                        name: planet.name,
                        maxTemperature: planet.maxTemperature,
                        coordinates: planet.coordinates,
                        position: planet.coordinates.position,
                        mineLevels: {
                            metalMine: planet.buildings.production[BuildingType.metalMine],
                            crystalMine: planet.buildings.production[BuildingType.crystalMine],
                            deuteriumSynthesizer: planet.buildings.production[BuildingType.deuteriumSynthesizer],
                        },
                        activeItems: Object.keys(planet.activeItems) as ItemHash[],
                        crawlers: {
                            enabled: true,
                            overload: empire.playerClass == PlayerClass.collector,
                            count: empire.playerClass == PlayerClass.collector ? 'max' : planet.ships[ShipType.crawler],
                        },
                    };
                    return acc;
                }, {} as Record<number, AmortizationPlanetSettings>);

            this.astrophysicsSettings = {
                show: true,
                planet: {
                    show: true,
                    id: -1,
                    name: 'LOCA: new colony',
                    position: 8,
                    maxTemperature: this.getAverageTemperature(8),
                    activeItems: [],
                    crawlers: {
                        enabled: empire.playerClass == PlayerClass.collector,
                        overload: empire.playerClass == PlayerClass.collector,
                        count: empire.playerClass == PlayerClass.collector ? 'max' : 0,
                    },
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
                    metalMine: planet.mineLevels?.metalMine ?? 0,
                    crystalMine: planet.mineLevels?.crystalMine ?? 0,
                    deuteriumSynthesizer: planet.mineLevels?.deuteriumSynthesizer ?? 0,
                };
                planetIds.push(planet.id);
            });
            const mineLevelsArray = Object.values(mineLevels);

            let newPlanets = 0;


            const itemsPerTimeout = 10;
            let curItems = 0;
            while (
                levelPlasmaTechnology < settings.maxLevels.plasmaTechnology
                || levelAstrophysics < settings.maxLevels.astrophysics
                || mineLevelsArray.some(l => l.metalMine < settings.maxLevels.mine || l.crystalMine < settings.maxLevels.mine || l.deuteriumSynthesizer < settings.maxLevels.mine)
            ) {
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

                switch (bestItem.type) {
                    case 'mine': {
                        const mine = (<Record<MineBuildingType, keyof MineLevels>>{
                            [BuildingType.metalMine]: 'metalMine',
                            [BuildingType.crystalMine]: 'crystalMine',
                            [BuildingType.deuteriumSynthesizer]: 'deuteriumSynthesizer',
                        })[bestItem.mine];
                        mineLevels[bestItem.planetId][mine] = bestItem.level;
                        break;
                    }

                    case 'plasma-technology': {
                        levelPlasmaTechnology = bestItem.level;
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

                        const fakePlanet = { buildings: { production: {}, facilities: {} } } as PlanetData;
                        planets[bestItem.newPlanetId] = this.buildProductionDependencies(bestItem.mineLevels, 0, fakePlanet, this.astrophysicsSettings.planet, settings).planet;
                        break;
                    }
                }

                yield bestItem;

                curItems++;
                if (curItems >= itemsPerTimeout) {
                    curItems = 0;
                }
            }
        }

        private getAstrophysicsAmortizationItem(levelAstrophysics: number, levelPlasmaTechnology: number, curPlanetCount: number, newPlanetId: number, settings: AmortizationGenerationSettings): AstrophysicsAmortizationItem {

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

            const fakePlanet = {
                buildings: {
                    production: {},
                    facilities: {},
                },
            } as PlanetData;

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

        private getPlasmaTechnologyAmortizationItem(mineLevels: Record<number, MineLevels>, levelPlasmaTechnology: number, settings: AmortizationGenerationSettings): PlasmaTechnologyAmortizationItem {
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

        private getMineAmortizationItem(planetId: number, mineType: MineBuildingType, levels: MineLevels, levelPlasmaTechnology: number, planet: PlanetData, planetSettings: AmortizationPlanetSettings, settings: AmortizationGenerationSettings): MineAmortizationItem {
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

        private buildProductionDependencies(levels: MineLevels, levelPlasmaTechnology: number, planet: PlanetData, planetSettings: AmortizationPlanetSettings, settings: AmortizationGenerationSettings): ProductionBuildingDependencies {
            return {
                economySpeed: 8, //TODO: eco speed from server data
                planet: {
                    ...planet,
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
                        //TODO: active items
                    },
                    buildings: {
                        production: {
                            ...planet.buildings.production,
                            [BuildingType.metalMine]: levels.metalMine,
                            [BuildingType.crystalMine]: levels.crystalMine,
                            [BuildingType.deuteriumSynthesizer]: levels.deuteriumSynthesizer,
                        },
                        facilities: planet.buildings.facilities,
                    },
                    ships: {
                        ...planet.ships,
                        [ShipType.crawler]: planetSettings.crawlers.count == 'max' ? 10_000 : planetSettings.crawlers.count,
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
            return [
                { key: 'what', size: '350px' },
                { key: 'cost', size: '3fr' },
                { key: 'costMsu', label: 'LOCA: Cost (MSU)', size: '1fr' },
                { key: 'productionDelta', label: 'LOCA: Production plus', size: '1fr' },
                { key: 'productionDeltaMsu', label: 'LOCA: Production plus (MSU)', size: '1fr' },
                { key: 'amortizationTimeInH', label: 'LOCA: Amortization time', size: '1fr' },
            ];
        }

        private get items(): AmortizationTableItem[] {
            function getWhat(item: AmortizationItem): AmortizationTableItemWhat {
                switch (item.type) {
                    case 'mine': {
                        const types: Record<MineBuildingType, AmortizationMineTableItemType> = {
                            [BuildingType.metalMine]: 'metal-mine',
                            [BuildingType.crystalMine]: 'crystal-mine',
                            [BuildingType.deuteriumSynthesizer]: 'deuterium-synthesizer',
                        };
                        const type = types[item.mine];

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
                    visible: (item.type == 'mine' && (this.planetSettings[item.planetId]?.show ?? this.astrophysicsSettings.show))
                        || (item.type == 'plasma-technology' && this.showPlasmaTechnology)
                        || (item.type == 'astrophysics-and-colony' && this.astrophysicsSettings.show),
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
            const visibleItems = items.filter(item => item.visible);

            if (visibleItems.length < 100) {
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
    }

    type AmortizationMineTableItemType = 'metal-mine' | 'crystal-mine' | 'deuterium-synthesizer';
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
        visible: boolean;
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

        &--mine {
            grid-template-columns: 1fr auto 24px;

            & > span:first-of-type {
                display: grid;
                justify-items: end;
            }
        }

        &--colony {
            grid-template-columns: repeat(4, auto);
            justify-items: start;
        }

        &--plasma-technology {
            grid-template-columns: auto 24px;
        }
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
        grid-template-rows: auto 1fr;
        height: 100%;

        &-table {
            overflow: auto;
            min-height: 300px;
        }
    }
</style>