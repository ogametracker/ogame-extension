<template>
    <div v-if="player != null">
        <div class="chart-container">
            <canvas ref="canvas" />
        </div>

        <table>
            <thead>
                <tr>
                    <th>LOCA: Planet</th>
                    <th>LOCA: Koordinaten</th>
                    <th>
                        <o-building type="metal-mine" :size="100" />
                    </th>
                    <th>
                        <o-building type="crystal-mine" :size="100" />
                    </th>
                    <th>
                        <o-building type="deuterium-synthesizer" :size="100" />
                    </th>
                    <th>
                        <o-building type="solar-plant" :size="100" />
                    </th>
                    <th>
                        <o-building type="fusion-reactor" :size="100" />
                    </th>
                    <th>
                        <o-ship type="crawler" :size="100" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="planet in planets" :key="planet.id">
                    <td>{{ planet.name }}</td>
                    <td>
                        [{{ planet.coordinates.galaxy }}:{{
                            planet.coordinates.system
                        }}:{{ planet.coordinates.position }}]
                    </td>
                    <td v-for="building in productionBuildings" :key="building">
                        {{ planet.buildings.production[building] }}
                    </td>
                    <td>
                        {{ $i18n.formatNumber(getActiveCrawlers(planet)) }}
                    </td>
                </tr>
                <tr class="total-row">
                    <th>
                        <span
                            style="transform: scale(1.5); transform-origin: center; display: inline-block;"
                        >
                            ⌀
                        </span>
                    </th>
                    <td />
                    <td v-for="building in productionBuildings" :key="building">
                        {{
                            $i18n.formatNumber(buildingAverage[building], {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }}
                    </td>
                    <td>
                        {{
                            $i18n.formatNumber(activeCrawlerAverage, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import i18n from '@/i18n';
    import Building from '@/models/Building';
    import CrystalMine from '@/models/ogame/buildables/buildings/CrystalMine';
    import DeuteriumSynthesizer from '@/models/ogame/buildables/buildings/DeuteriumSynthesizer';
    import MetalMine from '@/models/ogame/buildables/buildings/MetalMine';
    import { ProductionInject } from '@/models/ogame/buildables/buildings/ProductionBuilding';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import Resource from '@/models/Resource';
    import Ship from '@/models/Ship';
    import LocalPlayerModule, { LocalPlayerData, PlanetData, PlayerClass } from '@/store/modules/LocalPlayerModule';
    import { Component, Ref, Vue } from 'vue-property-decorator';
    import Chart from 'chart.js';
    import SettingsModule from '@/store/modules/SettingsModule';
    import _throw from '@/utils/throw';

    type ProductionBuildings = Building.metalMine
        | Building.crystalMine
        | Building.deuteriumSynthesizer
        | Building.solarPlant
        | Building.fusionReactor;

    @Component({})
    export default class EmpireProductionMineLevels extends Vue {
        private player: LocalPlayerData = null!;

        private readonly productionBuildings: ProductionBuildings[] = [
            Building.metalMine,
            Building.crystalMine,
            Building.deuteriumSynthesizer,
            Building.solarPlant,
            Building.fusionReactor,
        ];

        private getMaxCrawlers(planet: PlanetData): number {
            const crawlerFactor = this.player.officers.geologist && this.player.playerClass == PlayerClass.collector
                ? 1.1
                : 1;

            return Math.round(8 * (
                planet.buildings.production[Building.metalMine]
                + planet.buildings.production[Building.crystalMine]
                + planet.buildings.production[Building.deuteriumSynthesizer]
            ) * crawlerFactor);
        }

        private getActiveCrawlers(planet: PlanetData): number {
            return Math.min(planet.ships[Ship.crawler], this.getMaxCrawlers(planet));
        }

        private get buildingAverage(): Record<ProductionBuildings, number> {
            const planets = this.planets;

            const result = {} as Record<ProductionBuildings, number>;
            for (const building of this.productionBuildings) {
                result[building] = planets.reduce((acc, planet) => acc + planet.buildings.production[building], 0) / planets.length;
            }
            return result;
        }

        private get activeCrawlerAverage(): number {
            const planets = this.planets;

            const result = planets.reduce((acc, planet) => acc + planet.ships[Ship.crawler], 0);
            return result / planets.length;
        }

        private get planets(): PlanetData[] {
            const planets = Object.values(this.player.planets)
                .filter(p => !p.isMoon) as PlanetData[];

            return planets.sort((a, b) => {
                const gala = a.coordinates.galaxy - b.coordinates.galaxy;
                if (gala != 0) {
                    return gala;
                }

                const system = a.coordinates.system - b.coordinates.system;
                if (system != 0) {
                    return system;
                }

                return a.coordinates.position - b.coordinates.position;
            });
        }

        private get chartOptions(): Chart.ChartOptions {
            return {
                animation: {
                    duration: 0,
                },
                hover: {
                    animationDuration: 0,
                },
                tooltips: {
                    callbacks: {
                        label: (item, data) => i18n.formatNumber(data.datasets![0].data![item.index!] as number),
                    },
                }
            };
        }

        private readonly labels: string[] = [
            i18n.messages.ogame.resources[Resource.metal],
            i18n.messages.ogame.resources[Resource.crystal],
            i18n.messages.ogame.resources[Resource.deuterium],
        ];

        private get chartDataset(): Chart.ChartDataSets {
            if (this.player == null) {
                return {};
            }

            const inject: Omit<ProductionInject, 'currentPlanet'> = {
                player: this.player,
                ecoSpeed: OgameMetaData.universeSpeed,
            };

            return {
                data: [
                    // metal mine
                    this.planets.reduce((acc, planet) => {
                        const production = MetalMine.getProduction(planet.buildings.production[Building.metalMine], {
                            ...inject,
                            currentPlanet: planet,
                        });
                        return acc + production.metal;
                    }, 0),

                    // crystal mine
                    this.planets.reduce((acc, planet) => {
                        const production = CrystalMine.getProduction(planet.buildings.production[Building.crystalMine], {
                            ...inject,
                            currentPlanet: planet,
                        });
                        return acc + production.crystal;
                    }, 0),

                    // deuterium synthesizer
                    this.planets.reduce((acc, planet) => {
                        const production = DeuteriumSynthesizer.getProduction(planet.buildings.production[Building.deuteriumSynthesizer], {
                            ...inject,
                            currentPlanet: planet,
                        });
                        return acc + production.deuterium;
                    }, 0),
                ],
                backgroundColor: [
                    this.settings.charts.colors.resources.metal,
                    this.settings.charts.colors.resources.crystal,
                    this.settings.charts.colors.resources.deuterium,
                ],
            };
        }

        private get settings() {
            return SettingsModule.settings;
        }

        private get chartData(): Chart.ChartData {
            return {
                labels: this.labels,
                datasets: [this.chartDataset],
            };
        }

        private chart: Chart | null = null;
        private get canvas(): HTMLCanvasElement {
            return this.$refs.canvas as HTMLCanvasElement;
        }

        private renderChart() {
            this.$nextTick(() => {
                const context = this.canvas.getContext('2d') ?? _throw('no 2d context found');
                this.chart = new Chart(context, {
                    type: 'doughnut',
                    data: this.chartData,
                    options: this.chartOptions,
                });
            });
        }

        private async mounted() {
            this.player = await LocalPlayerModule.getData();

            this.renderChart();
        }
    }
</script>
<style lang="scss" scoped>
    .chart-container {
        max-width: 400px;
        max-height: 400px;
    }
</style>