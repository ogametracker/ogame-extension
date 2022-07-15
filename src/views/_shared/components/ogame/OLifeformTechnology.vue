<template>
    <div
        class="o-lifeform-technology"
        :class="[
            {
                'o-lifeform-technology--disabled': disabled,
            },
            `o-lifeform-technology--${lifeform}`,
        ]"
        :style="{
            'background-image': `url(/img/ogame/lifeforms/technologies/${image}.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { LifeformTechnologyType, LifeformTechnologyTypes, LifeformTechnologyTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({})
    export default class OLifeformTechnology extends Vue {
        @Prop({
            required: true,
            type: Number as PropType<LifeformTechnologyType>,
            validator: (value: number) => (LifeformTechnologyTypes as number[]).includes(value)
        })
        private technology!: LifeformTechnologyType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        private get image() {
            return this.imageMap[this.technology];
        }
        private readonly imageMap: Record<LifeformTechnologyType, string> = {
            [LifeformTechnologyType.intergalacticEnvoys]: 'intergalactic-envoys',
            [LifeformTechnologyType.highPerformanceExtractors]: 'high-performance-extractors',
            [LifeformTechnologyType.fusionDrives]: 'fusion-drives',
            [LifeformTechnologyType.stealthFieldGenerator]: 'stealth-field-generator',
            [LifeformTechnologyType.orbitalDen]: 'orbital-den',
            [LifeformTechnologyType.researchAI]: 'research-aI',
            [LifeformTechnologyType.highPerformanceTerraformer]: 'high-performance-terraformer',
            [LifeformTechnologyType.enhancedProductionTechnologies]: 'enhanced-production-technologies',
            [LifeformTechnologyType.lightFighterMkII]: 'light-fighter-mk-iI',
            [LifeformTechnologyType.cruiserMkII]: 'cruiser-mk-iI',
            [LifeformTechnologyType.improvedLabTechnology]: 'improved-lab-technology',
            [LifeformTechnologyType.plasmaTerraformer]: 'plasma-terraformer',
            [LifeformTechnologyType.lowTemperatureDrives]: 'low-temperature-drives',
            [LifeformTechnologyType.bomberMkII]: 'bomber-mk-iI',
            [LifeformTechnologyType.destroyerMkII]: 'destroyer-mk-iI',
            [LifeformTechnologyType.battlecruiserMkII]: 'battlecruiser-mk-iI',
            [LifeformTechnologyType.robotAssistants]: 'robot-assistants',
            [LifeformTechnologyType.supercomputer]: 'supercomputer',

            [LifeformTechnologyType.volcanicBatteries]: 'volcanic-batteries',
            [LifeformTechnologyType.acousticScanning]: 'acoustic-scanning',
            [LifeformTechnologyType.highEnergyPumpSystems]: 'high-energy-pump-systems',
            [LifeformTechnologyType.cargoHoldExpansion_CivilianShips]: 'cargo-hold-expansion_Civilian-ships',
            [LifeformTechnologyType.magmaPoweredProduction]: 'magma-powered-production',
            [LifeformTechnologyType.geothermalPowerPlants]: 'geothermal-power-plants',
            [LifeformTechnologyType.depthSounding]: 'depth-sounding',
            [LifeformTechnologyType.ionCrystalEnhancement_heavyFighter]: 'ion-crystal-enhancement_heavy-fighter',
            [LifeformTechnologyType.improvedStellarator]: 'improved-stellarator',
            [LifeformTechnologyType.hardenedDiamondDrillHeads]: 'hardened-diamond-drill-heads',
            [LifeformTechnologyType.seismicMiningTechnology]: 'seismic-mining-technology',
            [LifeformTechnologyType.magmaPoweredPumpSystems]: 'magma-powered-pump-systems',
            [LifeformTechnologyType.ionCrystalModules]: 'ion-crystal-modules',
            [LifeformTechnologyType.optimisedSiloConstructionMethod]: 'optimised-silo-construction-method',
            [LifeformTechnologyType.diamondEnergyTransmitter]: 'diamond-energy-transmitter',
            [LifeformTechnologyType.obsidianShieldReinforcement]: 'obsidian-shield-reinforcement',
            [LifeformTechnologyType.runeShields]: 'rune-shields',
            [LifeformTechnologyType.rocktalCollectorEnhancement]: 'rocktal-collector-enhancement',

            [LifeformTechnologyType.catalyserTechnology]: 'catalyser-technology',
            [LifeformTechnologyType.plasmaDrive]: 'plasma-drive',
            [LifeformTechnologyType.efficiencyModule]: 'efficiency-module',
            [LifeformTechnologyType.depotAI]: 'depot-aI',
            [LifeformTechnologyType.generalOverhaul_lightFighter]: 'general-overhaul_light-fighter',
            [LifeformTechnologyType.automatedTransportLines]: 'automated-transport-lines',
            [LifeformTechnologyType.improvedDroneAI]: 'improved-drone-aI',
            [LifeformTechnologyType.experimentalRecyclingTechnology]: 'experimental-recycling-technology',
            [LifeformTechnologyType.generalOverhaul_cruiser]: 'general-overhaul_cruiser',
            [LifeformTechnologyType.slingshotAutopilot]: 'slingshot-autopilot',
            [LifeformTechnologyType.highTemperatureSuperconductors]: 'high-temperature-superconductors',
            [LifeformTechnologyType.generalOverhaul_battleship]: 'general-overhaul_battleship',
            [LifeformTechnologyType.artificialSwarmIntelligence]: 'artificial-swarm-intelligence',
            [LifeformTechnologyType.generalOverhaul_battlecruiser]: 'general-overhaul_battlecruiser',
            [LifeformTechnologyType.generalOverhaul_bomber]: 'general-overhaul_bomber',
            [LifeformTechnologyType.generalOverhaul_destroyer]: 'general-overhaul_destroyer',
            [LifeformTechnologyType.experimentalWeaponsTechnology]: 'experimental-weapons-technology',
            [LifeformTechnologyType.mechanGeneralEnhancement]: 'mechan-general-enhancement',

            [LifeformTechnologyType.heatRecovery]: 'heat-recovery',
            [LifeformTechnologyType.sulphideProcess]: 'sulphide-process',
            [LifeformTechnologyType.psionicNetwork]: 'psionic-network',
            [LifeformTechnologyType.telekineticTractorBeam]: 'telekinetic-tractor-beam',
            [LifeformTechnologyType.enhancedSensorTechnology]: 'enhanced-sensor-technology',
            [LifeformTechnologyType.neuromodalCompressor]: 'neuromodal-compressor',
            [LifeformTechnologyType.neuroInterface]: 'neuro-interface',
            [LifeformTechnologyType.interplanetaryAnalysisNetwork]: 'interplanetary-analysis-network',
            [LifeformTechnologyType.overclocking_heavyFighter]: 'overclocking_heavy-fighter',
            [LifeformTechnologyType.telekineticDrive]: 'telekinetic-drive',
            [LifeformTechnologyType.sixthSense]: 'sixth-sense',
            [LifeformTechnologyType.psychoharmoniser]: 'psychoharmoniser',
            [LifeformTechnologyType.efficientSwarmIntelligence]: 'efficient-swarm-intelligence',
            [LifeformTechnologyType.overclocking_largeCargo]: 'overclocking_large-cargo',
            [LifeformTechnologyType.gravitationSensors]: 'gravitation-sensors',
            [LifeformTechnologyType.overclocking_battleship]: 'overclocking_battleship',
            [LifeformTechnologyType.psionicShieldMatrix]: 'psionic-shield-matrix',
            [LifeformTechnologyType.kaeleshDiscovererEnhancement]: 'kaelesh-discoverer-enhancement',
        };
        private get lifeform() {
            return ValidLifeformTypes.find(lf => LifeformTechnologyTypesByLifeform[lf].includes(this.technology));
        }
    }
</script>
<style lang="scss" scoped>
    .o-lifeform-technology {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;
        border: 1px solid;

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }

        &--humans {
            border-color: #7ec000;
        }
        &--rocktal {
            border-color: #df6642;
        }
        &--mechas {
            border-color: #4b91e7;
        }
        &--kaelesh {
            border-color: #9863e9;
        }
    }
</style>