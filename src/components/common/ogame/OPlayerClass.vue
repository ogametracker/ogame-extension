<template>
    <o-image-base
        class="o-player-class"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OPlayerClassType =
        'none'
        | 'collector'
        | 'discoverer'
        | 'general'
        ;

    @Component({})
    export default class OPlayerClass extends Vue {
        @Prop({ required: true, type: String as PropType<OPlayerClassType> })
        private type!: OPlayerClassType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-player-class {
        &.none {
            background-image: url(#{$base-url}/img/ogame/player-classes/none.png);
        }

        &.collector {
            background-image: url(#{$base-url}/img/ogame/player-classes/collector.png);
        }

        &.discoverer {
            background-image: url(#{$base-url}/img/ogame/player-classes/explorer.png);
        }

        &.general {
            background-image: url(#{$base-url}/img/ogame/player-classes/general.png);
        }
    }
</style>