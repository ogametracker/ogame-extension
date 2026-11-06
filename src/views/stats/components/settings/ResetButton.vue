<template>
    <button class="reset-button" @click="emit('reset')" :title="translations().extension.settings.reset">
        <span class="mdi mdi-refresh" />
    </button>
</template>

<script setup lang="ts">
import { translations } from '@stats/i18n';

const emit = defineEmits(['reset']);
</script>

<style lang="scss" scoped>
    .reset-button {
        background: rgba(var(--color), 0.25) !important;
        font-size: 14px;
        display: inline-flex;
        align-items: baseline;
        cursor: pointer;
        margin-left: 8px;
        background: none;
        padding: 0 4px;

        &:hover {
            background: rgba(var(--color), 0.5) !important;
        }

        > .mdi {
            transform: scale(1.3);
        }
    }
</style>
