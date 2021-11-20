<template>
    <div v-if="player != null">
        <table>
            <colgroup>
                <col width="auto" />
                <col width="100px" />
                <col width="auto" />
                <col width="auto" />
                <col width="auto" />
                <col width="auto" />
                <col width="auto" />
                <col width="auto" />
                <col width="40px" />
            </colgroup>
            <thead>
                <tr>
                    <th v-text="$i18n.$t.empire.productionOverview.planet" />
                    <th />
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
                    <th colspan="2">
                        <o-ship type="crawler" :size="100" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="planet in planets" :key="planet.id">
                    <td v-text="planet.name" />
                    <td>
                        [{{ planet.coordinates.galaxy }}:{{
                            planet.coordinates.system
                        }}:{{ planet.coordinates.position }}]
                    </td>
                    <td v-for="building in productionBuildings" :key="building">
                        {{ planet.buildings.production[building] }}
                    </td>
                    <td v-text="$i18n.$n(getActiveCrawlers(planet))" />
                    <td v-text="$i18n.$n(getCrawlers(planet))" />
                </tr>
                <tr class="total-row">
                    <th>
                        <span class="average-icon" />
                    </th>
                    <td />
                    <td v-for="building in productionBuildings" :key="building">
                        {{
                            $i18n.$n(buildingAverage[building], {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }}
                    </td>
                    <td>
                        {{
                            $i18n.$n(activeCrawlerAverage, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })
                        }}
                    </td>
                    <td>
                        {{
                            $i18n.$n(crawlerAverage, {
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
    import Building from '@/models/Building';
    import Ship from '@/models/Ship';
    import LocalPlayerModule, { LocalPlayerData, PlanetData, PlayerClass } from '@/store/modules/LocalPlayerModule';
    import { Component, Ref, Vue } from 'vue-property-decorator';
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

        private getCrawlers(planet: PlanetData): number {
            return planet.ships[Ship.crawler];
        }

        private getActiveCrawlers(planet: PlanetData): number {
            return Math.min(this.getCrawlers(planet), this.getMaxCrawlers(planet));
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

            const result = planets.reduce((acc, planet) => acc + this.getActiveCrawlers(planet), 0);
            return result / planets.length;
        }

        private get crawlerAverage(): number {
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

        private get settings() {
            return SettingsModule.settings;
        }

        private async mounted() {
            this.player = await LocalPlayerModule.getData();
        }
    }
</script>
<style lang="scss" scoped>
    .chart-container {
        max-width: 400px;
        max-height: 400px;
    }
</style>