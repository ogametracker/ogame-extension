<template>
    <div class="msu-conversion-rate-settings fake-table">
        <div class="fake-table-header">
            <span v-text="$i18n.$t.settings.common.msuConversionRates" />
        </div>
        <div class="fake-table-body">
            <span class="msu-inputs">
                <span>
                    <o-resource resource="metal" />
                    <input type="number" value="1" readonly />
                </span>

                <span>
                    <o-resource resource="crystal" />
                    <input
                        type="number"
                        v-model.number.lazy="crystal"
                        @change="updateMsuConversionRates()"
                        min="1"
                        max="3"
                        step="0.01"
                    />
                </span>

                <span>
                    <o-resource resource="deuterium" />
                    <input
                        type="number"
                        v-model.number.lazy="deuterium"
                        @change="updateMsuConversionRates()"
                        min="2"
                        max="5"
                        step="0.01"
                    />
                </span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';

    @Component({})
    export default class MsuConversionRateSettings extends Vue {

        private crystal = 2;
        private deuterium = 3;

        private get msuRates() {
            return SettingsDataModule.settings.msuConversionRates;
        }

        @Watch('msuRates', { immediate: true })
        private onMsuRatesChanged() {
            const { crystal, deuterium } = this.msuRates;
            this.crystal = crystal;
            this.deuterium = deuterium;
        }

        private updateMsuConversionRates() {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                msuConversionRates: {
                    crystal: this.crystal,
                    deuterium: this.deuterium,
                },
            });
        }
    }
</script>
<style lang="scss" scoped>
    .msu-conversion-rate-settings {
        display: flex;
        column-gap: 16px;
        align-items: center;
        max-width: 400px;

        .msu-inputs {
            display: flex;
            column-gap: 8px;

            > * {
                display: flex;
            }
        }

        input[type="number"] {
            width: 60px;
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