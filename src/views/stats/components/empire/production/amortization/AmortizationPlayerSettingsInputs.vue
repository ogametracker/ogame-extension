<template>
    <div class="player-settings">
        <msu-conversion-rate-settings class="msu-rate-settings" />

        <span>LOCA: Officers</span>
        <span class="gap">
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
        <span class="gap">
            <o-player-class
                v-for="(classType, plClass) in playerClasses"
                :key="plClass"
                :player-class="classType"
                :disabled="settings.playerClass != plClass"
                @click="togglePlayerClass(plClass)"
            />
        </span>

        <span>LOCA: Alliance Class</span>
        <span class="gap">
            <o-alliance-class
                v-for="(classType, allyClass) in allianceClasses"
                :key="allyClass"
                :alliance-class="classType"
                :disabled="settings.allianceClass != allyClass"
                @click="toggleAllianceClass(allyClass)"
            />
        </span>

        <span>LOCA: Current Level Plasmatechnology</span>
        <span>
            <o-research research="plasma-technology" />
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
            <o-research research="astrophysics" />
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
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';

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

    @Component({
        components: {
            MsuConversionRateSettings,
        },
    })
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
<style lang="scss" scoped>
    .player-settings {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 8px 16px;

        > * {
            display: flex;

            &:nth-of-type(2n + 1) {
                justify-self: flex-end;
            }
        }

        input[type="number"] {
            width: 60px;
        }

        .o-officer,
        .o-player-class,
        .o-alliance-class {
            cursor: pointer;
        }

        .gap {
            column-gap: 8px;

            > * {
                display: flex;
            }
        }
    }

    .msu-rate-settings {
        display: contents;

        &::v-deep {
            .fake-table-header {
                background: none;
                justify-content: end;
                padding-right: 0;
            }
            .fake-table-body {
                padding-left: 0;
            }
        }
    }
</style>