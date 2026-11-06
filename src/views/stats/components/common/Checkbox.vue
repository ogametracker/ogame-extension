<template>
    <span class="checkbox" @click="onClick($event)" :class="{disabled: disabled}">
        <span class="checkmark">
            <span class="mdi" :style="{ color: color ?? undefined }" :class="checked ? 'mdi-checkbox-blank' : 'mdi-checkbox-blank-outline'" />
            <span class="check-icon mdi mdi-check" v-if="checked" :style="{ color: checkColor ?? undefined }"/>
        </span>

        <span v-if="$slots.label != null">
            <slot name="label" />
        </span>
        <span v-else-if="label != null" v-text="label" />
    </span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
    disabled: { required: false, type: Boolean },
    color: { required: false, type: String as PropType<string | null>, default: () => null },
    checkColor: { required: false, type: String as PropType<string | null>, default: () => null },
    label: { required: false, type: String as PropType<string | null>, default: () => null },
});

const emit = defineEmits<{ 'input-extended': [event: { value: boolean; shift: boolean; ctrl: boolean; alt: boolean }] }>();

const checked = defineModel<boolean>({ required: true, type: Boolean });

function onClick(event: MouseEvent) {
    if (props.disabled) {
        return;
    }

    const nextChecked = !checked.value;
    checked.value = nextChecked;

    emit('input-extended', {
        value: nextChecked,
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        alt: event.altKey,
    });
}
</script>

<style lang="scss" scoped>
    .checkbox {
        display: inline-flex;
        cursor: pointer;
        column-gap: 2px;
        align-items: center;

        .checkmark {
            color: rgb(var(--color));
            font-size: 20px;
            position: relative;

            > .check-icon {
                color: white;
                transform: scale(0.75);
                display: inline-block;
                position: absolute;
                left: 0;
                top: 0;
            }
        }

        &.disabled {
            pointer-events: none;
            cursor: default;
            --color: 80, 80, 80;
            color: #888888;
        }
    }
</style>
