<template>
    <div
        class="o-player-class"
        :class="{
            'o-player-class--disabled': disabled,
            'o-player-class--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/player-classes/${image}.png)`,
            'font-size': size,
        }"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { PlayerClass, PlayerClasses } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';

const props = defineProps({
    playerClass: {
        required: true,
        type: String as PropType<PlayerClass>,
        validator: (value: string) => (PlayerClasses as string[]).includes(value),
    },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean },
    fade: { required: false, type: Boolean },
});

const image = computed(() => imageMap[props.playerClass]);

const imageMap: Record<PlayerClass, string> = {
    [PlayerClass.collector]: 'collector',
    [PlayerClass.discoverer]: 'explorer',
    [PlayerClass.general]: 'general',
    [PlayerClass.none]: 'none',
};
</script>

<style lang="scss" scoped>
.o-player-class {
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
