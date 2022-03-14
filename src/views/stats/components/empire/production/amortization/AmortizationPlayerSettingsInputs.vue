<template>
    <div class="player-settings">
        <span>LOCA: MSU conversion rates</span>
        <span>
            <o-resource resource="metal" />
            <input type="number" value="1" readonly />
            <o-resource resource="crystal" />
            <input
                type="number"
                v-model.number="settings.msuConversionRates.crystal"
                min="1"
                max="3"
                step="0.01"
            />
            <o-resource resource="deuterium" />
            <input
                type="number"
                v-model.number="settings.msuConversionRates.deuterium"
                min="2"
                max="5"
                step="0.01"
            />
        </span>

        <span>LOCA: Officers</span>
        <span>
            <o-officer
                v-for="(active, officer) in settings.officers"
                :key="officer"
                :officer="officer"
                :disabled="!active"
                @click="
                    settings.officers[officer] = !settings.officers[officer]
                "
            />
        </span>

        <span>LOCA: Player Class</span>
        <span>
            <o-player-class
                v-for="(classType, plClass) in settings.playerClasses"
                :key="plClass"
                :player-class="classType"
                :disabled="settings.playerClass != plClass"
                @click="togglePlayerClass(plClass)"
            />
        </span>

        <span>LOCA: Alliance Class</span>
        <span>
            <o-alliance-class
                v-for="(classType, allyClass) in settings.allianceClasses"
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
                v-model.number="settings.levelPlasmaTechnology"
                min="0"
                max="50"
                step="1"
            />
        </span>

        <span>LOCA: Current Level Astrophysics</span>
        <span>
            <input
                type="number"
                v-model.number="settings.levelAstrophysics"
                min="0"
                max="50"
                step="1"
            />
        </span>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { AllianceClass } from '@/shared/models/ogame/classes/AllianceClass';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { Component, Prop, Vue, VModel } from 'vue-property-decorator';
    import { OPlayerClassType } from '../../../common/ogame/OPlayerClass.vue';
    import { OAllianceClassType } from '../../../common/ogame/OAllianceClass.vue';

    export interface AmortizationPlayerSettings {
        msuConversionRates: {
            crystal: number;
            deuterium: number;
        };
        officers: {
            admiral: boolean;
            commander: boolean;
            engineer: boolean;
            geologist: boolean;
            technocrat: boolean;
        };
        playerClass: PlayerClass;
        allianceClass: AllianceClass;
        levelPlasmaTechnology: number;
        levelAstrophysics: number;
    }

    @Component({})
    export default class AmortizationPlayerSettingsInputs extends Vue {
        
        @VModel({ required: true, type: Object as PropType<AmortizationPlayerSettings> })
        private settings!: AmortizationPlayerSettings;


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


        private togglePlayerClass(playerClass: PlayerClass): void {
            if (this.settings.playerClass == playerClass) {
                this.settings.playerClass = PlayerClass.none;
                return;
            }

            this.settings.playerClass = playerClass;
        }

        private toggleAllianceClass(allianceClass: AllianceClass): void {
            if (this.settings.allianceClass == allianceClass) {
                this.settings.allianceClass = AllianceClass.none;
                return;
            }

            this.settings.allianceClass = allianceClass;
        }
    }
</script>