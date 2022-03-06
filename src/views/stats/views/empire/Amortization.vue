<template>
    <div>
        <h3>LOCA: Player Settings</h3>
        <div class="player-settings">
            <span>LOCA: MSU conversion rates</span>
            <span>
                <o-resource resource="metal" />
                <input type="number" value="1" readonly />
                <o-resource resource="crystal" />
                <input
                    type="number"
                    v-model.number="msuConversionRates.crystal"
                    min="1"
                    max="3"
                    step="0.01"
                />
                <o-resource resource="deuterium" />
                <input
                    type="number"
                    v-model.number="msuConversionRates.deuterium"
                    min="2"
                    max="5"
                    step="0.01"
                />
            </span>

            <span>LOCA: Officers</span>
            <span>
                <o-officer
                    v-for="(active, officer) in officers"
                    :key="officer"
                    :officer="officer"
                    :disabled="!active"
                    @click="officers[officer] = !officers[officer]"
                />
            </span>

            <span>LOCA: Player Class</span>
            <span>
                <o-player-class
                    v-for="(classType, plClass) in playerClasses"
                    :key="plClass"
                    :player-class="classType"
                    :disabled="playerClass != plClass"
                    @click="togglePlayerClass(plClass)"
                />
            </span>

            <span>LOCA: Alliance Class</span>
            <span>
                <o-alliance-class
                    v-for="(classType, allyClass) in allianceClasses"
                    :key="allyClass"
                    :alliance-class="classType"
                    :disabled="allianceClass != allyClass"
                    @click="toggleAllianceClass(allyClass)"
                />
            </span>

            <span>LOCA: Current Level Plasmatechnology</span>
            <span>
                <input
                    type="number"
                    v-model.number="currentLevelPlasmaTechnology"
                    min="0"
                    max="50"
                    step="1"
                />
            </span>

            <span>LOCA: Current Level Astrophysics</span>
            <span>
                <input
                    type="number"
                    v-model.number="currentLevelAstrophysics"
                    min="0"
                    max="50"
                    step="1"
                />
            </span>
        </div>
        <hr />

        <h3>LOCA: Planet Settings</h3>
        <div class="planet-settings" v-for="planet in planets" :key="planet.id">
            <span>LOCA: Planet</span>
            <span v-text="planet.name" />

            <span>LOCA: Position</span>
            <span>
                <input
                    type="number"
                    v-model.number="planet.coordinates.position"
                    min="1"
                    max="15"
                    step="1"
                />
            </span>

            <span>LOCA: Temperature</span>
            <span>
                <input
                    type="number"
                    v-model.number="planet.maxTemperature"
                    min="-130"
                    max="260"
                    step="1"
                />
            </span>

            <span>LOCA: Items</span>
            <span>TODO: Item settings here</span>

            <span>LOCA: Crawlers</span>
            <span>TODO: Crawler settings here</span>

            <span>LOCA: Mine Levels</span>
            <span>TODO: Current mine levels here</span>
        </div>
        <hr />

        <h3>LOCA: Plasmatechnology</h3>
        <div class="plasma-tech-settings">
            <span>LOCA: Show plasmatech in result</span>
            <span>
                TODO
                <input type="checkbox" />
            </span>
        </div>
        <hr />

        <h3>LOCA: Astrophysics</h3>
        <div class="astrophysics-settings">
            <span>LOCA: Show astrophysics + new colony in result</span>
            <span>
                TODO
                <input type="checkbox" />
            </span>

            <span>LOCA: Position</span>
            <span>
                TODO
                <input type="number" min="1" max="15" step="1" />
            </span>

            <span>LOCA: Temperature</span>
            <span>
                TODO
                <input type="number" min="-130" max="260" step="1" />
            </span>

            <span>LOCA: Items</span>
            <span>TODO: Item settings here</span>

            <span>LOCA: Crawlers</span>
            <span>TODO: Crawler settings here</span>
        </div>

        <!-- TODO: amortization table -->
        <grid-table />
    </div>
</template>

<script lang="ts">
    /* TODO: see list below
     * - player wide settings
     *      + MSU conversion rates
     *      + active officers
     *      + player class
     *      + alliance class
     *      + current level plasma tech
     *      + current level astrophysics
     * 
     * - checkbox for each planet (on = use in calculation)
     *      + for each planet there are the following settings
     *          = position
     *          = temperature
     *          = active items (metal/crystal/deut)
     *          = crawler settings
     *              ~ on/off
     *              ~ crawler overload (only for collectors)
     *              ~ toggle between "fix crawler count" and "max crawler count"
     *          = current mine levels
     * 
     * - checkbox for plasma technology (on = use in calculation)
     * 
     * - checkbox to consider astrophysics (on = use in calculation)
     *      + same settings as for planets EXCEPT current mine levels
     *          = prefill temperature with avg. value based on position (see official list: https://board.de.ogame.gameforge.com/index.php?thread/193098-offizielle-planetengr%C3%B6%C3%9Fen-in-version-6-1/)
     * 
     * - max. levels for each mine, plasma tech, and astrophysics (higher = more computational expensive, defaults: [60/60/60, 28, 35])
     */

    import { PlanetData } from '@/shared/models/v1/empire/PlanetData';
    import { AllianceClass } from '@/shared/models/v1/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/v1/ogame/classes/PlayerClass';
    import { ResearchType } from '@/shared/models/v1/ogame/research/ResearchType';
    import { Component, Vue } from 'vue-property-decorator';
    import { OAllianceClassType } from '../../components/common/ogame/OAllianceClass.vue';
    import { OPlayerClassType } from '../../components/common/ogame/OPlayerClass.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';

    @Component({})
    export default class Amortization extends Vue {
        private readonly playerClasses: Partial<Record<PlayerClass, OPlayerClassType>> = {
            [PlayerClass.collector]: OPlayerClassType.collector,
            [PlayerClass.discoverer]: OPlayerClassType.explorer,
            [PlayerClass.general]: OPlayerClassType.general,
        };
        private readonly allianceClasses: Partial<Record<AllianceClass, OAllianceClassType>> = {
            [AllianceClass.trader]: OAllianceClassType.trader,
            [AllianceClass.researcher]: OAllianceClassType.researcher,
            [AllianceClass.warrior]: OAllianceClassType.warrior,
        };

        //TODO: MSU rates from settings
        private readonly msuConversionRates = {
            crystal: 2,
            deuterium: 3,
        };
        private officers = {
            admiral: false,
            commander: false,
            engineer: false,
            geologist: false,
            technocrat: false,
        };
        private playerClass = PlayerClass.none;
        private allianceClass = AllianceClass.none;
        private currentLevelPlasmaTechnology = 0;
        private currentLevelAstrophysics = 0;
        private planets: PlanetData[] = [];

        private mounted() {
            const empire = EmpireDataModule.empire;

            this.officers = { ...empire.officers };
            this.playerClass = empire.playerClass;
            this.allianceClass = empire.allianceClass;
            this.currentLevelPlasmaTechnology = empire.research[ResearchType.plasmaTechnology];
            this.currentLevelAstrophysics = empire.research[ResearchType.astrophysics];
            this.planets = Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[];
        }

        private togglePlayerClass(playerClass: PlayerClass): void {
            if (this.playerClass == playerClass) {
                this.playerClass = PlayerClass.none;
                return;
            }

            this.playerClass = playerClass;
        }
        private toggleAllianceClass(allianceClass: AllianceClass): void {
            if (this.allianceClass == allianceClass) {
                this.allianceClass = AllianceClass.none;
                return;
            }

            this.allianceClass = allianceClass;
        }
    }
</script>