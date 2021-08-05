<template>
    <div v-if="player != null">
        <table>
            <thead>
                <tr>
                    <th>LOCA: Planet</th>
                    <th>LOCA: Metallmine</th>
                    <th>LOCA: Kristallmine</th>
                    <th>LOCA: Deuterium-Synthetisierer</th>
                    <th>LOCA: Solarkraftwerk</th>
                    <th>LOCA: Fusionskraftwerk</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="planet in planets" :key="planet.id">
                    <td>
                        {{ planet.name }} [{{ planet.coordinates.galaxy }}:{{
                            planet.coordinates.system
                        }}:{{ planet.coordinates.position }}]
                    </td>
                    <td v-for="building in productionBuildings" :key="building">
                        {{ planet.buildings.production[building] }}
                    </td>
                </tr>
                <tr class="total-row">
                    <th>
                        <span
                            style="transform: scale(1.5); transform-origin: center; display: inline-block"
                            >⌀</span
                        >
                    </th>
                    <td v-for="building in productionBuildings" :key="building">
                        {{
                            $i18n.formatNumber(buildingAverage[building], {
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
    import LocalPlayerModule, { LocalPlayerData, PlanetBuildingProductionLevels, PlanetData } from '@/store/modules/LocalPlayerModule';
    import { Component, Vue } from 'vue-property-decorator';

    type ProductionBuildings = Building.metalMine
        | Building.crystalMine
        | Building.deuteriumSynthesizer
        | Building.solarPlant
        | Building.fusionReactor;

    @Component({})
    export default class EmpireProduction extends Vue {
        private player: LocalPlayerData = null!;

        private readonly productionBuildings: ProductionBuildings[] = [
            Building.metalMine,
            Building.crystalMine,
            Building.deuteriumSynthesizer,
            Building.solarPlant,
            Building.fusionReactor,
        ];

        private async mounted() {
            this.player = await LocalPlayerModule.getData();
        }

        private get buildingAverage(): Record<ProductionBuildings, number> {
            const planets = this.planets;

            const result = {} as Record<ProductionBuildings, number>;
            for (const building of this.productionBuildings) {
                result[building] = planets.reduce((acc, planet) => acc + planet.buildings.production[building], 0) / planets.length;
            }
            return result;
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
    }
</script>