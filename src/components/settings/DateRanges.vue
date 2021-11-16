<template>
    <div>
        <h2>
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
                        {{ $i18n.$t.settings.rangeStarts }}
                    </th>
                    <th style="width: 200px">
                        {{ $i18n.$t.settings.rangeContains }}
                    </th>
                    <th />
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
                            {{ $i18n.$t.since }}
                            {{ $i18n.$t.settings.firstDay }}
                        </span>
                    </td>
                    <td class="value-col">
                        <select v-if="range.type != 'all'" v-model="range.type">
                            <option
                                v-for="(rangeType, index) in rangeTypes"
                                :key="index"
                                :value="rangeType"
                            >
                                {{ $i18n.$t.settings.rangeType[rangeType] }}
                            </option>
                        </select>

                        <span v-else>
                            {{ $i18n.$t.settings.rangeType[range.type] }}
                        </span>
                    </td>
                    <td class="value-col">
                        <span v-if="range.type != 'all'">
                            {{ $i18n.$t.settings.before }}
                            <input
                                type="number"
                                step="1"
                                min="0"
                                v-model="range.skip"
                            />
                            {{ $i18n.$t.settings.rangeTextVariants[range.type] }}
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
                            {{ $i18n.$t.settings.rangeTexts[range.type] }}
                        </span>
                    </td>
                    <td>
                        <template v-if="getDates(range) != null">
                            <span
                                v-text="$i18n.$d(getDates(range).start, 'date')"
                            />
                            -
                            <span
                                v-text="$i18n.$d(getDates(range).end, 'date')"
                            />
                        </template>
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
    import DateRange, { DateRangeType } from '@/models/settings/DateRange';
    import SettingsModule from '@/store/modules/SettingsModule';
    import daysInRange from '@/utils/daysInRange';
    import { Component, Vue } from 'vue-property-decorator';
    import draggable from 'vuedraggable';

    interface DateRangeDates {
        start: Date;
        end: Date;
    }

    @Component({
        components: {
            draggable,
        },
    })
    export default class DateRanges extends Vue {
        private readonly rangeTypes: DateRangeType[] = [
            'day',
            'week',
            'month',
            'year',
        ];

        private get settings() {
            return SettingsModule.settings;
        }

        private getDates(range: DateRange): DateRangeDates | null {
            const days = daysInRange(range);
            if (days == null) {
                return null;
            }

            return {
                start: days[0],
                end: days[days.length - 1],
            };
        }

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

        private resetDateRanges() {
            const defaults = SettingsModule.getDefaultSettings().tables.ranges;
            this.settings.tables.ranges = defaults;
        }
    }
</script>