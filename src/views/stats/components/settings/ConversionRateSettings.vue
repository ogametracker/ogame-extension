<template>
    <div class="conversion-rate-settings fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.extension.settings.common.conversionRates.title" />
        </div>
        <div class="fake-table-body">
            <select :value="conversionMode" @input="setConversionMode($event.target.value)">
                <option value="msu" v-text="`${$i18n.$t.extension.settings.common.conversionRates.msuLong} (${$i18n.$t.extension.common.msu})`" />
                <option value="dsu" v-text="`${$i18n.$t.extension.settings.common.conversionRates.dsuLong} (${$i18n.$t.extension.common.dsu})`" />
            </select>

            <span class="inputs" v-if="conversionMode == 'msu'">
                <span>
                    <o-resource resource="crystal" />
                    <input type="number" :value="1" readonly />
                    <span class="equal mdi mdi-equal" />
                    <input type="number" v-model.number.lazy="msu.crystal" @change="updateMsuConversionRates()" min="1" max="3" step="0.01" />
                    <o-resource resource="metal" />
                </span>

                <span>
                    <o-resource resource="deuterium" />
                    <input type="number" :value="1" readonly />
                    <span class="equal mdi mdi-equal" />
                    <input type="number" v-model.number.lazy="msu.deuterium" @change="updateMsuConversionRates()" min="2" max="5" step="0.01" />
                    <o-resource resource="metal" />
                </span>
            </span>
            <span class="inputs" v-else>
                <span>
                    <o-resource resource="metal" />
                    <input type="number" v-model.number.lazy="dsu.metal" @change="updateDsuConversionRates()" min="2" max="5" step="0.01" />
                    <span class="equal mdi mdi-equal" />
                    <input type="number" :value="1" readonly />
                    <o-resource resource="deuterium" />
                </span>

                <span>
                    <o-resource resource="crystal" />
                    <input type="number" v-model.number.lazy="dsu.crystal" @change="updateDsuConversionRates()" min="1" max="3" step="0.01" />
                    <span class="equal mdi mdi-equal" />
                    <input type="number" :value="1" readonly />
                    <o-resource resource="deuterium" />
                </span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { ResourceConversionMode } from '@/shared/models/settings/Settings';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class ConversionRateSettings extends Vue {

        private readonly msu = {
            crystal: 2,
            deuterium: 3,
        };
        private readonly dsu = {
            metal: 3,
            crystal: 2,
        };

        private get msuRates() {
            return SettingsDataModule.settings.conversionRates.msu;
        }
        private get dsuRates() {
            return SettingsDataModule.settings.conversionRates.dsu;
        }
        private get conversionMode() {
            return SettingsDataModule.settings.conversionRates.mode;
        }

        private setConversionMode(mode: ResourceConversionMode) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                conversionRates: {
                    ...SettingsDataModule.settings.conversionRates,
                    mode,
                },
            });
        }

        @Watch('msuRates', { immediate: true })
        private onMsuRatesChanged() {
            const { crystal, deuterium } = this.msuRates;
            this.msu.crystal = crystal;
            this.msu.deuterium = deuterium;
        }

        private updateMsuConversionRates() {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                conversionRates: {
                    ...SettingsDataModule.settings.conversionRates,
                    msu: this.msu,
                },
            });
        }

        @Watch('dsuRates', { immediate: true })
        private onDsuRatesChanged() {
            const { crystal, metal } = this.dsuRates;
            this.dsu.crystal = crystal;
            this.dsu.metal = metal;
        }

        private updateDsuConversionRates() {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                conversionRates: {
                    ...SettingsDataModule.settings.conversionRates,
                    dsu: this.dsu,
                },
            });
        }
    }
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

        input[type="number"] {
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