<template>
    <div
        v-if="localPlayerData != null && settings != null"
        class="amortisation"
    >
        <div class="options">
            <div>
                {{
                    $extension.$t.empire.amortisation.selectedPlanet
                }}
            </div>
            <div>
                <select
                    v-model.number="selectedPlanet"
                    @change="updateOptions()"
                >
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

            <div>
                {{ $extension.$t.empire.amortisation.msuRates }}
            </div>
            <div>
                <o-resource type="metal" :size="32" />
                <input
                    type="number"
                    value="1"
                    readonly
                    style="
                        width: 64px;
                        background-color: transparent !important;
                    "
                />

                <o-resource type="crystal" :size="32" />
                <input
                    style="width: 64px"
                    type="number"
                    min="1"
                    max="3"
                    step="0.01"
                    :value="settings.msuConversionRates.crystal"
                    v-debounce:150ms="
                        val => {
                            settings.msuConversionRates.crystal = Math.clamp(
                                parseFloat(val),
                                1,
                                3
                            );
                            saveSettings();
                        }
                    "
                />

                <o-resource type="deuterium" :size="32" />
                <input
                    style="width: 64px"
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    :value="settings.msuConversionRates.deuterium"
                    v-debounce:150ms="
                        val => {
                            settings.msuConversionRates.deuterium = Math.clamp(
                                parseFloat(val),
                                1,
                                5
                            );
                            saveSettings();
                        }
                    "
                />
            </div>

            <div class="next-row">
                {{ $extension.$t.empire.amortisation.temperature }}
            </div>
            <div>
                <span>
                    <input
                        type="number"
                        min="-130"
                        max="260"
                        step="1"
                        :value="options.temperature"
                        v-debounce:150ms="
                            val =>
                                (options.temperature = Math.clamp(
                                    parseInt(val, 10),
                                    -130,
                                    260
                                ))
                        "
                        style="width: 64px;"
                    />
                    °C
                </span>
            </div>

            <div>
                {{ $extension.$t.empire.amortisation.position }}
            </div>
            <div>
                <input
                    type="number"
                    min="1"
                    max="15"
                    step="1"
                    :value="options.position"
                    v-debounce:150ms="
                        val =>
                            (options.position = Math.clamp(
                                parseInt(val, 10),
                                1,
                                15
                            ))
                    "
                    style="width: 64px;"
                />
            </div>

            <div class="next-row items-cell">
                {{ $extension.$t.empire.amortisation.items }}
            </div>
            <div class="items-cell item-selection">
                <checkbox-button
                    v-for="item in options_metalBoost"
                    :key="item.itemHash"
                    :value="options.items.metal == item.value"
                    @input="
                        options.items.metal =
                            options.items.metal == item.value ? 0 : item.value
                    "
                >
                    <o-item
                        :item="item.itemHash"
                        :size="32"
                        :disabled="options.items.metal != item.value"
                    />
                </checkbox-button>

                <checkbox-button
                    v-for="item in options_crystalBoost"
                    :key="item.itemHash"
                    :value="options.items.crystal == item.value"
                    @input="
                        options.items.crystal =
                            options.items.crystal == item.value ? 0 : item.value
                    "
                >
                    <o-item
                        :item="item.itemHash"
                        :size="32"
                        :disabled="options.items.crystal != item.value"
                    />
                </checkbox-button>

                <checkbox-button
                    v-for="item in options_deuteriumBoost"
                    :key="item.itemHash"
                    :value="options.items.deuterium == item.value"
                    @input="
                        options.items.deuterium =
                            options.items.deuterium == item.value
                                ? 0
                                : item.value
                    "
                >
                    <o-item
                        :item="item.itemHash"
                        :size="32"
                        :disabled="options.items.deuterium != item.value"
                    />
                </checkbox-button>
            </div>

            <div class="next-row-indented officers-cell">
                {{ $extension.$t.empire.amortisation.officers }}
            </div>
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

            <div class="next-row-indented player-class-cell">
                {{ $extension.$t.empire.amortisation.playerClass }}
            </div>
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

            <div class="next-row-indented alliance-class-cell">
                {{ $extension.$t.empire.amortisation.allianceClass }}
            </div>
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

            <div class="next-row">
                {{ $ogame.$t.ships[217] }}
            </div>
            <div>
                <checkbox-button v-model="options.crawler.enabled">
                    <o-ship
                        type="crawler"
                        :size="32"
                        :disabled="!options.crawler.enabled"
                    />
                </checkbox-button>

                <checkbox-button
                    :label="
                        $extension.$t.empire.amortisation
                            .crawlerOverload
                    "
                    color="#409e2b"
                    :size="32"
                    :value="options.crawler.enabled && options.crawler.overload"
                    @input="
                        value => {
                            options.crawler.overload = value;
                            if (value) {
                                options.crawler.enabled = true;
                            }
                        }
                    "
                />
            </div>

            <div>
                {{ $ogame.$t.research[122] }}
            </div>
            <div>
                <o-research type="plasma-technology" :size="32" />
                <input
                    style="width: 64px"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    :value="options.plasmaTechnology"
                    v-debounce:150ms="
                        val =>
                            (options.plasmaTechnology = Math.clamp(
                                parseInt(val, 10),
                                0,
                                100
                            ))
                    "
                />
            </div>

            <div class="next-row" />
            <div>
                <checkbox-button
                    :label="
                        options.crawler.maxCrawler
                            ? $extension.$t.empire.amortisation
                                  .crawlerMode.max
                            : $extension.$t.empire.amortisation
                                  .crawlerMode.fixed
                    "
                    color="#409e2b"
                    :auto-color="!options.crawler.maxCrawler"
                    :size="32"
                    :value="true"
                    @input="
                        options.crawler.maxCrawler = !options.crawler.maxCrawler
                    "
                    class="crawler-mode"
                    :class="{ fix: !options.crawler.maxCrawler }"
                />
                <input
                    type="number"
                    min="0"
                    max="5000"
                    step="1"
                    class="crawler-count-input"
                    :disabled="options.crawler.maxCrawler"
                    :value="options.crawler.count"
                    v-debounce:150ms="
                        val =>
                            (options.crawler.count = Math.clamp(
                                parseInt(val, 10),
                                0,
                                5000
                            ))
                    "
                    :style="{
                        border: options.crawler.maxCrawler
                            ? null
                            : '1px solid rgb(var(--color)) !important'
                    }"
                />
            </div>

            <div class="buildings-config">
                <div />
                <div v-text="$ogame.$t.buildings[1]" />
                <div v-text="$ogame.$t.buildings[2]" />
                <div v-text="$ogame.$t.buildings[3]" />

                <div
                    v-text="$extension.$t.empire.amortisation.level"
                    class="row-header"
                />
                <div>
                    <input
                        type="number"
                        min="0"
                        max="70"
                        step="1"
                        :value="options.levelMetalMine"
                        v-debounce:150ms="
                            val =>
                                (options.levelMetalMine = Math.clamp(
                                    parseInt(val, 10),
                                    0,
                                    70
                                ))
                        "
                    />
                </div>
                <div>
                    <input
                        type="number"
                        min="0"
                        max="70"
                        step="1"
                        :value="options.levelCrystalMine"
                        v-debounce:150ms="
                            val =>
                                (options.levelCrystalMine = Math.clamp(
                                    parseInt(val, 10),
                                    0,
                                    70
                                ))
                        "
                    />
                </div>
                <div>
                    <input
                        type="number"
                        min="0"
                        max="70"
                        step="1"
                        :value="options.levelDeuteriumSynthesizer"
                        v-debounce:150ms="
                            val =>
                                (options.levelDeuteriumSynthesizer = Math.clamp(
                                    parseInt(val, 10),
                                    0,
                                    70
                                ))
                        "
                    />
                </div>

                <div
                    v-text="
                        $extension.$t.empire.amortisation
                            .showBuilding
                    "
                    class="row-header"
                />
                <checkbox-button
                    :label="
                        options.showMetalMine
                            ? $extension.$t.empire.amortisation.yes
                            : $extension.$t.empire.amortisation.no
                    "
                    :color="colorMetal"
                    v-model="options.showMetalMine"
                />
                <checkbox-button
                    :label="
                        options.showCrystalMine
                            ? $extension.$t.empire.amortisation.yes
                            : $extension.$t.empire.amortisation.no
                    "
                    :color="colorCrystal"
                    v-model="options.showCrystalMine"
                />
                <checkbox-button
                    :label="
                        options.showDeuteriumSynthesizer
                            ? $extension.$t.empire.amortisation.yes
                            : $extension.$t.empire.amortisation.no
                    "
                    :color="colorDeuterium"
                    v-model="options.showDeuteriumSynthesizer"
                />
            </div>
        </div>

        <grid-table sticky-header :columns="cols" style="min-height: 100px">
            <grid-thead>
                <grid-tr>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableBuilding
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableLevel
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableCost
                        }}
                        <o-resource
                            type="metal"
                            :size="24"
                            style="margin-left: 4px"
                        />
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableCost
                        }}
                        <o-resource
                            type="crystal"
                            :size="24"
                            style="margin-left: 4px"
                        />
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableCostMsu
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableProduction
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableProductionMsu
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $extension.$t.empire.amortisation
                                .tableAmortisationTime
                        }}
                    </grid-cell>
                </grid-tr>
            </grid-thead>
            <grid-tbody>
                <template v-for="row in rows">
                    <grid-tr
                        v-if="row.visible"
                        :key="`${row.buildingType}-${row.level}`"
                    >
                        <grid-cell>
                            {{
                                $ogame.$t.buildings[row.buildingType]
                            }}
                            <span
                                class="color-indicator"
                                :style="{
                                    background: row.color
                                }"
                            />
                        </grid-cell>
                        <grid-cell>{{ row.level }}</grid-cell>
                        <grid-cell>{{
                            $extension.$n(row.cost.metal)
                        }}</grid-cell>
                        <grid-cell>{{
                            $extension.$n(row.cost.crystal)
                        }}</grid-cell>
                        <grid-cell>{{
                            $extension.$n(row.msuCost)
                        }}</grid-cell>
                        <grid-cell>
                            {{
                                $extension.$n(
                                    Math.max(
                                        row.production.metal,
                                        row.production.crystal,
                                        row.production.deuterium
                                    )
                                )
                            }}
                        </grid-cell>
                        <grid-cell>{{
                            $extension.$n(row.msuProduction)
                        }}</grid-cell>
                        <grid-cell>{{ formatTime(row.timeInHours) }}</grid-cell>
                    </grid-tr>
                </template>
            </grid-tbody>
        </grid-table>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import MetalMine from '@/models/ogame/buildables/buildings/MetalMine';
    import CrystalMine from '@/models/ogame/buildables/buildings/CrystalMine';
    import DeuteriumSynthesizer from '@/models/ogame/buildables/buildings/DeuteriumSynthesizer';
    import LocalPlayerModule, { AllianceClass, LocalPlayerData, PlanetData, PlayerClass, PlayerOfficers } from '@/store/modules/LocalPlayerModule';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import Building from '@/models/Building';
    import ProductionBuilding, { ProductionInject } from '@/models/ogame/buildables/buildings/ProductionBuilding';
    import SettingsModule from '@/store/modules/SettingsModule';
    import getMsu from '@/utils/getMsu';
    import Cost from '@/models/ogame/buildables/Cost';
    import { HexColor } from '@/utils/colors';
    import i18n from '@/i18n';
    import Ship from '@/models/Ship';
    import Research from '@/models/Research';
    import _throw from '@/utils/throw';
    import { ItemHash } from '@/models/items';
    import PlanetType from '@/models/PlanetType';

    type ProductionBuildingType = Building.metalMine | Building.crystalMine | Building.deuteriumSynthesizer;

    type ItemBoost = 0 | 10 | 20 | 30 | 40;

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
        private readonly Items = ItemHash;

        private selectedPlanet = OgameMetaData.planetId;
        private localPlayerData: LocalPlayerData = null!;
        private readonly settings = SettingsModule.settings;

        private async saveSettings() {
            await SettingsModule.save();
        }

        private readonly cols = ['250px', '60px', '1fr', '1fr', '1fr', '1fr', '1fr', '1fr',];

        private readonly maxLevel = 70;

        private readonly options_officers: (keyof PlayerOfficers)[] = ['commander', 'admiral', 'engineer', 'geologist', 'technocrat'];
        private readonly options_playerClasses: PlayerClass[] = [PlayerClass.collector, PlayerClass.discoverer, PlayerClass.general];
        private readonly options_playerClass_none = PlayerClass.none;
        private readonly options_allianceClasses: AllianceClass[] = [AllianceClass.trader, AllianceClass.researcher, AllianceClass.warrior];
        private readonly options_allianceClass_none = AllianceClass.none;

        private readonly options_metalBoost = [
            {
                itemHash: ItemHash.metalBooster_bronze_7days,
                value: 10,
            },
            {
                itemHash: ItemHash.metalBooster_silver_7days,
                value: 20,
            },
            {
                itemHash: ItemHash.metalBooster_gold_7days,
                value: 30,
            },
            {
                itemHash: ItemHash.metalBooster_platinum_7days,
                value: 40,
            }
        ];

        private readonly options_crystalBoost = [
            {
                itemHash: ItemHash.crystalBooster_bronze_7days,
                value: 10,
            },
            {
                itemHash: ItemHash.crystalBooster_silver_7days,
                value: 20,
            },
            {
                itemHash: ItemHash.crystalBooster_gold_7days,
                value: 30,
            },
            {
                itemHash: ItemHash.crystalBooster_platinum_7days,
                value: 40,
            }
        ];

        private readonly options_deuteriumBoost = [
            {
                itemHash: ItemHash.deuteriumBooster_bronze_7days,
                value: 10,
            },
            {
                itemHash: ItemHash.deuteriumBooster_silver_7days,
                value: 20,
            },
            {
                itemHash: ItemHash.deuteriumBooster_gold_7days,
                value: 30,
            },
            {
                itemHash: ItemHash.deuteriumBooster_platinum_7days,
                value: 40,
            }
        ];

        private readonly options = {
            showMetalMine: true,
            showCrystalMine: true,
            showDeuteriumSynthesizer: true,
            levelMetalMine: 0,
            levelCrystalMine: 0,
            levelDeuteriumSynthesizer: 0,

            crawler: {
                enabled: true,
                overload: true,
                maxCrawler: true,
                count: 0,
            },

            plasmaTechnology: 0,
            items: {
                metal: 0 as ItemBoost,
                crystal: 0 as ItemBoost,
                deuterium: 0 as ItemBoost,
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
            temperature: 0,
            position: 1,
        };

        private get currentPlanet() {
            return this.planets.find(p => p.id == this.selectedPlanet) ?? _throw('invalid planet selected');
        }

        private updateOptions() {
            const planet = this.currentPlanet;

            this.options.crawler.enabled = planet.ships[Ship.crawler] > 0;
            this.options.crawler.overload = this.options.crawler.enabled && this.localPlayerData.playerClass == PlayerClass.collector;
            this.options.crawler.maxCrawler = this.localPlayerData.playerClass == PlayerClass.collector;
            this.options.crawler.count = planet.ships[Ship.crawler];

            this.options.playerClass = this.localPlayerData.playerClass;
            this.options.allianceClass = this.localPlayerData.allianceClass;
            this.options.plasmaTechnology = this.localPlayerData.research[Research.plasmaTechnology];

            this.options.items = {
                metal: this.getActiveMetalBoost(planet.activeItems),
                crystal: this.getActiveCrystalBoost(planet.activeItems),
                deuterium: this.getActiveDeuteriumBoost(planet.activeItems),
            };

            this.options.officers.commander = this.localPlayerData.officers.commander;
            this.options.officers.admiral = this.localPlayerData.officers.admiral;
            this.options.officers.geologist = this.localPlayerData.officers.geologist;
            this.options.officers.engineer = this.localPlayerData.officers.engineer;
            this.options.officers.technocrat = this.localPlayerData.officers.technocrat;

            this.options.position = planet.coordinates.position;
            this.options.temperature = planet.maxTemperature;


            this.options.levelMetalMine = planet.buildings.production[Building.metalMine];
            this.options.levelCrystalMine = planet.buildings.production[Building.crystalMine];
            this.options.levelDeuteriumSynthesizer = planet.buildings.production[Building.deuteriumSynthesizer];
        }

        private get colorMetal() {
            return this.settings.charts.colors.resources.metal;
        }

        private get colorCrystal() {
            return this.settings.charts.colors.resources.crystal;
        }

        private get colorDeuterium() {
            return this.settings.charts.colors.resources.deuterium;
        }

        private getProductionInject(): ProductionInject {
            const planet = this.currentPlanet;

            const year = 1000 * 60 * 60 * 24 * 52;
            const items: Partial<Record<ItemHash, number>> = {};
            if (this.options.items.metal > 0) {
                const item = this.options_metalBoost.find(p => p.value == this.options.items.metal)?.itemHash ?? _throw('invalid metal boost');
                items[item] = Date.now() + year;
            }
            if (this.options.items.crystal > 0) {
                const item = this.options_crystalBoost.find(p => p.value == this.options.items.crystal)?.itemHash ?? _throw('invalid crystal boost');
                items[item] = Date.now() + year;
            }
            if (this.options.items.deuterium > 0) {
                const item = this.options_deuteriumBoost.find(p => p.value == this.options.items.deuterium)?.itemHash ?? _throw('invalid deuterium boost');
                items[item] = Date.now() + year;
            }

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
                    isMoon: false,
                    id: -1,
                    name: '',
                    defense: { ...planet.defense },
                    coordinates: {
                        galaxy: 1,
                        system: 1,
                        type: PlanetType.planet,
                        position: this.options.position,
                    },
                    maxTemperature: this.options.temperature,
                    buildings: {
                        production: {
                            ...planet.buildings.production,
                            [Building.metalMine]: this.options.levelMetalMine,
                            [Building.crystalMine]: this.options.levelCrystalMine,
                            [Building.deuteriumSynthesizer]: this.options.levelDeuteriumSynthesizer,
                            [Building.solarPlant]: 100,
                            [Building.fusionReactor]: 100,
                        },
                        facilities: { ...planet.buildings.facilities },
                    },
                    activeItems: items,
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
                        [Ship.crawler]: this.options.crawler.enabled
                            ? this.options.crawler.maxCrawler
                                ? 64000
                                : this.options.crawler.count
                            : 0,
                    }
                },
                ecoSpeed: OgameMetaData.universeSpeed,
            };
        }

        private get rows() {
            const result: AmortisationResult[] = [];
            const info = this.getProductionInject();

            const levels: Record<ProductionBuildingType, number> = {
                [Building.metalMine]: info.currentPlanet.buildings.production[Building.metalMine],
                [Building.crystalMine]: info.currentPlanet.buildings.production[Building.crystalMine],
                [Building.deuteriumSynthesizer]: info.currentPlanet.buildings.production[Building.deuteriumSynthesizer],
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
                    const msuCost = Math.round(getMsu(cost, this.settings.msuConversionRates));

                    const production = building.getProduction(level, info);
                    const msuProduction = Math.round(getMsu(production, this.settings.msuConversionRates));

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
                info.currentPlanet.buildings.production[best.buildingType]++;

                result.push(best);
            }

            return result;
        }

        private isVisibleBuilding(buildingType: Building): boolean {
            switch (buildingType) {
                case Building.metalMine: return this.options.showMetalMine;
                case Building.crystalMine: return this.options.showCrystalMine;
                case Building.deuteriumSynthesizer: return this.options.showDeuteriumSynthesizer;

                default: throw new Error('invalid building');
            }
        }

        private get planets(): PlanetData[] {
            return Object.values(this.localPlayerData.planets)
                .filter(p => !p.isMoon) as PlanetData[];
        }

        private async mounted() {
            this.localPlayerData = await LocalPlayerModule.getData();

            this.initPlanetSelection();
            this.updateOptions();
        }

        private initPlanetSelection() {
            const currentPlanet = this.localPlayerData.planets[this.selectedPlanet];
            if (currentPlanet.isMoon) {
                const planets = Object.values(this.localPlayerData.planets);
                const newSelection = planets.find(p => !p.isMoon
                    && p.coordinates.galaxy == currentPlanet.coordinates.galaxy
                    && p.coordinates.system == currentPlanet.coordinates.system
                    && p.coordinates.position == currentPlanet.coordinates.position
                ) as PlanetData ?? _throw('no planet found for moon');

                this.selectedPlanet = newSelection.id;
            }
        }

        private getActiveMetalBoost(activeItems: Partial<Record<ItemHash, number | undefined>>): ItemBoost {
            const now = Date.now();

            if ((activeItems[ItemHash.metalBooster_platinum_7days] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_platinum_30days] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_platinum_90days] ?? 0) > now
            ) {
                return 40;
            }

            if ((activeItems[ItemHash.metalBooster_gold_7days] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_gold_30days] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_gold_90days] ?? 0) > now
            ) {
                return 30;
            }

            if ((activeItems[ItemHash.metalBooster_silver_7days] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_silver_30days] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_silver_90days] ?? 0) > now
            ) {
                return 20;
            }

            if ((activeItems[ItemHash.metalBooster_bronze_1day] ?? 0) > now
                || (activeItems[ItemHash.metalBooster_bronze_7days] ?? 0) > now
            ) {
                return 10;
            }

            return 0;
        }

        private getActiveCrystalBoost(activeItems: Partial<Record<ItemHash, number | undefined>>): ItemBoost {
            const now = Date.now();

            if ((activeItems[ItemHash.crystalBooster_platinum_7days] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_platinum_30days] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_platinum_90days] ?? 0) > now
            ) {
                return 40;
            }

            if ((activeItems[ItemHash.crystalBooster_gold_7days] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_gold_30days] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_gold_90days] ?? 0) > now
            ) {
                return 30;
            }

            if ((activeItems[ItemHash.crystalBooster_silver_7days] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_silver_30days] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_silver_90days] ?? 0) > now
            ) {
                return 20;
            }

            if ((activeItems[ItemHash.crystalBooster_bronze_1day] ?? 0) > now
                || (activeItems[ItemHash.crystalBooster_bronze_7days] ?? 0) > now
            ) {
                return 10;
            }

            return 0;
        }

        private getActiveDeuteriumBoost(activeItems: Partial<Record<ItemHash, number | undefined>>): ItemBoost {
            const now = Date.now();

            if ((activeItems[ItemHash.deuteriumBooster_platinum_7days] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_platinum_30days] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_platinum_90days] ?? 0) > now
            ) {
                return 40;
            }

            if ((activeItems[ItemHash.deuteriumBooster_gold_7days] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_gold_30days] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_gold_90days] ?? 0) > now
            ) {
                return 30;
            }

            if ((activeItems[ItemHash.deuteriumBooster_silver_7days] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_silver_30days] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_silver_90days] ?? 0) > now
            ) {
                return 20;
            }

            if ((activeItems[ItemHash.deuteriumBooster_bronze_1day] ?? 0) > now
                || (activeItems[ItemHash.deuteriumBooster_bronze_7days] ?? 0) > now
            ) {
                return 10;
            }

            return 0;
        }

        private formatTime(timeInHours: number) {
            let totalTime = BigInt(Math.ceil(timeInHours * 60 * 60));

            const seconds = totalTime % 60n;
            totalTime = (totalTime - seconds) / 60n;

            const minutes = totalTime % 60n;
            totalTime = (totalTime - minutes) / 60n;

            const hours = totalTime % 24n;
            totalTime = (totalTime - hours) / 24n;

            const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (totalTime == 0n) {
                return time;
            }

            const days = totalTime % 7n;
            totalTime = (totalTime - days) / 7n;

            const timeWithDays = `${days}d ` + time;
            if (totalTime == 0n) {
                return timeWithDays;
            }

            const weeks = totalTime;

            return `${this.$extension.$n(Number(weeks))}w ` + timeWithDays;
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
        grid-template-columns: repeat(4, auto);
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
        height: 100%;
        grid-row: auto / span 3;

        &.item-selection {
            display: grid;
            grid-template-columns: repeat(4, max-content);
            grid-template-rows: repeat(4, max-content);
            row-gap: 3px;
        }
    }

    .crawler-mode {
        margin-right: 0 !important;
        width: 120px;
        text-align: center;

        &.fix {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    .crawler-count-input {
        width: 80px;
        height: 32px;

        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;

        &:disabled {
            background: transparent !important;
            color: grey !important;
        }
    }

    .next-row {
        grid-column-start: 1;
    }

    .next-row-indented {
        grid-column-start: 3;
    }

    .buildings-config {
        grid-column: auto / span 4;
        border-top: 1px solid rgba(var(--color), 0.5);

        display: grid !important;
        grid-template-columns: auto repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        align-items: center;
        justify-items: center;

        row-gap: 2px;

        .row-header {
            justify-self: end;
        }

        .checkbox-button {
            width: 64px;
            text-align: center;
        }

        input[type="number"] {
            width: 64px;
        }
    }
</style>