<template>
    <GridTable class="color-settings" :columns="columns" :items="items" style="width: max-content">
        <template #header-key="{ label }">
            <span v-text="label" />
            <ResetButton @reset="emit('reset')" />
        </template>
        <template #cell-key="{ value: key }">
            <label class="color-input">
                <input type="color" :value="colors[key as K]" @change="updateColor(key, $event)" />
                <div class="color-indicator" :style="{ background: colors[key as K] }" />
                <span v-text="labels[key as K]" />
            </label>
        </template>
    </GridTable>
</template>

<script setup lang="ts" generic="K extends string | number">
import GridTable from '@stats/components/common/GridTable.vue';
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { GridTableColumn } from '../../common/GridTable.vue';
import ResetButton from '../ResetButton.vue';

const props = defineProps({
    header: { required: true, type: String },
    labels: { required: true, type: Object as PropType<Record<K, string>> },
    keys: { required: false, type: Array as PropType<K[] | null>, default: () => null },
});

const emit = defineEmits<{ reset: [] }>();

const colors = defineModel<Record<K, string>>({ required: true, type: Object as PropType<Record<K, string>> });

const columns = computed<GridTableColumn[]>(() => {
    return [
        {
            key: 'key',
            label: props.header,
            headerClass: 'color-settings-header',
        },
    ];
});

const items = computed<{ key: K }[]>(() => {
    const keys = props.keys ?? (Object.keys(colors.value) as K[]);
    return keys.map(key => ({ key }));
});

function updateColor(key: K, event: Event) {
    if (event.target instanceof HTMLInputElement) {
        colors.value = {
            ...colors.value,
            [key]: event.target.value,
        };
    }
}
</script>

<style lang="scss" scoped>
.color-input {
    display: flex;
    flex-grow: 1;
    align-items: center;
    cursor: pointer;
    column-gap: 4px;

    > input[type='color'] {
        width: 0;
        height: 0;
        box-sizing: border-box;
        transform: scale(0);
        display: inline;
        padding: 0;
        border: none;
    }

    > .color-indicator {
        height: 24px;
        width: 24px;
        display: inline-block;
        border-radius: 4px;
    }
}

.color-settings:deep(.color-settings-header) {
    justify-content: center;
}
</style>
