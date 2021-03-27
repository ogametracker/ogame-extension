<template>
    <div class="settings">
        <h2>Datumsbereiche</h2>
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
                        {{ $i18n.messages.extension.settings.rangeStarts }}
                    </th>
                    <th style="width: 200px">
                        {{ $i18n.messages.extension.settings.rangeContains }}
                    </th>
                </tr>
            </thead>

            <draggable v-model="settings.tables.ranges" tag="tbody">
                <tr
                    v-for="(range, index) in settings.tables.ranges"
                    :key="index"
                >
                    <td>
                        <span @click="removeRange(index)" class="clickable">
                            <icon v-if="range.type != 'all'" name="minus" />
                        </span>
                    </td>
                    <td class="name-col">
                        <input
                            v-if="range.type != 'all'"
                            v-model="range.label"
                        />
                        <span v-else>
                            {{ $i18n.messages.extension.since }}
                            {{ $i18n.messages.extension.settings.firstDay }}
                        </span>
                    </td>
                    <td class="value-col">
                        <select v-if="range.type != 'all'" v-model="range.type">
                            <option
                                v-for="(rangeType, index) in rangeTypes"
                                :key="index"
                                :value="rangeType"
                            >
                                {{
                                    $i18n.messages.extension.settings.rangeType[
                                        rangeType
                                    ]
                                }}
                            </option>
                        </select>

                        <span v-else>
                            {{
                                $i18n.messages.extension.settings.rangeType[
                                    range.type
                                ]
                            }}
                        </span>
                    </td>
                    <td class="value-col">
                        <span v-if="range.type != 'all'">
                            {{ $i18n.messages.extension.settings.before }}
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

        <hr />

        <h2>Diagrammfarben</h2>
        <div class="color-tables">
            <table class="settings-table">
                <thead>
                    <tr>
                        <th>Expeditionsereignisse</th>
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
                                :label="$i18n.messages.ogame.expoTypes[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="settings-table">
                <thead>
                    <tr>
                        <th>Rohstoffe</th>
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
                                :label="$i18n.messages.ogame.resources[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="settings-table">
                <thead>
                    <tr>
                        <th>Schiffe</th>
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
                                :label="$i18n.messages.ogame.ships[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="settings-table">
                <thead>
                    <tr>
                        <th>Kämpfe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="key in Object.keys(settings.charts.colors.battleResults)"
                        :key="key"
                    >
                        <td>
                            <color-input
                                v-model="settings.charts.colors.battleResults[key]"
                                :label="$i18n.messages.ogame.battleResults[key]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import { DateRangeType } from '@/models/settings/DateRange';
    import NotificationModule from '@/store/modules/NotificationModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import draggable from 'vuedraggable';
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

        private addRange() {
            SettingsModule.settings.tables.ranges.push({
                type: 'day',
                skip: 0,
                take: 1,
                label: 'Neuer Bereich',
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
        private readonly saveDelay = 3000;
        private saveDelayed() {
            if (this.saveTimeout != null) {
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(async () => {
                await SettingsModule.save();
                this.saveTimeout = null;

                //TODO: localization
                NotificationModule.addNotification({
                    type: 'success',
                    title: 'Einstellungen gespeichert',
                    text: 'Die Einstellungen wurden erfolgreich gespeichert.',
                    timeout: 5000,
                });

            }, this.saveDelay);
        }
    }
</script>