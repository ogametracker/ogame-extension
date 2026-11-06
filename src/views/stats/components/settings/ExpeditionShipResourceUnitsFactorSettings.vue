<template>
    <div class="fake-table expedition-ship-resource-units-factor-settings">
        <div class="fake-table-header">
            <span
                v-text="translations().extension.settings.expeditions.resourceUnitFactorsOfShipFoundOnExpeditions"
            />
        </div>
        <div class="fake-table-body">
            <span class="inputs">
                <span>
                    <span class="two-resources">
                        <OResource :resource="ResourceType.metal" />
                        <OResource :resource="ResourceType.crystal" />
                    </span>

                    <input
                        type="number"
                        v-model.number.lazy="factor"
                        @change="updateFactors()"
                        @focus="isFocused = true"
                        @blur="onBlur()"
                        min="0"
                        max="1"
                        step="0.01"
                    />
                </span>

                <span>
                    <OResource :resource="ResourceType.deuterium" />
                    <input
                        type="number"
                        v-model.number.lazy="deuteriumFactor"
                        @change="updateFactors()"
                        @focus="isFocused = true"
                        @blur="onBlur()"
                        min="0"
                        max="1"
                        step="0.01"
                    />
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
import { useSettingsStore } from '../../data/SettingsDataModule';

const settingsStore = useSettingsStore();

const factor = ref(1);

const deuteriumFactor = ref(1);

const isFocused = ref(false);

const factors = computed(() => settingsStore.settings.expeditionFoundShipsResourceUnits);

function onFactorsChanged() {
    const { factor: localFactor, deuteriumFactor: localDeuteriumFactor } = factors.value;

    if (!isFocused.value) {
        factor.value = localFactor;
        deuteriumFactor.value = localDeuteriumFactor;
    }
}

function updateFactors() {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        expeditionFoundShipsResourceUnits: {
            factor: factor.value,
            deuteriumFactor: deuteriumFactor.value,
        },
    });
}

function onBlur() {
    isFocused.value = false;
    onFactorsChanged();
}

watch(() => factors.value, onFactorsChanged, { immediate: true });
</script>

<style lang="scss" scoped>
    .expedition-ship-resource-units-factor-settings {
        display: flex;
        align-items: center;
        column-gap: 16px;
        max-width: 400px;

        > * {
            display: flex;
        }

        input {
            width: 60px;
        }

        .inputs {
            display: flex;
            column-gap: 8px;

            > * {
                display: flex;
            }
        }
    }

    .two-resources {
        display: flex;
        position: relative;

        > .o-resource:first-of-type {
            position: absolute;
            clip-path: polygon(0 0, 0 100%, 100% 0);
        }
        > .o-resource:last-of-type {
            clip-path: polygon(100% 100%, 0 100%, 100% 0);
        }
    }

    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.7)
                );
            justify-content: center;
        }

        &-header,
        &-body {
            height: 100%;
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>
