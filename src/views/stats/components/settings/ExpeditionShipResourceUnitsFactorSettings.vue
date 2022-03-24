<template>
    <div class="fake-table expedition-ship-resource-units-factor-settings">
        <div class="fake-table-header">
            <span
                v-text="
                    'LOCA: Resource unit factors of ships found on expeditions'
                "
            />
        </div>
        <div class="fake-table-body">
            <span class="inputs">
                <span>
                    <span class="two-resources">
                        <o-resource resource="metal" />
                        <o-resource resource="crystal" />
                    </span>

                    <input
                        type="number"
                        v-model.number.lazy="factor"
                        @change="updateMsuConversionRates()"
                        min="0"
                        max="1"
                        step="0.01"
                    />
                </span>

                <span>
                    <o-resource resource="deuterium" />
                    <input
                        type="number"
                        v-model.number.lazy="deuteriumFactor"
                        @change="updateMsuConversionRates()"
                        min="0"
                        max="1"
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
    export default class ExpeditionShipResourceUnitsFactorSettings extends Vue {
        private factor = 1;
        private deuteriumFactor = 1;

        private get factors() {
            return SettingsDataModule.settings.expeditionFoundShipsResourceUnits;
        }

        @Watch('factors', { immediate: true })
        private onFactorsChanged() {
            const { factor, deuteriumFactor } = this.factors;
            this.factor = factor;
            this.deuteriumFactor = deuteriumFactor;
        }

        private async updateMsuConversionRates() {
            await SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                expeditionFoundShipsResourceUnits: {
                    factor: this.factor,
                    deuteriumFactor: this.deuteriumFactor,
                },
            });
        }

    }
</script>
<style lang="scss" scoped>
    .expedition-ship-resource-units-factor-settings {
        display: flex;
        align-items: center;
        column-gap: 16px;

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
                    rgba(var(--color), 0.5)
                );
            justify-content: center;
        }

        &-header,
        &-body {
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>