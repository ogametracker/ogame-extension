<template>
    <div v-if="localPlayerData != null && settings != null">
        <select v-model="selectedPlanet">
            <option
                v-for="planet in planets"
                :key="planet.id"
                :value="planet.id"
            >
                {{ planet.name }}
            </option>
        </select>

        <table>
            <thead>
                <tr>
                    <th>LOCA: Gebäude</th>
                    <th>LOCA: Level</th>
                    <th>LOCA: Cost Metal</th>
                    <th>LOCA: Cost Crystal</th>
                    <th>LOCA: Cost (MSU)</th>
                    <th>LOCA: Production/h</th>
                    <th>LOCA: Production/h (MSU)</th>
                    <th>LOCA: Amortisation Time</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in rows" :key="i">
                    <td>
                        {{ $i18n.messages.ogame.buildings[row.buildingType] }}
                        <span
                            class="color-indicator"
                            :style="{
                                '--color': getColorVar(row.color),
                            }"
                        />
                    </td>
                    <td>{{ row.level }}</td>
                    <td>{{ $i18n.formatNumber(row.cost.metal) }}</td>
                    <td>{{ $i18n.formatNumber(row.cost.crystal) }}</td>
                    <td>{{ $i18n.formatNumber(row.msuCost) }}</td>
                    <td>
                        {{
                            $i18n.formatNumber(
                                Math.max(
                                row.production.metal,
                                row.production.crystal,
                                row.production.deuterium
                            ))

                        }}
                    </td>
                    <td>{{ $i18n.formatNumber(row.msuProduction) }}</td>
                    <td>{{ row.rate }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import MetalMine from '@/models/ogame/buildables/buildings/MetalMine';
    import CrystalMine from '@/models/ogame/buildables/buildings/CrystalMine';
    import DeuteriumSynthesizer from '@/models/ogame/buildables/buildings/DeuteriumSynthesizer';
    import LocalPlayerModule, { LocalPlayerData, MoonData, PlanetData } from '@/store/modules/LocalPlayerModule';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import Building from '@/models/Building';
    import ProductionBuilding, { ProductionInject } from '@/models/ogame/buildables/buildings/ProductionBuilding';
    import SettingsModule from '@/store/modules/SettingsModule';
    import getMsu from '@/utils/getMsu';
    import Cost from '@/models/ogame/buildables/Cost';
    import { HexColor, hexColorToRGB } from '@/utils/colors';

    type ProductionBuildingType = Building.metalMine | Building.crystalMine | Building.deuteriumSynthesizer;

    interface AmortisationResult {
        buildingType: ProductionBuildingType;
        level: number;
        rate: number;
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
        private currentPlanet: PlanetData | MoonData = null!;
        private readonly settings = SettingsModule.settings;

        private rowCount = 15;

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
                player: this.localPlayerData,
                currentPlanet: this.currentPlanet as PlanetData,
                ecoSpeed: OgameMetaData.universeSpeed,
            };

            const levels: Record<ProductionBuildingType, number> = {
                [Building.metalMine]: currentPlanet.buildings?.production?.[Building.metalMine] ?? 0,
                [Building.crystalMine]: currentPlanet.buildings?.production?.[Building.crystalMine] ?? 0,
                [Building.deuteriumSynthesizer]: currentPlanet.buildings?.production?.[Building.deuteriumSynthesizer] ?? 0,
            };
            const buildings: Record<ProductionBuildingType, ProductionBuilding> = {
                [Building.metalMine]: MetalMine,
                [Building.crystalMine]: CrystalMine,
                [Building.deuteriumSynthesizer]: DeuteriumSynthesizer,
            };
            const buildingTypes: ProductionBuildingType[] = [Building.metalMine, Building.crystalMine, Building.deuteriumSynthesizer];

            const colors: Record<ProductionBuildingType, HexColor> = {
                [Building.metalMine]: this.settings.charts.colors.resources.metal,
                [Building.crystalMine]: this.settings.charts.colors.resources.crystal,
                [Building.deuteriumSynthesizer]: this.settings.charts.colors.resources.deuterium,
            };

            for (let i = 0; i < this.rowCount; i++) {
                let best: AmortisationResult = {
                    buildingType: null!,
                    level: null!,
                    rate: Number.MAX_VALUE,
                    cost: null!,
                    production: null!,
                    msuCost: null!,
                    msuProduction: null!,
                    color: null!,
                };

                for (const buildingType of buildingTypes) {
                    const building = buildings[buildingType];
                    const level = levels[buildingType] + 1;

                    const cost = building.getCost(level);
                    const msuCost = getMsu(cost, this.settings.msuConversionRates);

                    const production = building.getProduction(level, info);
                    const msuProduction = getMsu(production, this.settings.msuConversionRates);

                    const rate = msuCost / msuProduction;
                    if (rate < best.rate) {
                        best = {
                            buildingType,
                            level,
                            rate,
                            cost,
                            production,
                            msuCost,
                            msuProduction,
                            color: colors[buildingType],
                        };
                    }
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

        async mounted() {
            this.localPlayerData = await LocalPlayerModule.getData();
            this.currentPlanet = this.localPlayerData.planets[OgameMetaData.planetId];
        }
    }
</script>

<style lang="scss" scoped>
    .color-indicator {
        background: rgb(var(--color));
        height: 16px;
        width: 16px;
        display: inline-block;
        border-radius: 3px;
        margin-left: 4px;
    }
</style>