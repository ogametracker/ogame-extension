<template>
    <div
        class="o-defense"
        :class="{
            'o-defense--disabled': disabled,
            'o-defense--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/defense/${image}.jpg)`,
            'font-size': size,
        }"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { DefenseType } from '@ogame-tracker/shared/models/ogame/defenses/DefenseType';
import { DefenseTypes } from '@ogame-tracker/shared/models/ogame/defenses/DefenseTypes';

const props = defineProps({
    defense: { required: true, type: Number as PropType<DefenseType>, validator: (value: number) => (DefenseTypes as number[]).includes(value) },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean },
    fade: { required: false, type: Boolean },
});

const image = computed(() => imageMap[props.defense]);

const imageMap: Record<DefenseType, string> = {
    [DefenseType.rocketLauncher]: 'rocket-launcher',
    [DefenseType.lightLaser]: 'light-laser',
    [DefenseType.heavyLaser]: 'heavy-laser',
    [DefenseType.gaussCannon]: 'gauss-cannon',
    [DefenseType.ionCannon]: 'ion-cannon',
    [DefenseType.plasmaTurret]: 'plasma-turret',
    [DefenseType.smallShieldDome]: 'small-shield-dome',
    [DefenseType.largeShieldDome]: 'large-shield-dome',
};
</script>

<style lang="scss" scoped>
    .o-defense {
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
