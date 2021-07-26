<template>
    <div v-if="localPlayerData != null">
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
                    <th>LOCA: Gebäude + level</th>
                    <th>LOCA: Cost Metal</th>
                    <th>LOCA: Cost Crystal</th>
                    <th>LOCA: Cost MSU</th>
                    <th>LOCA: Amortisation Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>LOCA: Abc 13</th>
                    <th>LOCA: 9.323.622.233</th>
                    <th>LOCA: 3.108.622.233</th>
                    <th>LOCA: 16.335.624.222</th>
                    <th>LOCA: 1y 3w 3d 12h</th>
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
    import LocalPlayerModule, { LocalPlayerData, PlanetData } from '@/store/modules/LocalPlayerModule';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import Building from '@/models/Building';
    import { ProductionInject } from '@/models/ogame/buildables/buildings/ProductionBuilding';

    @Component({})
    export default class EmpireAmortisation extends Vue {
        private selectedPlanet = OgameMetaData.planetId;
        private localPlayerData: LocalPlayerData = null!;

        private get planets(): PlanetData[] {
            return Object.values(this.localPlayerData.planets)
                .filter(p => !p.isMoon) as PlanetData[];
        }

        async mounted() {
            this.localPlayerData = await LocalPlayerModule.getData();

            const currentPlanet = this.localPlayerData.planets[OgameMetaData.planetId];
            if (currentPlanet.isMoon) {
                return;
            }

            const info: ProductionInject = {
                player: this.localPlayerData,
                currentPlanet: currentPlanet,
                ecoSpeed: OgameMetaData.universeSpeed,
            };

            const metalMineLevel = currentPlanet.buildings?.production?.[Building.metalMine] ?? 0;
            const metalMineProduction = MetalMine.getProduction(metalMineLevel, info);
            console.log(metalMineProduction);

            const crystalMineLevel = currentPlanet.buildings?.production?.[Building.crystalMine] ?? 0;
            const crystalMineProduction = CrystalMine.getProduction(crystalMineLevel, info);
            console.log(crystalMineProduction);

            const deuteriumSynthesizerLevel = currentPlanet.buildings?.production?.[Building.deuteriumSynthesizer] ?? 0;
            const deuteriumSynthesizerProduction = DeuteriumSynthesizer.getProduction(deuteriumSynthesizerLevel, info);
            console.log(deuteriumSynthesizerProduction);
        }
    }
</script>