<template>
    <div>
        <h3>LOCA: Player Settings</h3>
        <amortization-player-settings-inputs v-model="playerSettings" />
        <hr />

        <h3>LOCA: Planet Settings</h3>
        <div>
            <amortization-planet-settings-inputs
                v-for="(planetSetting, i) in planetSettings"
                :key="planetSetting.id"
                v-model="planetSettings[i]"
            />
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

            <amortization-planet-settings-inputs
                v-model="astrophysicsSettings.planet"
            />
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
     *              ~ crawler overload
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
    import { BuildingType } from '@/shared/models/v1/ogame/buildings/BuildingType';
    import { AllianceClass } from '@/shared/models/v1/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/v1/ogame/classes/PlayerClass';
    import { ItemHash } from '@/shared/models/v1/ogame/items/ItemHash';
    import { ResearchType } from '@/shared/models/v1/ogame/research/ResearchType';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { Component, Vue } from 'vue-property-decorator';
    import AmortizationPlanetSettingsInputs, { AmortizationPlanetSettings } from '../../components/empire/production/amortization/AmortizationPlanetSettingsInputs.vue';
    import AmortizationPlayerSettingsInputs, { AmortizationPlayerSettings } from '../../components/empire/production/amortization/AmortizationPlayerSettingsInputs.vue';
    import { EmpireDataModule } from '../../data/EmpireDataModule';

    interface AmortizationMaxLevels {
        mine: number;
        plasmaTechnology: number;
        astrophysics: number;
    }

    interface AmortizationAstrophysicsSettings {
        include: boolean;
        planet: AmortizationPlanetSettings;
    }

    @Component({
        components: {
            AmortizationPlanetSettingsInputs,
            AmortizationPlayerSettingsInputs,
        },
    })
    export default class Amortization extends Vue {

        private playerSettings: AmortizationPlayerSettings = {
            msuConversionRates: {
                crystal: 2,
                deuterium: 3,
            },
            officers: {
                admiral: false,
                commander: false,
                engineer: false,
                geologist: false,
                technocrat: false,
            },
            playerClass: PlayerClass.none,
            allianceClass: AllianceClass.none,
            levelPlasmaTechnology: 0,
            levelAstrophysics: 0,
        };
        private planetSettings: AmortizationPlanetSettings[] = [];
        private maxLevels: AmortizationMaxLevels = {
            mine: 60,
            plasmaTechnology: 30,
            astrophysics: 37,
        };
        private includePlasmaTechnology = true;
        private astrophysicsSettings: AmortizationAstrophysicsSettings = {
            include: true,
            planet: {
                id: -1,
                name: '',
                position: 0,
                maxTemperature: 0,
                activeItems: [],
                crawlers: {
                    enabled: false,
                    overload: false,
                    count: 0,
                },
            },
        };


        private mounted() {
            this.initSettings();
        }

        private initSettings() {
            const empire = EmpireDataModule.empire;

            this.playerSettings = {
                //TODO: MSU rates from settings
                msuConversionRates: {
                    crystal: 2,
                    deuterium: 3,
                },
                officers: { ...empire.officers },
                playerClass: empire.playerClass,
                allianceClass: empire.allianceClass,
                levelPlasmaTechnology: empire.research[ResearchType.plasmaTechnology],
                levelAstrophysics: empire.research[ResearchType.astrophysics],
            };

            this.planetSettings = (Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[])
                .map(planet => ({
                    id: planet.id,
                    name: planet.name,
                    maxTemperature: planet.maxTemperature,
                    coordinates: planet.coordinates,
                    position: planet.coordinates.position,
                    mineLevels: {
                        metalMine: planet.buildings.production[BuildingType.metalMine],
                        crystalMine: planet.buildings.production[BuildingType.crystalMine],
                        deuteriumSynthesizer: planet.buildings.production[BuildingType.deuteriumSynthesizer],
                    },
                    activeItems: Object.keys(planet.activeItems) as ItemHash[],
                    crawlers: {
                        enabled: true,
                        overload: empire.playerClass == PlayerClass.collector,
                        count: empire.playerClass == PlayerClass.collector ? 'max' : planet.ships[ShipType.crawler],
                    },
                }));

            this.astrophysicsSettings = {
                include: true,
                planet: {
                    id: -1,
                    name: 'LOCA: new colony',
                    position: 8,
                    maxTemperature: this.getAverageTemperature(8),
                    activeItems: [],
                    crawlers: {
                        enabled: empire.playerClass == PlayerClass.collector,
                        overload: empire.playerClass == PlayerClass.collector,
                        count: empire.playerClass == PlayerClass.collector ? 'max' : 0,
                    },
                },
            };
        }

        /** 
         * Returns the average position at the given position using the official list:
         * https://board.de.ogame.gameforge.com/index.php?thread/193098-offizielle-planetengr%C3%B6%C3%9Fen-in-version-6-1/
         */
        private getAverageTemperature(position: number): number {
            switch (position) {
                case 1: return 240;
                case 2: return 190;
                case 3: return 140;
                case 4: return 90;
                case 5: return 80;
                case 6: return 70;
                case 7: return 60;
                case 8: return 50;
                case 9: return 40;
                case 10: return 30;
                case 11: return 20;
                case 12: return 10;
                case 13: return -30;
                case 14: return -70;
                case 15: return -110;

                default: throw new Error('invalid position');
            }
        }
    }
</script>