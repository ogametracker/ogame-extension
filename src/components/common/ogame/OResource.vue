<template>
    <o-image-base
        class="o-resource"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OResourceType =
        'metal'
        | 'crystal'
        | 'deuterium'
        | 'energy'
        | 'dark-matter'
        | 'tritium'
        ;

    @Component({})
    export default class OResource extends Vue {
        @Prop({ required: true, type: String as PropType<OResourceType> })
        private type!: OResourceType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-resource {
        &.metal {
            background-image: url(#{$base-url}/img/ogame/resources/metal.upscaled.jpg);
        }
        
        &.crystal {
            background-image: url(#{$base-url}/img/ogame/resources/crystal.upscaled.jpg);
        }
        
        &.deuterium {
            background-image: url(#{$base-url}/img/ogame/resources/deuterium.upscaled.jpg);
        }
        
        &.energy {
            background-image: url(#{$base-url}/img/ogame/resources/energy.upscaled.jpg);
        }
        
        &.dark-matter {
            background-image: url(#{$base-url}/img/ogame/resources/dark-matter.upscaled.jpg);
        }
        
        &.tritium {
            background-image: url(#{$base-url}/img/ogame/resources/tritium.upscaled.jpg);
        }
    }
</style>