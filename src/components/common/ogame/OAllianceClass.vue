<template>
    <o-image-base
        class="o-alliance-class"
        :class="type"
        :size="size"
        :disabled="disabled"
    />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    type OAllianceClassType =
        'none'
        | 'trader'
        | 'researcher'
        | 'warrior'
        ;

    @Component({})
    export default class OAllianceClass extends Vue {
        @Prop({ required: true, type: String as PropType<OAllianceClassType> })
        private type!: OAllianceClassType;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    @import "@/styles/env.scss";

    .o-alliance-class {
        &.none {
            background-image: url(#{$base-url}/img/ogame/alliance-classes/none.png);
        }

        &.trader {
            background-image: url(#{$base-url}/img/ogame/alliance-classes/trader.png);
        }

        &.researcher {
            background-image: url(#{$base-url}/img/ogame/alliance-classes/researcher.png);
        }

        &.warrior {
            background-image: url(#{$base-url}/img/ogame/alliance-classes/warrior.png);
        }
    }
</style>