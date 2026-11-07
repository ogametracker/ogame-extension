<template>
    <div class="conversion-rate-settings fake-table">
        <div class="fake-table-header">
            <span v-text="translations().extension.settings.common.conversionRates.title" />
        </div>
        <div class="fake-table-body">
            <select
                :value="conversionMode"
                @input="setConversionMode(($event.target as HTMLSelectElement).value as ResourceConversionMode)"
            >
                <option
                    value="msu"
                    v-text="
                        `${translations().extension.settings.common.conversionRates.msuLong} (${translations().extension.common.msu})`
                    "
                />
                <option
                    value="dsu"
                    v-text="
                        `${translations().extension.settings.common.conversionRates.dsuLong} (${translations().extension.common.dsu})`
                    "
                />
            </select>

            <span class="inputs" v-if="conversionMode == 'msu'">
                <span>
                    <OResource :resource="ResourceType.crystal" />
                    <input type="number" :value="1" readonly />
                    <span class="equal mdi mdi-equal" />
                    <input
                        type="number"
                        v-model.number.lazy="msu.crystal"
                        @change="updateMsuConversionRates()"
                        min="1"
                        max="3"
                        step="0.01"
                    />
                    <OResource :resource="ResourceType.metal" />
                </span>

                <span>
                    <OResource :resource="ResourceType.deuterium" />
                    <input type="number" :value="1" readonly />
                    <span class="equal mdi mdi-equal" />
                    <input
                        type="number"
                        v-model.number.lazy="msu.deuterium"
                        @change="updateMsuConversionRates()"
                        min="2"
                        max="5"
                        step="0.01"
                    />
                    <OResource :resource="ResourceType.metal" />
                </span>
            </span>
            <span class="inputs" v-else>
                <span>
                    <OResource :resource="ResourceType.metal" />
                    <input
                        type="number"
                        v-model.number.lazy="dsu.metal"
                        @change="updateDsuConversionRates()"
                        min="2"
                        max="5"
                        step="0.01"
                    />
                    <span class="equal mdi mdi-equal" />
                    <input type="number" :value="1" readonly />
                    <OResource :resource="ResourceType.deuterium" />
                </span>

                <span>
                    <OResource :resource="ResourceType.crystal" />
                    <input
                        type="number"
                        v-model.number.lazy="dsu.crystal"
                        @change="updateDsuConversionRates()"
                        min="1"
                        max="3"
                        step="0.01"
                    />
                    <span class="equal mdi mdi-equal" />
                    <input type="number" :value="1" readonly />
                    <OResource :resource="ResourceType.deuterium" />
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed, ref, watch } from 'vue';
import { translations } from '@stats/i18n';
import type { ResourceConversionMode } from '@ogame-tracker/shared/models/settings/Settings';
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const msu = ref({
    crystal: 2,
    deuterium: 3,
});

const dsu = ref({
    metal: 3,
    crystal: 2,
});

const msuRates = computed(() => settingsStore.settings.conversionRates.msu);

const dsuRates = computed(() => settingsStore.settings.conversionRates.dsu);

const conversionMode = computed(() => settingsStore.settings.conversionRates.mode);

function setConversionMode(mode: ResourceConversionMode) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        conversionRates: {
            ...settingsStore.settings.conversionRates,
            mode,
        },
    });
}

function onMsuRatesChanged() {
    const { crystal, deuterium } = msuRates.value;
    msu.value.crystal = crystal;
    msu.value.deuterium = deuterium;
}

function updateMsuConversionRates() {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        conversionRates: {
            ...settingsStore.settings.conversionRates,
            msu: msu.value,
        },
    });
}

function onDsuRatesChanged() {
    const { crystal, metal } = dsuRates.value;
    dsu.value.crystal = crystal;
    dsu.value.metal = metal;
}

function updateDsuConversionRates() {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        conversionRates: {
            ...settingsStore.settings.conversionRates,
            dsu: dsu.value,
        },
    });
}

watch(() => msuRates.value, onMsuRatesChanged, { immediate: true });

watch(() => dsuRates.value, onDsuRatesChanged, { immediate: true });
</script>

<style lang="scss" scoped>
.conversion-rate-settings {
    display: flex;
    column-gap: 16px;
    align-items: center;
    max-width: 400px;

    .inputs {
        display: flex;
        flex-direction: column;
        row-gap: 8px;

        > * {
            display: flex;
        }
    }

    input[type='number'] {
        width: 60px;
        &:read-only {
            background: rgba(var(--color), 0.1);
        }
    }

    .equal {
        font-size: 1rem;
        align-self: center;
    }
}

.fake-table {
    border: 1px solid rgba(var(--color), 0.5);
    border-radius: 4px;
    display: grid;
    width: fit-content;

    &-header {
        background: black linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        justify-content: center;
    }

    &-header,
    &-body {
        height: 100%;
        padding: 8px;
        display: flex;
        align-items: center;
    }

    &-body {
        flex-direction: column;
        align-items: start;
        row-gap: 8px;
    }
}
</style>
