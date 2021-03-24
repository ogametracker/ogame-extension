<template>
    <div class="settings">
        <h2>Datumsbereiche</h2>
        <table class="settings-table">
            <thead>
                <tr>
                    <th style="width: 30px"></th>
                    <th style="width: 200px">
                        {{ $t("extension.settings.name") }}
                    </th>
                    <th style="width: 150px">
                        {{ $t("extension.settings.type") }}
                    </th>
                    <th style="width: 200px">
                        {{ $t("extension.settings.rangeStarts") }}
                    </th>
                    <th style="width: 200px">
                        {{ $t("extension.settings.rangeContains") }}
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
                            {{ $t("extension.since") }}
                            {{ $t("extension.settings.firstDay") }}
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
                                    $t(
                                        `extension.settings.rangeType['${rangeType}']`
                                    )
                                }}
                            </option>
                        </select>

                        <span v-else>
                                {{
                                    $t(
                                        `extension.settings.rangeType['${range.type}']`
                                    )
                                }}
                        </span>
                    </td>
                    <td class="value-col">
                        <span v-if="range.type != 'all'">
                            {{ $t("extension.settings.before") }}
                            <input
                                type="number"
                                step="1"
                                min="0"
                                v-model="range.skip"
                            />
                            {{
                                $t(
                                    `extension.settings['${range.type}sVariant']`
                                )
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
                            {{ $t(`extension.settings['${range.type}s']`) }}
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
    </div>
</template>

<script lang="ts">
    import { DateRangeType } from '@/models/settings/DateRange';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { Component, Vue } from 'vue-property-decorator';
    import draggable from 'vuedraggable';

    @Component({
        components: {
            draggable,
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
    }
</script>

<style lang="scss" scoped>
    .settings {
        max-height: 100%;
        overflow: auto;
    }

    .settings-table {
        width: auto;
        text-align: center;
        font-size: 14px;

        .name-col {
            text-align: left;
            padding: 0;

            & > * {
                padding: 8px;
            }
        }

        input:not([type]),
        input[type="text"],
        input[type="number"],
        select {
            background: rgba(200, 200, 255, 0.01);
            border: none;
            font-size: 14px;
        }

        .value-col {
            input[type="number"] {
                padding: 8px;
                width: 64px;
            }

            select {
                padding: 8px;
                width: 96px;
            }
        }

        .mdi {
            font-size: 20px;
        }
    }

    .clickable {
        cursor: pointer;
    }
</style>