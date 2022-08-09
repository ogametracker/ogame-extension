<template>
    <div class="player-settings">
        <conversion-rate-settings class="conversion-rate-settings" />

        <span v-text="$i18n.$t.empire.amortization.settings.playerSettings.officers" />
        <span class="gap">
            <o-officer
                v-for="(active, officer) in settings.officers"
                :key="officer"
                :officer="officer"
                :disabled="!active"
                @click="settings.officers[officer] = !settings.officers[officer]"
            />
        </span>

        <span v-text="$i18n.$t.empire.amortization.settings.playerSettings.playerClass" />
        <span class="gap">
            <o-player-class
                v-for="playerClass in playerClasses"
                :key="playerClass"
                :player-class="playerClass"
                :disabled="settings.playerClass != playerClass"
                @click="togglePlayerClass(playerClass)"
            />
        </span>

        <span v-text="$i18n.$t.empire.amortization.settings.playerSettings.allianceClass" />
        <span class="gap">
            <o-alliance-class
                v-for="allyClass in allianceClasses"
                :key="allyClass"
                :alliance-class="allyClass"
                :disabled="settings.allianceClass != allyClass"
                @click="toggleAllianceClass(allyClass)"
            />
        </span>

        <span v-text="$i18n.$t.empire.amortization.settings.playerSettings.currentLevelPlasmatech" />
        <span>
            <o-research :research="ResearchType.plasmaTechnology" />
            <input type="number" v-model.number="settings.levelPlasmaTechnology" min="0" max="50" step="1" />
        </span>

        <span v-text="$i18n.$t.empire.amortization.settings.playerSettings.currentLevelAstrophysics" />
        <span>
            <o-research :research="ResearchType.astrophysics" />
            <input type="number" :value="settings.levelAstrophysics" disabled />
        </span>

        <span v-text="$i18n.$t.empire.amortization.settings.playerSettings.unusedRaidColonySlots" />
        <span>
            <input type="number" v-model.number="settings.numberOfUnusedRaidColonySlots" :min="0" :max="100" step="1" />
        </span>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { AllianceClass, SelectableAllianceClasses } from '@/shared/models/ogame/classes/AllianceClass';
    import { PlayerClass, SelectablePlayerClasses } from '@/shared/models/ogame/classes/PlayerClass';
    import { Component, Prop, Vue, VModel } from 'vue-property-decorator';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { AmortizationPlayerSettings } from '@/shared/models/empire/amortization/AmortizationPlayerSettings';

    @Component({
        components: {
            ConversionRateSettings,
        },
    })
    export default class AmortizationPlayerSettingsInputs extends Vue {

        @VModel({ required: true, type: Object as PropType<AmortizationPlayerSettings> })
        private settings!: AmortizationPlayerSettings;

        private readonly ResearchType = ResearchType;
        private readonly playerClasses = SelectablePlayerClasses;
        private readonly allianceClasses = SelectableAllianceClasses;


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

    .conversion-rate-settings {
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