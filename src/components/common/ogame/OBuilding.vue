<template>
    <o-image-base
        class="o-building"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OBuildingType =
        'metal-mine'
        | 'crystal-mine'
        | 'deuterium-synthesizer'
        | 'metal-storage'
        | 'crystal-storage'
        | 'deuterium-tank'
        | 'solar-plant'
        | 'fusion-reactor'
        | 'robotics-factory'
        | 'shipyard'
        | 'research-lab'
        | 'alliance-depot'
        | 'nanite-factory'
        | 'terraformer'
        | 'space-dock'
        | 'lunar-base'
        | 'sensor-phalanx'
        | 'jump-gate'
        ;

    @Component({})
    export default class OBuilding extends Vue {
        @Prop({ required: true, type: String as PropType<OBuildingType> })
        private type!: OBuildingType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-building {
        &.metal-mine {
            background-image: url(#{$base-url}/img/ogame/buildings/Metal_Mine.jpg);
        }

        &.crystal-mine {
            background-image: url(#{$base-url}/img/ogame/buildings/Crystal_Mine.jpg);
        }

        &.deuterium-synthesizer {
            background-image: url(#{$base-url}/img/ogame/buildings/Deuterium_Synthesizer.jpg);
        }

        &.metal-storage {
            background-image: url(#{$base-url}/img/ogame/buildings/Metal_Storage.jpg);
        }

        &.crystal-storage {
            background-image: url(#{$base-url}/img/ogame/buildings/Crystal_Storage.jpg);
        }

        &.deuterium-tank {
            background-image: url(#{$base-url}/img/ogame/buildings/Deuterium_Tank.jpg);
        }

        &.solar-plant {
            background-image: url(#{$base-url}/img/ogame/buildings/Solar_Plant.jpg);
        }

        &.fusion-reactor {
            background-image: url(#{$base-url}/img/ogame/buildings/Fusion_Reactor.jpg);
        }

        &.robotics-factory {
            background-image: url(#{$base-url}/img/ogame/buildings/Robotics_Factory.jpg);
        }

        &.shipyard {
            background-image: url(#{$base-url}/img/ogame/buildings/Shipyard.jpg);
        }

        &.research-lab {
            background-image: url(#{$base-url}/img/ogame/buildings/Research_Lab.jpg);
        }

        &.alliance-depot {
            background-image: url(#{$base-url}/img/ogame/buildings/Alliance_Depot.jpg);
        }

        &.nanite-factory {
            background-image: url(#{$base-url}/img/ogame/buildings/Nanite_Factory.jpg);
        }

        &.terraformer {
            background-image: url(#{$base-url}/img/ogame/buildings/Terraformer.jpg);
        }

        &.space-dock {
            background-image: url(#{$base-url}/img/ogame/buildings/Space_Dock.jpg);
        }

        &.lunar-base {
            background-image: url(#{$base-url}/img/ogame/buildings/Lunar_Base.jpg);
        }

        &.sensor-phalanx {
            background-image: url(#{$base-url}/img/ogame/buildings/Sensor_Phalanx.jpg);
        }

        &.jump-gate {
            background-image: url(#{$base-url}/img/ogame/buildings/Jump_Gate.jpg);
        }
    }
</style>