<template>
    <o-image-base
        class="o-officer"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OOfficerType =
        'commander'
        | 'admiral'
        | 'engineer'
        | 'geologist'
        | 'technocrat'
        ;

    @Component({})
    export default class OOfficer extends Vue {
        @Prop({ required: true, type: String as PropType<OOfficerType> })
        private type!: OOfficerType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-officer {
        &.commander {
            background-image: url(#{$base-url}/img/ogame/officers/commander.png);
        }

        &.admiral {
            background-image: url(#{$base-url}/img/ogame/officers/admiral.png);
        }

        &.engineer {
            background-image: url(#{$base-url}/img/ogame/officers/engineer.png);
        }

        &.geologist {
            background-image: url(#{$base-url}/img/ogame/officers/geologist.png);
        }

        &.technocrat {
            background-image: url(#{$base-url}/img/ogame/officers/technocrat.png);
        }
    }
</style>