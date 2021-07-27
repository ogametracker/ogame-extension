<template>
    <div
        v-if="localPlayerData != null && settings != null"
        class="amortisation"
    >
        <div class="options">
            <div>
                <div>LOCA: Planet</div>
                <div>
                    <select v-model.number="selectedPlanet">
                        <option
                            v-for="planet in planets"
                            :key="planet.id"
                            :value="planet.id"
                        >
                            {{ planet.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <div>LOCA: Options</div>
                <br />
                <checkbox-button
                    label="LOCA: Max. Crawlers?"
                    v-model="options.crawler"
                />
                <checkbox-button
                    label="LOCA: Crawler Overload?"
                    v-model="options.crawlerOverload"
                />
                <checkbox-button
                    label="LOCA: Current Plasmatech?"
                    v-model="options.plasmaTechnology"
                />
                <checkbox-button label="LOCA: Items?" v-model="options.items" />
                <checkbox-button
                    label="LOCA: Commandstaff?"
                    v-model="options.officers"
                />
                <checkbox-button
                    label="LOCA: Current Classes?"
                    v-model="options.classes"
                />
            </div>

            <div>
                <div>LOCA: MSU rates</div>
                <div>
                    1:{{ settings.msuConversionRates.crystal }}:{{
                        settings.msuConversionRates.deuterium
                    }}
                </div>
            </div>

            <div>
                <div>LOCA: Buildings</div>
                <br />
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

        <grid-table sticky-header :columns="cols" style="min-height: 100px;">
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
                <grid-tr v-for="(row, i) in rows" :key="i">
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
    import LocalPlayerModule, { AllianceClass, LocalPlayerData, MoonData, PlanetData, PlayerClass } from '@/store/modules/LocalPlayerModule';
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
    }

    @Component({})
    export default class EmpireAmortisation extends Vue {
        private selectedPlanet = OgameMetaData.planetId;
        private localPlayerData: LocalPlayerData = null!;
        private readonly settings = SettingsModule.settings;

        private readonly cols = ['200px', 'auto', '1fr', '1fr', '1fr', 'auto', 'auto', '1fr',];

        private readonly maxLevel = 70;

        private readonly options = {
            metalMine: true,
            crystalMine: true,
            deuteriumSynthesizer: true,

            crawler: true,
            crawlerOverload: true,
            plasmaTechnology: true,
            items: true,
            officers: true,
            classes: true,
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

        private getColorVar(color: HexColor): string {
            return hexColorToRGB(color).replace(/\s+/g, ', ');
        }

        private get rows() {
            const result: AmortisationResult[] = [];

            const currentPlanet = this.localPlayerData.planets[this.selectedPlanet];
            if (currentPlanet.isMoon) {
                return result;
            }

            const info: ProductionInject = {
                player: {
                    ...this.localPlayerData,
                    officers: {
                        commander: this.options.officers,
                        admiral: this.options.officers,
                        technocrat: this.options.officers,
                        geologist: this.options.officers,
                        engineer: this.options.officers,
                    },
                    research: {
                        ...this.localPlayerData.research,
                        [Research.plasmaTechnology]: this.options.plasmaTechnology ? this.localPlayerData.research[Research.plasmaTechnology] : 0,
                    },
                    playerClass: this.options.classes ? this.localPlayerData.playerClass : PlayerClass.none,
                    allianceClass: this.options.classes ? this.localPlayerData.allianceClass : AllianceClass.none,
                },
                currentPlanet: {
                    ...currentPlanet,
                    productionSettings: {
                        ...currentPlanet.productionSettings,
                        [Ship.crawler]: this.options.crawlerOverload ? 150 : 100,
                    },
                    ships: {
                        ...currentPlanet.ships,
                        [Ship.crawler]: this.options.crawler ? 64000 : 0,
                    }
                },
                ecoSpeed: OgameMetaData.universeSpeed,
            };

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

            const buildingTypes: ProductionBuildingType[] = [];
            if (this.options.metalMine) {
                buildingTypes.push(Building.metalMine);
            }
            if (this.options.crystalMine) {
                buildingTypes.push(Building.crystalMine);
            }
            if (this.options.deuteriumSynthesizer) {
                buildingTypes.push(Building.deuteriumSynthesizer);
            }

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

        private get planets(): PlanetData[] {
            return Object.values(this.localPlayerData.planets)
                .filter(p => !p.isMoon) as PlanetData[];
        }

        private async mounted() {
            this.localPlayerData = await LocalPlayerModule.getData();

            this.updateOptions();
        }

        private updateOptions() {
            const currentPlanet = this.localPlayerData.planets[this.selectedPlanet];
            if (currentPlanet.isMoon) {
                return;
            }

            this.options.crawler = currentPlanet.ships[Ship.crawler] > 0;
            this.options.crawlerOverload = this.localPlayerData.playerClass == PlayerClass.collector;
            this.options.items = Object.values(currentPlanet.activeItems).some(v => v != null && v > Date.now());

            const officers = this.localPlayerData.officers.commander
                || this.localPlayerData.officers.admiral
                || this.localPlayerData.officers.geologist
                || this.localPlayerData.officers.engineer
                || this.localPlayerData.officers.technocrat;
            this.options.officers = officers;
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
        grid-template-columns: repeat(2, auto);
        grid-template-rows: repeat(2, auto);
        align-items: center;
        justify-content: center;

        row-gap: 8px;
        margin-bottom: 16px;
    }

    .amortisation {
        max-height: 100%;
        display: grid;
        grid-template-rows: auto 1fr;
    }
</style>