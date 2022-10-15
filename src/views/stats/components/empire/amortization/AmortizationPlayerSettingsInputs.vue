<template>
    <div class="player-settings">
        <template v-if="!productionMode">
            <conversion-rate-settings class="conversion-rate-settings" />

            <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.optimizeForResources" />
            <span class="gap">
                <o-resource
                    v-for="resource in resources"
                    :key="resource"
                    class="toggleable-resource"
                    :resource="resource"
                    :disabled="!settings.optimizeForResources.includes(resource)"
                    @click="toggleOptimizeForResource(resource)"
                />
            </span>
        </template>

        <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.officers" />
        <span class="gap">
            <o-officer
                v-for="(active, officer) in settings.officers"
                :key="officer"
                :officer="officer"
                :disabled="!active"
                @click="settings.officers[officer] = !settings.officers[officer]"
            />
        </span>

        <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.playerClass" />
        <span class="gap">
            <o-player-class
                v-for="playerClass in playerClasses"
                :key="playerClass"
                :player-class="playerClass"
                :disabled="settings.playerClass != playerClass"
                @click="togglePlayerClass(playerClass)"
            />
        </span>

        <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.allianceClass" />
        <span class="gap">
            <o-alliance-class
                v-for="allyClass in allianceClasses"
                :key="allyClass"
                :alliance-class="allyClass"
                :disabled="settings.allianceClass != allyClass"
                @click="toggleAllianceClass(allyClass)"
            />
        </span>

        <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.currentLevelOf($i18n.$t.ogame.research[ResearchType.plasmaTechnology])" />
        <span>
            <o-research :research="ResearchType.plasmaTechnology" />
            <input type="number" v-model.number="settings.levelPlasmaTechnology" min="0" max="50" step="1" />
        </span>

        <template v-if="!productionMode">
            <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.currentLevelOf($i18n.$t.ogame.research[ResearchType.astrophysics])" />
            <span>
                <o-research :research="ResearchType.astrophysics" />
                <input type="number" :value="settings.levelAstrophysics" disabled />
            </span>

            <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.unusedRaidColonySlots" />
            <span>
                <input type="number" v-model.number="settings.numberOfUnusedRaidColonySlots" :min="0" :max="100" step="1" />
            </span>
        </template>

        <span v-text="$i18n.$t.extension.empire.amortization.settings.playerSettings.lifeformLevels" />
        <span class="lifeform-level-grid">
            <span v-for="lifeform in LifeformTypes" :key="lifeform" style="display: contents">
                <o-lifeform :lifeform="lifeform" />
                <input type="number" v-model.number="settings.lifeformLevels[lifeform]" min="0" step="1" />
            </span>
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
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';
    import { ValidLifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({
        components: {
            ConversionRateSettings,
        },
    })
    export default class AmortizationPlayerSettingsInputs extends Vue {

        @VModel({ required: true, type: Object as PropType<AmortizationPlayerSettings> })
        private settings!: AmortizationPlayerSettings;

        @Prop({ required: false, type: Boolean, default: () => false })
        private productionMode!: boolean;

        private readonly resources = ResourceTypes;
        private readonly ResearchType = ResearchType;
        private readonly playerClasses = SelectablePlayerClasses;
        private readonly allianceClasses = SelectableAllianceClasses;
        private readonly LifeformTypes = ValidLifeformTypes;


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

        private toggleOptimizeForResource(resource: ResourceType) {
            if (this.settings.optimizeForResources.includes(resource)) {
                this.settings.optimizeForResources = this.settings.optimizeForResources.filter(r => r != resource);
            }
            else {
                this.settings.optimizeForResources.push(resource);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .player-settings {
        display: grid;
        grid-template-columns: minmax(auto, 150px) 1fr;
        align-items: center;
        gap: 8px 16px;

        > * {
            display: flex;

            &:nth-of-type(2n + 1) {
                justify-self: flex-end;
                text-align: right;
            }
        }

        input[type="number"] {
            width: 60px;
        }

        .o-officer,
        .o-player-class,
        .o-alliance-class,
        .toggleable-resource {
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

    .lifeform-level-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: 4px;
        align-items: stretch;
    }
</style>