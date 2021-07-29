<template>
    <div
        v-if="localPlayerData != null && settings != null"
        class="amortisation"
    >
        <div class="options">
            <div>LOCA: Planet</div>
            <div>
                <select v-model.number="selectedPlanet">
                    <option
                        v-for="planet in planets"
                        :key="planet.id"
                        :value="planet.id"
                    >
                        [{{ planet.coordinates.galaxy }}:{{
                            planet.coordinates.system
                        }}:{{ planet.coordinates.position }}]
                        {{ planet.name }}
                    </option>
                </select>
            </div>

            <div>LOCA: MSU rates</div>
            <div>
                1:{{ settings.msuConversionRates.crystal }}:{{
                    settings.msuConversionRates.deuterium
                }}
            </div>

            <div style="grid-column-start: 1">LOCA: Plasmatech</div>
            <div>
                <o-research type="plasma-technology" :size="32" />
                <input
                    style="width: 64px"
                    type="number"
                    v-model.number="options.plasmaTechnology"
                />
            </div>

            <div>LOCA: Crawlers</div>
            <div>
                <checkbox-button v-model="options.crawler.enabled">
                    <o-ship
                        type="crawler"
                        :size="32"
                        :disabled="!options.crawler.enabled"
                    />
                </checkbox-button>

                <checkbox-button
                    label="LOCA: Crawler Overload?"
                    :size="32"
                    :value="options.crawler.enabled && options.crawler.overload"
                    @input="
                        (value) => {
                            options.crawler.overload = value;
                            if (value) {
                                options.crawler.enabled = true;
                            }
                        }
                    "
                />
            </div>

            <div class="items-cell">LOCA: Items</div>
            <div class="items-cell">TODO</div>

            <div class="officers-cell">LOCA: Officers</div>
            <div class="officers-cell">
                <checkbox-button
                    v-for="off in options_officers"
                    :key="off"
                    v-model="options.officers[off]"
                >
                    <o-officer
                        :type="off"
                        :size="32"
                        :disabled="!options.officers[off]"
                    />
                </checkbox-button>
            </div>

            <div class="player-class-cell">LOCA: Player Class</div>
            <div class="player-class-cell">
                <checkbox-button
                    v-for="playerClass in options_playerClasses"
                    :key="playerClass"
                    :value="options.playerClass == playerClass"
                    @input="
                        () =>
                            (options.playerClass =
                                options.playerClass == playerClass
                                    ? options_playerClass_none
                                    : playerClass)
                    "
                >
                    <o-player-class
                        :type="playerClass"
                        :size="32"
                        :disabled="options.playerClass != playerClass"
                    />
                </checkbox-button>
            </div>

            <div class="alliance-class-cell">LOCA: Alliance Class</div>
            <div class="alliance-class-cell">
                <checkbox-button
                    v-for="allianceClass in options_allianceClasses"
                    :key="allianceClass"
                    :value="options.allianceClass == allianceClass"
                    @input="
                        () =>
                            (options.allianceClass =
                                options.allianceClass == allianceClass
                                    ? options_allianceClass_none
                                    : allianceClass)
                    "
                >
                    <o-alliance-class
                        :type="allianceClass"
                        :size="32"
                        :disabled="options.allianceClass != allianceClass"
                    />
                </checkbox-button>
            </div>

            <div class="buildings-cell">LOCA: Buildings</div>
            <div class="buildings-cell buttons">
                <checkbox-button
                    label="LOCA: Metallmine"
                    :color="colorMetal"
                    v-model="options.metalMine"
                />

                <checkbox-button
                    label="LOCA: Kristallmine"
                    :color="colorCrystal"
                    v-model="options.crystalMine"
                />
                <checkbox-button
                    label="LOCA: Deuterium-Synthetisierer"
                    :color="colorDeuterium"
                    v-model="options.deuteriumSynthesizer"
                />
            </div>
        </div>

        <grid-table sticky-header :columns="cols" style="min-height: 100px">
            <grid-thead>
                <grid-tr>
                    <grid-cell>LOCA: Gebäude</grid-cell>
                    <grid-cell>LOCA: Stufe</grid-cell>
                    <grid-cell>LOCA: Cost Metal</grid-cell>
                    <grid-cell>LOCA: Cost Crystal</grid-cell>
                    <grid-cell>LOCA: Cost (MSU)</grid-cell>
                    <grid-cell>LOCA: Production/h</grid-cell>
                    <grid-cell>LOCA: Production/h (MSU)</grid-cell>
                    <grid-cell>LOCA: Amortisation Time</grid-cell>
                </grid-tr>
            </grid-thead>
            <grid-tbody>
                <grid-tr
                    v-for="row in rows"
                    :key="`${row.buildingType}-${row.level}`"
                    v-show="row.visible"
                >
                    <grid-cell>
                        {{ $i18n.messages.ogame.buildings[row.buildingType] }}
                        <span
                            class="color-indicator"
                            :style="{
                                background: row.color,
                            }"
                        />
                    </grid-cell>
                    <grid-cell>{{ row.level }}</grid-cell>
                    <grid-cell>{{
                        $i18n.formatNumber(row.cost.metal)
                    }}</grid-cell>
                    <grid-cell>{{
                        $i18n.formatNumber(row.cost.crystal)
                    }}</grid-cell>
                    <grid-cell>{{ $i18n.formatNumber(row.msuCost) }}</grid-cell>
                    <grid-cell>
                        {{
                            $i18n.formatNumber(
                                Math.max(
                                    row.production.metal,
                                    row.production.crystal,
                                    row.production.deuterium
                                )
                            )
                        }}
                    </grid-cell>
                    <grid-cell>{{
                        $i18n.formatNumber(row.msuProduction)
                    }}</grid-cell>
                    <grid-cell>{{ formatTime(row.timeInHours) }}</grid-cell>
                </grid-tr>
            </grid-tbody>
        </grid-table>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import MetalMine from '@/models/ogame/buildables/buildings/MetalMine';
    import CrystalMine from '@/models/ogame/buildables/buildings/CrystalMine';
    import DeuteriumSynthesizer from '@/models/ogame/buildables/buildings/DeuteriumSynthesizer';
    import LocalPlayerModule, { AllianceClass, LocalPlayerData, MoonData, PlanetData, PlayerClass, PlayerOfficers } from '@/store/modules/LocalPlayerModule';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import Building from '@/models/Building';
    import ProductionBuilding, { ProductionInject } from '@/models/ogame/buildables/buildings/ProductionBuilding';
    import SettingsModule from '@/store/modules/SettingsModule';
    import getMsu from '@/utils/getMsu';
    import Cost from '@/models/ogame/buildables/Cost';
    import { HexColor, hexColorToRGB } from '@/utils/colors';
    import i18n from '@/i18n';
    import Ship from '@/models/Ship';
    import Research from '@/models/Research';
    import _throw from '@/utils/throw';

    type ProductionBuildingType = Building.metalMine | Building.crystalMine | Building.deuteriumSynthesizer;

    interface AmortisationResult {
        buildingType: ProductionBuildingType;
        level: number;
        timeInHours: number;
        msuCost: number;
        cost: Cost;
        production: Cost;
        msuProduction: number;
        color: HexColor;
        visible: boolean;
    }

    @Component({})
    export default class EmpireAmortisation extends Vue {
        private selectedPlanet = OgameMetaData.planetId;
        private localPlayerData: LocalPlayerData = null!;
        private readonly settings = SettingsModule.settings;

        private readonly cols = ['200px', 'auto', '1fr', '1fr', '1fr', 'auto', 'auto', '1fr',];

        private readonly maxLevel = 70;

        private readonly options_officers: (keyof PlayerOfficers)[] = ['commander', 'admiral', 'engineer', 'geologist', 'technocrat'];
        private readonly options_playerClasses: PlayerClass[] = [PlayerClass.collector, PlayerClass.discoverer, PlayerClass.general];
        private readonly options_playerClass_none = PlayerClass.none;
        private readonly options_allianceClasses: AllianceClass[] = [AllianceClass.trader, AllianceClass.researcher, AllianceClass.warrior];
        private readonly options_allianceClass_none = AllianceClass.none;


        private readonly options = {
            metalMine: true,
            crystalMine: true,
            deuteriumSynthesizer: true,

            crawler: {
                enabled: true,
                overload: true,
            },

            plasmaTechnology: 0,
            items: {
                metal: 0,
                crystal: 0,
                deuterium: 0,
            },
            officers: {
                commander: true,
                admiral: true,
                engineer: true,
                geologist: true,
                technocrat: true,
            } as Record<keyof PlayerOfficers, boolean>,
            playerClass: PlayerClass.none,
            allianceClass: AllianceClass.none,
        };

        private get colorMetal() {
            return this.settings.charts.colors.resources.metal;
        }

        private get colorCrystal() {
            return this.settings.charts.colors.resources.crystal;
        }

        private get colorDeuterium() {
            return this.settings.charts.colors.resources.deuterium;
        }

        private getProductionInject(planet: PlanetData): ProductionInject {
            return {
                player: {
                    ...this.localPlayerData,
                    officers: { ...this.options.officers },
                    research: {
                        ...this.localPlayerData.research,
                        [Research.plasmaTechnology]: this.options.plasmaTechnology,
                    },
                    playerClass: this.options.playerClass,
                    allianceClass: this.options.allianceClass,
                },
                currentPlanet: {
                    ...planet,
                    productionSettings: {
                        [Building.metalMine]: 100,
                        [Building.crystalMine]: 100,
                        [Building.deuteriumSynthesizer]: 100,
                        [Building.solarPlant]: 100,
                        [Building.fusionReactor]: 100,
                        [Ship.solarSatellite]: 100,
                        [Ship.crawler]: this.options.crawler.overload ? 150 : 100,
                    },
                    ships: {
                        ...planet.ships,
                        [Ship.crawler]: this.options.crawler.enabled ? 64000 : 0,
                    }
                },
                ecoSpeed: OgameMetaData.universeSpeed,
            };
        }

        private get rows() {
            const result: AmortisationResult[] = [];

            const currentPlanet = this.localPlayerData.planets[this.selectedPlanet];
            if (currentPlanet.isMoon) {
                return result;
            }

            const info = this.getProductionInject(currentPlanet);

            const levels: Record<ProductionBuildingType, number> = {
                [Building.metalMine]: currentPlanet.buildings.production[Building.metalMine],
                [Building.crystalMine]: currentPlanet.buildings.production[Building.crystalMine],
                [Building.deuteriumSynthesizer]: currentPlanet.buildings.production[Building.deuteriumSynthesizer],
            };
            const buildings: Record<ProductionBuildingType, ProductionBuilding> = {
                [Building.metalMine]: MetalMine,
                [Building.crystalMine]: CrystalMine,
                [Building.deuteriumSynthesizer]: DeuteriumSynthesizer,
            };

            const buildingTypes: ProductionBuildingType[] = [Building.metalMine, Building.crystalMine, Building.deuteriumSynthesizer];

            const colors: Record<ProductionBuildingType, HexColor> = {
                [Building.metalMine]: this.colorMetal,
                [Building.crystalMine]: this.colorCrystal,
                [Building.deuteriumSynthesizer]: this.colorDeuterium,
            };

            //eslint-disable-next-line no-constant-condition
            while (true) {
                let best: AmortisationResult = {
                    buildingType: null!,
                    level: null!,
                    timeInHours: Number.MAX_VALUE,
                    cost: null!,
                    production: null!,
                    msuCost: null!,
                    msuProduction: null!,
                    color: null!,
                    visible: false,
                };

                for (const buildingType of buildingTypes) {
                    const building = buildings[buildingType];
                    const level = levels[buildingType] + 1;
                    if (level > this.maxLevel) {
                        continue;
                    }

                    const cost = building.getCost(level);
                    const msuCost = getMsu(cost, this.settings.msuConversionRates);

                    const production = building.getProduction(level, info);
                    const msuProduction = getMsu(production, this.settings.msuConversionRates);

                    const timeInHours = msuCost / msuProduction;
                    if (timeInHours < best.timeInHours) {
                        best = {
                            buildingType,
                            level,
                            timeInHours,
                            cost,
                            production,
                            msuCost,
                            msuProduction,
                            color: colors[buildingType],
                            visible: this.isVisibleBuilding(buildingType),
                        };
                    }
                }

                if (best.buildingType == null) {
                    break;
                }

                levels[best.buildingType]++;
                result.push(best);
            }

            return result;
        }

        private isVisibleBuilding(buildingType: Building): boolean {
            switch (buildingType) {
                case Building.metalMine: return this.options.metalMine;
                case Building.crystalMine: return this.options.crystalMine;
                case Building.deuteriumSynthesizer: return this.options.deuteriumSynthesizer;

                default: throw new Error('invalid building');
            }
        }

        private get planets(): PlanetData[] {
            return Object.values(this.localPlayerData.planets)
                .filter(p => !p.isMoon) as PlanetData[];
        }

        private async mounted() {
            this.localPlayerData = await LocalPlayerModule.getData();

            this.initOptions();
        }

        private initOptions() {
            let currentPlanet = this.localPlayerData.planets[this.selectedPlanet];
            if (currentPlanet.isMoon) {
                const planets = Object.values(this.localPlayerData.planets);
                const newSelection = planets.find(p => !p.isMoon
                    && p.coordinates.galaxy == currentPlanet.coordinates.galaxy
                    && p.coordinates.system == currentPlanet.coordinates.system
                    && p.coordinates.position == currentPlanet.coordinates.position
                ) as PlanetData ?? _throw('no planet found for moon');

                this.selectedPlanet = newSelection.id;
                currentPlanet = newSelection;
            }

            this.options.crawler.enabled = currentPlanet.ships[Ship.crawler] > 0;
            this.options.crawler.overload = this.options.crawler.enabled && this.localPlayerData.playerClass == PlayerClass.collector;

            this.options.playerClass = this.localPlayerData.playerClass;
            this.options.allianceClass = this.localPlayerData.allianceClass;
            this.options.plasmaTechnology = this.localPlayerData.research[Research.plasmaTechnology];

            //this.options.items = Object.values(currentPlanet.activeItems).some(v => v != null && v > Date.now());

            this.options.officers.commander = this.localPlayerData.officers.commander;
            this.options.officers.admiral = this.localPlayerData.officers.admiral;
            this.options.officers.geologist = this.localPlayerData.officers.geologist;
            this.options.officers.engineer = this.localPlayerData.officers.engineer;
            this.options.officers.technocrat = this.localPlayerData.officers.technocrat;
        }

        private formatTime(timeInHours: number) {
            let totalTime = Math.ceil(timeInHours * 60 * 60);

            const seconds = totalTime % 60;
            totalTime = (totalTime - seconds) / 60;

            const minutes = totalTime % 60;
            totalTime = (totalTime - minutes) / 60;

            const hours = totalTime % 24;
            totalTime = (totalTime - hours) / 24;

            const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}`;
            if (totalTime == 0) {
                return time;
            }

            const days = totalTime % 7;
            totalTime = (totalTime - days) / 7;

            const timeWithDays = `${days}d ` + time;
            if (totalTime == 0) {
                return timeWithDays;
            }

            const weeks = totalTime;

            return `${i18n.formatNumber(weeks)}w ` + timeWithDays;
        }
    }
</script>

<style lang="scss" scoped>
    .color-indicator {
        height: 8px;
        width: 8px;
        display: inline-block;
        border-radius: 4px;
        margin-left: 4px;
        margin-bottom: 2px;
    }

    .options {
        justify-content: start;
        display: inline-grid;
        grid-template-columns: repeat(6, auto);
        align-items: center;

        row-gap: 8px;
        margin-bottom: 16px;

        & > div {
            display: flex;
            padding: 0 8px;
        }
    }

    .amortisation {
        max-height: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
    }

    .items-cell {
        grid-row: 3 / span 3;
        height: 100%;
    }

    .officers-cell {
        grid-row: 3;
    }

    .player-class-cell {
        grid-row: 4;
    }

    .alliance-class-cell {
        grid-row: 5;
    }

    .buildings-cell {
        grid-row: 6;

        &.buttons {
            grid-column: 2 / span 5;
        }
    }
</style>