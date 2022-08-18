<template>
    <div
        class="o-building"
        :class="{
            'o-building--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/buildings/${image}.jpg)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { BuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';

    @Component({})
    export default class OBuilding extends Vue {
        @Prop({
            required: true,
            type: Number as PropType<BuildingType>,
            validator: (value: number) => (BuildingTypes as number[]).includes(value)
        })
        private building!: BuildingType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        private get image() {
            return this.imageMap[this.building];
        }
        private readonly imageMap: Record<BuildingType, string> = {
            [BuildingType.metalMine]: 'metal-mine',
            [BuildingType.crystalMine]: 'crystal-mine',
            [BuildingType.deuteriumSynthesizer]: 'deuterium-synthesizer',

            [BuildingType.metalStorage]: 'metal-storage',
            [BuildingType.crystalStorage]: 'crystal-storage',
            [BuildingType.deuteriumTank]: 'deuterium-tank',

            [BuildingType.solarPlant]: 'solar-plant',
            [BuildingType.fusionReactor]: 'fusion-reactor',

            [BuildingType.roboticsFactory]: 'robotics-factory',
            [BuildingType.shipyard]: 'shipyard',
            [BuildingType.researchLab]: 'research-lab',
            [BuildingType.allianceDepot]: 'alliance-depot',
            [BuildingType.missileSilo]: 'missile-silo',
            [BuildingType.naniteFactory]: 'nanite-factory',
            [BuildingType.terraformer]: 'terraformer',
            [BuildingType.spaceDock]: 'space-dock',

            [BuildingType.lunarBase]: 'lunar-base',
            [BuildingType.sensorPhalanx]: 'sensor-phalanx',
            [BuildingType.jumpGate]: 'jump-gate',
        };
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