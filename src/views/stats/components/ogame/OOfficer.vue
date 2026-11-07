<template>
    <div
        class="o-officer"
        :class="{
            'o-officer--disabled': disabled,
            'o-officer--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/officers/${officer}.png)`,
            'font-size': size,
        }"
    />
</template>

<script lang="ts">
export enum OOfficerType {
    admiral = 'admiral',
    commander = 'commander',
    engineer = 'engineer',
    geologist = 'geologist',
    technocrat = 'technocrat',
}
</script>

<script setup lang="ts">
import type { PropType } from 'vue';

defineProps({
    officer: {
        required: true,
        type: String as PropType<OOfficerType>,
        validator: (value: string) => (Object.values(OOfficerType) as string[]).includes(value),
    },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean },
    fade: { required: false, type: Boolean },
});
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
    &--fade {
        opacity: 0.3;
    }
}
</style>
