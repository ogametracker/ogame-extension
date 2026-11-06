<template>
    <button
        class="checkbox-button"
        :style="{
            '--color': getRGBString(checked ? color : uncheckedColor) ?? undefined,
        }"
        @click="checked = !checked"
    >
        <slot v-if="$slots.default != null" />
        <span v-else v-text="label" />
    </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { getRGBString } from '../../utils/getRGBString';

defineProps({
    color: { required: false, type: String as PropType<string | null>, default: () => null },
    uncheckedColor: { required: false, type: String as PropType<string | null>, default: () => '#666666' },
    label: { required: false, type: String as PropType<string | null>, default: () => null },
});

const checked = defineModel<boolean>({ required: true, type: Boolean });
</script>
