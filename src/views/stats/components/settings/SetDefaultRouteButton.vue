<template>
    <button @click="setDefaultRoute($event)" class="default-route-button">
        <span class="mdi mdi-home" />
        <span v-text="label" />
    </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../data/SettingsDataModule';

const props = defineProps({
    label: { required: true, type: String },
    routeName: { required: true, type: String },
    rootRouteName: { required: true, type: String },
});

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const settingsStore = useSettingsStore();

function setDefaultRoute(ev: MouseEvent) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        defaultRoutes: {
            ...settingsStore.settings.defaultRoutes,
            [props.rootRouteName]: props.routeName,
        },
    });

    emit('click', ev);
}
</script>

<style lang="scss" scoped>
    .default-route-button {
        display: flex;
        gap: 4px;
        align-items: center;

        .mdi {
            font-size: 20px;
        }
    }
</style>
