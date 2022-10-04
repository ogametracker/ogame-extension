<template>
    <div
        class="o-lifeform-building"
        :class="[
            {
                'o-lifeform-building--disabled': disabled,
                'o-lifeform-building--fade': fade,
            },
            `o-lifeform-building--${lifeform}`,
        ]"
        :style="{
            'background-image': `url(/img/ogame/lifeforms/buildings/${image}.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { LifeformBuildingType, LifeformBuildingTypes, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTypes, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({})
    export default class OLifeformBuilding extends Vue {
        @Prop({
            required: true,
            type: Number as PropType<LifeformBuildingType>,
            validator: (value: number) => (LifeformBuildingTypes as number[]).includes(value)
        })
        private building!: LifeformBuildingType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Boolean })
        private fade!: boolean;

        private get image() {
            return this.imageMap[this.building];
        }
        private readonly imageMap: Record<LifeformBuildingType, string> = {
            [LifeformBuildingType.residentialSector]: 'residential-sector',
            [LifeformBuildingType.biosphereFarm]: 'biosphere-farm',
            [LifeformBuildingType.researchCentre]: 'research-centre',
            [LifeformBuildingType.academyOfSciences]: 'academy-of-sciences',
            [LifeformBuildingType.neuroCalibrationCentre]: 'neuro-calibration-centre',
            [LifeformBuildingType.highEnergySmelting]: 'high-energy-smelting',
            [LifeformBuildingType.foodSilo]: 'food-silo',
            [LifeformBuildingType.fusionPoweredProduction]: 'fusion-powered-production',
            [LifeformBuildingType.skyscraper]: 'skyscraper',
            [LifeformBuildingType.biotechLab]: 'biotech-lab',
            [LifeformBuildingType.metropolis]: 'metropolis',
            [LifeformBuildingType.planetaryShield]: 'planetary-shield',

            [LifeformBuildingType.meditationEnclave]: 'meditation-enclave',
            [LifeformBuildingType.crystalFarm]: 'crystal-farm',
            [LifeformBuildingType.runeTechnologium]: 'rune-technologium',
            [LifeformBuildingType.runeForge]: 'rune-forge',
            [LifeformBuildingType.oriktorium]: 'oriktorium',
            [LifeformBuildingType.magmaForge]: 'magma-forge',
            [LifeformBuildingType.disruptionChamber]: 'disruption-chamber',
            [LifeformBuildingType.megalith]: 'megalith',
            [LifeformBuildingType.crystalRefinery]: 'crystal-refinery',
            [LifeformBuildingType.deuteriumSynthesiser]: 'deuterium-synthesiser',
            [LifeformBuildingType.mineralResearchCentre]: 'mineral-research-centre',
            [LifeformBuildingType.advancedRecyclingPlant]: 'advanced-recycling-plant',

            [LifeformBuildingType.assemblyLine]: 'assembly-line',
            [LifeformBuildingType.fusionCellFactory]: 'fusion-cell-factory',
            [LifeformBuildingType.roboticsResearchCentre]: 'robotics-research-centre',
            [LifeformBuildingType.updateNetwork]: 'update-network',
            [LifeformBuildingType.quantumComputerCentre]: 'quantum-computer-centre',
            [LifeformBuildingType.automatisedAssemblyCentre]: 'automatised-assembly-centre',
            [LifeformBuildingType.highPerformanceTransformer]: 'high-performance-transformer',
            [LifeformBuildingType.microchipAssemblyLine]: 'microchip-assembly-line',
            [LifeformBuildingType.productionAssemblyHall]: 'production-assembly-hall',
            [LifeformBuildingType.highPerformanceSynthesiser]: 'high-performance-synthesiser',
            [LifeformBuildingType.chipMassProduction]: 'chip-mass-production',
            [LifeformBuildingType.nanoRepairBots]: 'nano-repair-bots',

            [LifeformBuildingType.sanctuary]: 'sanctuary',
            [LifeformBuildingType.antimatterCondenser]: 'antimatter-condenser',
            [LifeformBuildingType.vortexChamber]: 'vortex-chamber',
            [LifeformBuildingType.hallsOfRealisation]: 'halls-of-realisation',
            [LifeformBuildingType.forumOfTranscendence]: 'forum-of-transcendence',
            [LifeformBuildingType.antimatterConvector]: 'antimatter-convector',
            [LifeformBuildingType.cloningLaboratory]: 'cloning-laboratory',
            [LifeformBuildingType.chrysalisAccelerator]: 'chrysalis-accelerator',
            [LifeformBuildingType.bioModifier]: 'bio-modifier',
            [LifeformBuildingType.psionicModulator]: 'psionic-modulator',
            [LifeformBuildingType.shipManufacturingHall]: 'ship-manufacturing-hall',
            [LifeformBuildingType.supraRefractor]: 'supra-refractor',
        };
        private get lifeform() {
            return ValidLifeformTypes.find(lf => LifeformBuildingTypesByLifeform[lf].includes(this.building));
        }
    }
</script>
<style lang="scss" scoped>
    .o-lifeform-building {
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
        &--fade {
            opacity: 0.3;
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