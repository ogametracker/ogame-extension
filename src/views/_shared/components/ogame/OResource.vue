<template>
    <div
        class="o-resource"
        :resource="resource"
        :class="{
            'o-resource--disabled': disabled,
            'o-resource--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/resources/${image}.upscaled.png)`,
            'font-size': size,
        }"
    />
</template>

<script lang="ts">
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';

export type ExtendedResourceType = ResourceType | 'energy' | 'dark-matter';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
    resource: {
        required: true,
        type: String as PropType<ExtendedResourceType>,
        validator: (value: string) =>
            ['energy', 'dark-matter'].includes(value) || (ResourceTypes as string[]).includes(value),
    },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean },
    fade: { required: false, type: Boolean },
});

const imageMap: Record<ExtendedResourceType, string> = {
    [ResourceType.metal]: 'metal',
    [ResourceType.crystal]: 'crystal',
    [ResourceType.deuterium]: 'deuterium',
    energy: 'energy',
    'dark-matter': 'dark-matter',
};

const image = computed(() => imageMap[props.resource]);
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
    &--fade {
        opacity: 0.3;
    }
}
</style>
