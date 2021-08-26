<template>
    <div class="settings">
        <tab-view :items="items" vertical>
            <template #date-ranges
                ><h2>
                    {{ $i18n.messages.extension.settings.titleDateRanges }}
                    <button
                        class="reset-button"
                        @click="resetDateRanges()"
                        title="Reset TODO: LOCALIZE"
                    >
                        <!-- TODO: localize -->
                        <icon name="refresh" />
                    </button>
                </h2>
                <span style="margin-bottom: 8px; display: inline-block">
                    {{ $i18n.messages.extension.settings.hintDateRanges }}
                </span>
                <table class="settings-table">
                    <thead>
                        <tr>
                            <th style="width: 30px"></th>
                            <th style="width: 200px">
                                {{ $i18n.messages.extension.settings.name }}
                            </th>
                            <th style="width: 150px">
                                {{ $i18n.messages.extension.settings.type }}
                            </th>
                            <th style="width: 200px">
                                {{
                                    $i18n.messages.extension.settings
                                        .rangeStarts
                                }}
                            </th>
                            <th style="width: 200px">
                                {{
                                    $i18n.messages.extension.settings
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
                                    {{ $i18n.messages.extension.since }}
                                    {{
                                        $i18n.messages.extension.settings
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
                                            $i18n.messages.extension.settings
                                                .rangeType[rangeType]
                                        }}
                                    </option>
                                </select>

                                <span v-else>
                                    {{
                                        $i18n.messages.extension.settings
                                            .rangeType[range.type]
                                    }}
                                </span>
                            </td>
                            <td class="value-col">
                                <span v-if="range.type != 'all'">
                                    {{
                                        $i18n.messages.extension.settings.before
                                    }}
                                    <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        v-model="range.skip"
                                    />
                                    {{
                                        $i18n.messages.extension.settings[
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
                                        $i18n.messages.extension.settings[
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
                    {{ $i18n.messages.extension.settings.chartColors.title }}
                    <button
                        class="reset-button"
                        @click="resetChartColors()"
                        title="Reset TODO: LOCALIZE"
                    >
                        <!-- TODO: localize -->
                        <icon name="refresh" />
                    </button>
                </h2>
                <div class="color-tables">
                    <table class="settings-table">
                        <thead>
                            <tr>
                                <th>
                                    {{
                                        $i18n.messages.extension.settings
                                            .chartColors.expeditions
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="resetChartColors('overview')"
                                        title="Reset TODO: LOCALIZE"
                                    >
                                        <!-- TODO: localize -->
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
                                            $i18n.messages.ogame.expoTypes[key]
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
                                        $i18n.messages.extension.settings
                                            .chartColors.resources
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="resetChartColors('resources')"
                                        title="Reset TODO: LOCALIZE"
                                    >
                                        <!-- TODO: localize -->
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
                                            $i18n.messages.ogame.resources[key]
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
                                        $i18n.messages.extension.settings
                                            .chartColors.ships
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="
                                            resetChartColors('overshipsview')
                                        "
                                        title="Reset TODO: LOCALIZE"
                                    >
                                        <!-- TODO: localize -->
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
                                        :label="$i18n.messages.ogame.ships[key]"
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
                                        $i18n.messages.extension.settings
                                            .chartColors.combats
                                    }}

                                    <button
                                        class="reset-button"
                                        @click="
                                            resetChartColors('battleResults')
                                        "
                                        title="Reset TODO: LOCALIZE"
                                    >
                                        <!-- TODO: localize -->
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
                                            $i18n.messages.ogame.battleResults[
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
                <h2>Export</h2>
                <textarea
                    readonly
                    :value="exportJson"
                    style="width: 60%; height: 300px"
                    @focus="$event.target.select()"
                />

                <hr />

                <h2>Import</h2>
                Coming Soon
            </template>
        </tab-view>
    </div>
</template>

<script lang="ts">
    import i18n from '@/i18n';
    import { DateRangeType } from '@/models/settings/DateRange';
    import BattleModule from '@/store/modules/BattleModule';
    import DebrisFieldModule from '@/store/modules/DebrisFieldModule';
    import ExpoModule from '@/store/modules/ExpoModule';
    import NotificationModule from '@/store/modules/NotificationModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import clone from '@/utils/clone';
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
                title: i18n.messages.extension.settings.titleDateRanges,
            },
            {
                name: 'chart-colors',
                title: i18n.messages.extension.settings.chartColors.title,
            },
            {
                name: 'import-export',
                title: 'LOCA: Import/Export',
            },
        ];

        private addRange() {
            SettingsModule.settings.tables.ranges.push({
                type: 'day',
                skip: 0,
                take: 1,
                label: i18n.messages.extension.settings.newRange,
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
                    title: i18n.messages.extension.notifications.settingsSaved.title,
                    text: i18n.messages.extension.notifications.settingsSaved.text,
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
            this.settings.tables.ranges = clone(SettingsModule.defaultSettings.tables.ranges);
        }

        private resetChartColors(key?: keyof Settings['settings']['charts']['colors']) {
            if (key == null) {
                this.settings.charts.colors = clone(SettingsModule.defaultSettings.charts.colors);
            } else {
                this.settings.charts.colors[key] = clone(SettingsModule.defaultSettings.charts.colors[key]);
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