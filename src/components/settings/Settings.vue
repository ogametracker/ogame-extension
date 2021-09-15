<template>
    <div class="settings">
        <tab-view :items="items" vertical>
            <template #date-ranges
                ><h2>
                    {{ $i18n.$t.settings.titleDateRanges }}
                    <button
                        class="reset-button"
                        @click="resetDateRanges()"
                        :title="$i18n.$t.settings.reset"
                    >
                        <icon name="refresh" />
                    </button>
                </h2>
                <span style="margin-bottom: 8px; display: inline-block">
                    {{ $i18n.$t.settings.hintDateRanges }}
                </span>
                <table class="settings-table">
                    <thead>
                        <tr>
                            <th style="width: 30px"></th>
                            <th style="width: 200px">
                                {{ $i18n.$t.settings.name }}
                            </th>
                            <th style="width: 150px">
                                {{ $i18n.$t.settings.type }}
                            </th>
                            <th style="width: 200px">
                                {{
                                    $i18n.$t.settings
                                        .rangeStarts
                                }}
                            </th>
                            <th style="width: 200px">
                                {{
                                    $i18n.$t.settings
                                        .rangeContains
                                }}
                            </th>
                        </tr>
                    </thead>

                    <draggable v-model="settings.tables.ranges" tag="tbody">
                        <tr
                            v-for="(range, index) in settings.tables.ranges"
                            :key="index"
                        >
                            <td>
                                <span
                                    @click="removeRange(index)"
                                    class="clickable"
                                >
                                    <icon
                                        v-if="range.type != 'all'"
                                        name="minus"
                                    />
                                </span>
                            </td>
                            <td class="name-col">
                                <input
                                    v-if="range.type != 'all'"
                                    v-model="range.label"
                                />
                                <span v-else>
                                    {{ $i18n.$t.since }}
                                    {{
                                        $i18n.$t.settings
                                            .firstDay
                                    }}
                                </span>
                            </td>
                            <td class="value-col">
                                <select
                                    v-if="range.type != 'all'"
                                    v-model="range.type"
                                >
                                    <option
                                        v-for="(rangeType, index) in rangeTypes"
                                        :key="index"
                                        :value="rangeType"
                                    >
                                        {{
                                            $i18n.$t.settings
                                                .rangeType[rangeType]
                                        }}
                                    </option>
                                </select>

                                <span v-else>
                                    {{
                                        $i18n.$t.settings
                                            .rangeType[range.type]
                                    }}
                                </span>
                            </td>
                            <td class="value-col">
                                <span v-if="range.type != 'all'">
                                    {{
                                        $i18n.$t.settings.before
                                    }}
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        v-model="range.skip"
                                    />
                                    {{
                                        $i18n.$t.settings[
                                            `${range.type}sVariant`
                                        ]
                                    }}
                                </span>
                            </td>
                            <td class="value-col">
                                <span v-if="range.type != 'all'">
                                    <input
                                        type="number"
                                        step="1"
                                        min="1"
                                        v-model="range.take"
                                    />
                                    {{
                                        $i18n.$t.settings[
                                            `${range.type}s`
                                        ]
                                    }}
                                </span>
                            </td>
                        </tr>
                    </draggable>

                    <tfoot>
                        <tr>
                            <td>
                                <span class="clickable" @click="addRange()">
                                    <icon name="plus" />
                                </span>
                            </td>
                            <td colspan="4" />
                        </tr>
                    </tfoot>
                </table>
            </template>

            <template #chart-colors>
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
                                    {{
                                        $i18n.$t.settings
                                            .chartColors.expeditions
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="resetChartColors('overview')"
                                        :title="
                                            $i18n.$t.settings
                                                .reset
                                        "
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
                                        v-model="
                                            settings.charts.colors.overview[key]
                                        "
                                        :label="
                                            $i18n.$t.expoTypes[key]
                                        "
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>
                                    {{
                                        $i18n.$t.settings
                                            .chartColors.resources
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="resetChartColors('resources')"
                                        :title="
                                            $i18n.$t.settings
                                                .reset
                                        "
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
                                        v-model="
                                            settings.charts.colors.resources[
                                                key
                                            ]
                                        "
                                        :label="
                                            $i18n.$t.resources[key]
                                        "
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>
                                    {{
                                        $i18n.$t.settings
                                            .chartColors.ships
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="
                                            resetChartColors('overshipsview')
                                        "
                                        :title="
                                            $i18n.$t.settings
                                                .reset
                                        "
                                    >
                                        <icon name="refresh" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="key in Object.keys(
                                    settings.charts.colors.ships
                                )"
                                :key="key"
                            >
                                <td>
                                    <color-input
                                        v-model="
                                            settings.charts.colors.ships[key]
                                        "
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
                                    {{
                                        $i18n.$t.settings
                                            .chartColors.combats
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="
                                            resetChartColors('battleResults')
                                        "
                                        :title="
                                            $i18n.$t.settings
                                                .reset
                                        "
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
                                            settings.charts.colors
                                                .battleResults[key]
                                        "
                                        :label="
                                            $i18n.$t.battleResults[
                                                key
                                            ]
                                        "
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>

            <template #import-export>
                <!-- <h2>{{ $i18n.$t.settings.export }}</h2>
                <textarea
                    readonly
                    :value="exportJson"
                    style="width: 60%; height: 300px"
                    @focus="$event.target.select()"
                />

                <hr />

                <h2>{{ $i18n.$t.settings.import }}</h2> -->
                <h1>Coming Soon&trade;</h1>
            </template>
        </tab-view>
    </div>
</template>

<script lang="ts">
    
    import { DateRangeType } from '@/models/settings/DateRange';
    import BattleModule from '@/store/modules/BattleModule';
    import DebrisFieldModule from '@/store/modules/DebrisFieldModule';
    import ExpoModule from '@/store/modules/ExpoModule';
    import NotificationModule from '@/store/modules/NotificationModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import draggable from 'vuedraggable';
    import { TabViewItem } from '../common/TabView.vue';
    import ColorInput from './ColorInput.vue';

    @Component({
        components: {
            draggable,
            ColorInput,
        },
    })
    export default class Settings extends Vue {
        private readonly rangeTypes: DateRangeType[] = [
            'day',
            'week',
            'month',
        ];

        private get settings() {
            return SettingsModule.settings;
        }

        private readonly items: TabViewItem[] = [
            {
                name: 'date-ranges',
                title: this.$i18n.$t.settings.titleDateRanges,
            },
            {
                name: 'chart-colors',
                title: this.$i18n.$t.settings.chartColors.title,
            },
            {
                name: 'import-export',
                title: this.$i18n.$t.settings.titleImportExport,
            },
        ];

        private addRange() {
            SettingsModule.settings.tables.ranges.push({
                type: 'day',
                skip: 0,
                take: 1,
                label: this.$i18n.$t.settings.newRange,
            });
        }

        private removeRange(index: number) {
            SettingsModule.settings.tables.ranges.splice(index, 1);
        }

        @Watch('settings', { deep: true })
        private settingsChanged() {
            this.saveDelayed();
        }

        private saveTimeout: number | null = null;
        private readonly saveDelay = 1000;
        private saveDelayed() {
            if (this.saveTimeout != null) {
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(async () => {
                await SettingsModule.save();
                this.saveTimeout = null;

                NotificationModule.addNotification({
                    type: 'success',
                    title: this.$i18n.$t.notifications.settingsSaved.title,
                    text: this.$i18n.$t.notifications.settingsSaved.text,
                    timeout: 5000,
                });

            }, this.saveDelay);
        }

        private get exportJson() {
            return JSON.stringify({
                battles: BattleModule.reports,
                debridFields: DebrisFieldModule.reports,
                expeditions: ExpoModule.expos,
            });
        }

        private resetDateRanges() {
            const defaults = SettingsModule.getDefaultSettings().tables.ranges;
            this.settings.tables.ranges = defaults;
        }

        private resetChartColors(key?: keyof Settings['settings']['charts']['colors']) {
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
    .reset-button {
        font-size: 14px;
        background: none;
        display: inline-flex;
        align-items: baseline;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;

        &:hover {
            text-decoration: underline;
        }

        .icon-refresh {
            font-size: 22px;
        }
    }

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