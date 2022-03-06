<template>
    <div
        class="o-building"
        :class="{
            'o-building--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/buildings/${building}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export enum OBuildingType {
        metalMine = 'metal-mine',
        crystalMine = 'crystal-mine',
        deuteriumSynthesizer = 'deuterium-synthesizer',

        metalStorage = 'metal-storage',
        crystalStorage = 'crystal-storage',
        deuteriumTank = 'deuterium-tank',

        solarPlant = 'solar-plant',
        fusionReactor = 'fusion-reactor',

        roboticsFactory = 'robotics-factory',
        shipyard = 'shipyard',
        researchLab = 'research-lab',
        allianceDepot = 'alliance-depot',
        missileSilo = 'missile-silo',
        naniteFactory = 'nanite-factory',
        terraformer = 'terraformer',
        spaceDock = 'space-dock',

        lunarBase = 'lunar-base',
        sensorPhalanx = 'sensor-phalanx',
        jumpGate = 'jump-gate',
    }

    @Component({})
    export default class OBuilding extends Vue {

        @Prop({
            required: true,
            type: String as PropType<OBuildingType>,
            validator: (value: string) => (Object.values(OBuildingType) as string[]).includes(value)
        })
        private building!: OBuildingType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;
    }
</script>
<style lang="scss" scoped>
    .o-building {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
    }
</style>