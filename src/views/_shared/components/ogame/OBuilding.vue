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
        'metal-mine' = 'metal-mine',
        'crystal-mine' = 'crystal-mine',
        'deuterium-synthesizer' = 'deuterium-synthesizer',

        'metal-storage' = 'metal-storage',
        'crystal-storage' = 'crystal-storage',
        'deuterium-tank' = 'deuterium-tank',

        'solar-plant' = 'solar-plant',
        'fusion-reactor' = 'fusion-reactor',

        'robotics-factory' = 'robotics-factory',
        'shipyard' = 'shipyard',
        'research-lab' = 'research-lab',
        'alliance-depot' = 'alliance-depot',
        'missile-silo' = 'missile-silo',
        'nanite-factory' = 'nanite-factory',
        'terraformer' = 'terraformer',
        'space-dock' = 'space-dock',

        'lunar-base' = 'lunar-base',
        'sensor-phalanx' = 'sensor-phalanx',
        'jump-gate' = 'jump-gate',
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