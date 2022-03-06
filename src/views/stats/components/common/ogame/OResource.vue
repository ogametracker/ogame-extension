<template>
    <div
        class="o-resource"
        :class="{
            'o-resource--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/resources/${resource}.upscaled.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';

    export enum OResourceType {
        metal = 'metal',
        crystal = 'crystal',
        deuterium = 'deuterium',
        energy = 'energy',
        darkMatter = 'dark-matter',
        tritium = 'tritium',
    }

    @Component({})
    export default class OResource extends Vue {

        @Prop({
            required: true,
            type: String as PropType<OResourceType>,
            validator: (value: string) => (Object.values(OResourceType) as string[]).includes(value)
        })
        private resource!: OResourceType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;
    }
</script>
<style lang="scss" scoped>
    .o-resource {
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