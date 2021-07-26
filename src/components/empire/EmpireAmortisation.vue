<template>
    <div>
        TODO: Planet wählen Anzahl Zeilen:
        <input type="number" v-model="rowNumber" />
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
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import MetalMine from '@/models/ogame/buildables/buildings/MetalMine';
    import CrystalMine from '@/models/ogame/buildables/buildings/CrystalMine';
    import DeuteriumSynthesizer from '@/models/ogame/buildables/buildings/DeuteriumSynthesizer';
    import LocalPlayerModule from '@/store/modules/LocalPlayerModule';
    import OgameMetaData from '@/models/ogame/OgameMetaData';
    import Building from '@/models/Building';

    @Component({})
    export default class EmpireAmortisation extends Vue {
        private rowNumber = 15;

        async mounted() {
            const localPlayerData = await LocalPlayerModule.getData();

            const currentPlanet = localPlayerData.planets[OgameMetaData.planetId];
            if (currentPlanet.isMoon) {
                return;
            }

            const metalMine = new MetalMine();
            const metalMineLevel = currentPlanet.buildings?.production?.[Building.metalMine] ?? 0;
            const metalMineProduction = metalMine.getProduction(metalMineLevel, {
                player: localPlayerData,
                currentPlanet: currentPlanet,
                ecoSpeed: OgameMetaData.universeSpeed,
            });
            console.log(metalMineProduction);

            const crystalMine = new CrystalMine();
            const crystalMineLevel = currentPlanet.buildings?.production?.[Building.crystalMine] ?? 0;
            const crystalMineProduction = crystalMine.getProduction(crystalMineLevel, {
                player: localPlayerData,
                currentPlanet: currentPlanet,
                ecoSpeed: OgameMetaData.universeSpeed,
            });
            console.log(crystalMineProduction);

            const deuteriumSynthesizer = new DeuteriumSynthesizer();
            const deuteriumSynthesizerLevel = currentPlanet.buildings?.production?.[Building.deuteriumSynthesizer] ?? 0;
            const deuteriumSynthesizerProduction = deuteriumSynthesizer.getProduction(deuteriumSynthesizerLevel, {
                player: localPlayerData,
                currentPlanet: currentPlanet,
                ecoSpeed: OgameMetaData.universeSpeed,
            });
            console.log(deuteriumSynthesizerProduction);
        }
    }
</script>