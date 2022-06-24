<template>
    <div
        class="o-officer"
        :class="{
            'o-officer--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/officers/${officer}.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export enum OOfficerType {
        admiral = 'admiral',
        commander = 'commander',
        engineer = 'engineer',
        geologist = 'geologist',
        technocrat = 'technocrat',
    }

    @Component({})
    export default class OOfficer extends Vue {

        @Prop({
            required: true,
            type: String as PropType<OOfficerType>,
            validator: (value: string) => (Object.values(OOfficerType) as string[]).includes(value)
        })
        private officer!: OOfficerType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;
    }
</script>
<style lang="scss" scoped>
    .o-officer {
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