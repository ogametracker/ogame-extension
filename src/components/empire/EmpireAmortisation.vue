<template>
    <div
        v-if="localPlayerData != null && settings != null"
        class="amortisation"
    >
        <div class="options">
            <div>
                {{
                    $i18n.messages.extension.empire.amortisation.selectedPlanet
                }}
            </div>
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

            <div>
                {{ $i18n.messages.extension.empire.amortisation.msuRates }}
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
                        (val) => {
                            settings.msuConversionRates.crystal = Math.clamp(
                                parseFloat(val, 10),
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
                        (val) => {
                            settings.msuConversionRates.deuterium = Math.clamp(
                                parseFloat(val, 10),
                                1,
                                3
                            );
                            saveSettings();
                        }
                    "
                />
            </div>

            <div style="grid-column-start: 1">
                {{ $i18n.messages.ogame.research[122] }}
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
                        (val) =>
                            (options.plasmaTechnology = Math.clamp(
                                parseInt(val, 10),
                                0,
                                100
                            ))
                    "
                />
            </div>

            <div>
                {{ $i18n.messages.ogame.ships[217] }}
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
                        $i18n.messages.extension.empire.amortisation
                            .crawlerOverload
                    "
                    color="#409e2b"
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

            <div class="items-cell">
                {{ $i18n.messages.extension.empire.amortisation.items }}
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

            <div class="officers-cell">
                {{ $i18n.messages.extension.empire.amortisation.officers }}
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

            <div class="player-class-cell">
                {{ $i18n.messages.extension.empire.amortisation.playerClass }}
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

            <div class="alliance-class-cell">
                {{ $i18n.messages.extension.empire.amortisation.allianceClass }}
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

            <div class="buildings-cell">
                {{ $i18n.messages.extension.empire.amortisation.buildings }}
            </div>
            <div class="buildings-cell buttons">
                <checkbox-button
                    :label="$i18n.messages.ogame.buildings[1]"
                    :color="colorMetal"
                    v-model="options.metalMine"
                />

                <checkbox-button
                    :label="$i18n.messages.ogame.buildings[2]"
                    :color="colorCrystal"
                    v-model="options.crystalMine"
                />
                <checkbox-button
                    :label="$i18n.messages.ogame.buildings[3]"
                    :color="colorDeuterium"
                    v-model="options.deuteriumSynthesizer"
                />
            </div>
        </div>

        <grid-table sticky-header :columns="cols" style="min-height: 100px">
            <grid-thead>
                <grid-tr>
                    <grid-cell>
                        {{
                            $i18n.messages.extension.empire.amortisation
                                .tableBuilding
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $i18n.messages.extension.empire.amortisation
                                .tableLevel
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $i18n.messages.extension.empire.amortisation
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
                            $i18n.messages.extension.empire.amortisation
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
                            $i18n.messages.extension.empire.amortisation
                                .tableCostMsu
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $i18n.messages.extension.empire.amortisation
                                .tableProduction
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $i18n.messages.extension.empire.amortisation
                                .tableProductionMsu
                        }}
                    </grid-cell>
                    <grid-cell>
                        {{
                            $i18n.messages.extension.empire.amortisation
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
                                $i18n.messages.ogame.buildings[row.buildingType]
                            }}
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
                        <grid-cell>{{
                            $i18n.formatNumber(row.msuCost)
                        }}</grid-cell>
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
    import LocalPlayerModule, { AllianceClass, LocalPlayerData, MoonData, PlanetData, PlayerClass, PlayerOfficers } from '@/store/modules/LocalPlayerModule';
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

        private readonly cols = ['200px', 'auto', '1fr', '1fr', '1fr', 'auto', 'auto', '1fr',];

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
            metalMine: true,
            crystalMine: true,
            deuteriumSynthesizer: true,

            crawler: {
                enabled: true,
                overload: true,
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
                    ...planet,
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

            this.options.items = {
                metal: this.getActiveMetalBoost(currentPlanet.activeItems),
                crystal: this.getActiveCrystalBoost(currentPlanet.activeItems),
                deuterium: this.getActiveDeuteriumBoost(currentPlanet.activeItems),
            };

            this.options.officers.commander = this.localPlayerData.officers.commander;
            this.options.officers.admiral = this.localPlayerData.officers.admiral;
            this.options.officers.geologist = this.localPlayerData.officers.geologist;
            this.options.officers.engineer = this.localPlayerData.officers.engineer;
            this.options.officers.technocrat = this.localPlayerData.officers.technocrat;
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

            return `${i18n.formatNumber(Number(weeks))}w ` + timeWithDays;
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

        &.item-selection {
            display: grid;
            grid-template-columns: repeat(4, max-content);
            grid-template-rows: repeat(4, max-content);
            row-gap: 3px;
        }
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