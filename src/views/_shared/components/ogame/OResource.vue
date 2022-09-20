<template>
    <div
        class="o-resource"
        :class="{
            'o-resource--disabled': disabled,
        }"
        :style="{
            'background-image': `url(/img/ogame/resources/${image}.upscaled.png)`,
            'font-size': size,
        }"
        v-on="$listeners"
        v-bind="{ ...$attrs, ...$props }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { ResourceType, ResourceTypes } from '@/shared/models/ogame/resources/ResourceType';

    export type ExtendedResourceType = ResourceType | 'energy' | 'dark-matter';

    @Component({})
    export default class OResource extends Vue {
        @Prop({
            required: true,
            type: String as PropType<ExtendedResourceType>,
            validator: (value: string) => ['energy', 'dark-matter'].includes(value) || (ResourceTypes as string[]).includes(value)
        })
        private resource!: ExtendedResourceType;

        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Boolean })
        private border!: boolean;

        private get image() {
            return this.imageMap[this.resource];
        }
        private readonly imageMap: Record<ExtendedResourceType, string> = {
            [ResourceType.metal]: 'metal',
            [ResourceType.crystal]: 'crystal',
            [ResourceType.deuterium]: 'deuterium',
            energy: 'energy',
            'dark-matter': 'dark-matter',
        };
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