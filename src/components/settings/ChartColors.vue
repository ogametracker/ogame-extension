<template>
    <div>
        <h2>
            {{ $i18n.$t.settings.chartColors.title }}
            <button
                class="reset-button"
                @click="resetChartColors()"
                :title="$i18n.$t.settings.reset"
            >
                <icon name="refresh" />
            </button>
        </h2>
        <div class="color-tables">
            <table class="settings-table">
                <thead>
                    <tr>
                        <th>
                            {{ $i18n.$t.settings.chartColors.expeditions }}

                            <button
                                class="reset-button"
                                @click="resetChartColors('overview')"
                                :title="$i18n.$t.settings.reset"
                            >
                                <icon name="refresh" />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="key in Object.keys(
                            settings.charts.colors.overview
                        )"
                        :key="key"
                    >
                        <td>
                            <color-input
                                v-model="settings.charts.colors.overview[key]"
                                :label="$i18n.$t.expoTypes[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="settings-table">
                <thead>
                    <tr>
                        <th>
                            {{ $i18n.$t.settings.chartColors.resources }}

                            <button
                                class="reset-button"
                                @click="resetChartColors('resources')"
                                :title="$i18n.$t.settings.reset"
                            >
                                <icon name="refresh" />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="key in Object.keys(
                            settings.charts.colors.resources
                        )"
                        :key="key"
                    >
                        <td>
                            <color-input
                                v-model="settings.charts.colors.resources[key]"
                                :label="$i18n.$t.resources[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="settings-table">
                <thead>
                    <tr>
                        <th>
                            {{ $i18n.$t.settings.chartColors.ships }}

                            <button
                                class="reset-button"
                                @click="resetChartColors('overshipsview')"
                                :title="$i18n.$t.settings.reset"
                            >
                                <icon name="refresh" />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="key in Object.keys(settings.charts.colors.ships)"
                        :key="key"
                    >
                        <td>
                            <color-input
                                v-model="settings.charts.colors.ships[key]"
                                :label="$i18n.$t.ships[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="settings-table">
                <thead>
                    <tr>
                        <th>
                            {{ $i18n.$t.settings.chartColors.combats }}

                            <button
                                class="reset-button"
                                @click="resetChartColors('battleResults')"
                                :title="$i18n.$t.settings.reset"
                            >
                                <icon name="refresh" />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="key in Object.keys(
                            settings.charts.colors.battleResults
                        )"
                        :key="key"
                    >
                        <td>
                            <color-input
                                v-model="
                                    settings.charts.colors.battleResults[key]
                                "
                                :label="$i18n.$t.battleResults[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import SettingsModule from '@/store/modules/SettingsModule';
    import { Component, Vue } from 'vue-property-decorator';
    import ColorInput from './ColorInput.vue';

    @Component({
        components: {
            ColorInput,
        },
    })
    export default class ChartColors extends Vue {

        private get settings() {
            return SettingsModule.settings;
        }

        private resetChartColors(key?: keyof ChartColors['settings']['charts']['colors']) {
            const defaults = SettingsModule.getDefaultSettings().charts.colors;

            if (key == null) {
                this.settings.charts.colors = defaults;
            } else {
                this.settings.charts.colors[key] = defaults[key] as any;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .color-tables {
        align-items: flex-start;
        th {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
        }
        .settings-table tbody {
            display: grid;
        }
    }
</style>