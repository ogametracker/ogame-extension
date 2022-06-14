<template>
    <div>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <td />
                        <td />
                        <td v-text="$i18n.$t.settings.dateRanges.headers.label" />
                        <td v-text="$i18n.$t.settings.dateRanges.headers.type" />
                        <td colspan="2" v-text="$i18n.$t.settings.dateRanges.headers.rangeStart" />
                        <td colspan="2" v-text="$i18n.$t.settings.dateRanges.headers.rangeContains" />
                        <td>
                            <reset-button @reset="resetDateRanges()" />
                        </td>
                    </tr>
                </thead>
                <draggable
                    tag="tbody"
                    v-model="items"
                    handle=".grab"
                    @change="onItemsUpdated()"
                >
                    <tr v-for="(range, i) in items" :key="i">
                        <td>
                            <span class="grab mdi mdi-drag" />
                        </td>
                        <td>
                            <span
                                v-if="range.type != 'all'"
                                class="delete mdi mdi-delete"
                                @click="deleteRange(range)"
                            />
                        </td>
                        <td>
                            <input
                                v-if="range.type != 'all'"
                                type="text"
                                v-model.lazy="range.label"
                                @change="onItemsUpdated()"
                            />
                            <span 
                                v-else
                                v-text="$i18n.$t.settings.dateRanges.since($i18n.$t.settings.dateRanges.firstDayTemplate)" 
                            />
                        </td>
                        <td>
                            <select
                                v-if="range.type != 'all'"
                                v-model="range.type"
                                @change="onItemsUpdated()"
                            >
                                <option
                                    v-for="rangeType in rangeTypes"
                                    :key="rangeType"
                                    :value="rangeType"
                                    v-text="$i18n.$t.settings.dateRanges[rangeType]"
                                />
                            </select>
                        </td>
                        <td>
                            <input
                                v-if="range.type != 'all'"
                                type="number"
                                v-model="range.skip"
                                @change="onItemsUpdated()"
                            />
                        </td>
                        <td style="text-align: left; padding-left: 0">
                            <span v-text="$i18n.$t.settings.dateRanges[`${range.type}sAgo`]" />
                        </td>
                        <td>
                            <input
                                v-if="range.type != 'all'"
                                type="number"
                                v-model="range.take"
                                @change="onItemsUpdated()"
                            />
                        </td>
                        <td style="text-align: left; padding-left: 0">
                            <span v-text="$i18n.$t.settings.dateRanges[`${range.type}s`]" />
                        </td>
                        <td v-text="getRangeText(range)" style="font-style: italic;" />
                    </tr>
                </draggable>
                <tfoot>
                    <tr>
                        <td />
                        <td>
                            <span
                                class="add mdi mdi-plus"
                                @click="addNewRange()"
                            />
                        </td>
                        <td colspan="7" />
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import { DateRange, DateRangeType } from '@/shared/models/settings/DateRange';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { getRangeDays } from '../../utils/dateRanges';
    import ResetButton from './ResetButton.vue';
    import draggable from 'vuedraggable';

    @Component({
        components: {
            ResetButton,
            draggable,
        },
    })
    export default class DateRangeSettings extends Vue {

        private items: DateRange[] = [];
        private readonly rangeTypes: DateRangeType[] = [
            'day',
            'week',
            'month',
            'year',
        ];

        private getRangeText(range: DateRange): string {
            if (range.type == 'all') {
                return '';
            }

            const rangeDays = getRangeDays(range);
            if(rangeDays.firstDay == rangeDays.lastDay) {
                return this.$date(rangeDays.firstDay);
            }

            return `${this.$date(rangeDays.firstDay)} - ${this.$date(rangeDays.lastDay)}`;
        }

        private mounted() {
            this.initItems();
        }

        private initItems() {
            this.items = [...SettingsDataModule.settings.dateRanges];
        }

        private async deleteRange(item: DateRange) {
            this.items = this.items.filter(i => i != item);
            await this.onItemsUpdated();
        }

        private addNewRange() {
            this.items.push({
                type: 'day',
                skip: 0,
                take: 1,
                label: this.$i18n.$t.settings.dateRanges.defaultNames.newRange,
            });
            this.onItemsUpdated();
        }

        private onItemsUpdated() {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                dateRanges: [...this.items],
            });
        }

        private get settings() {
            return SettingsDataModule.settings;
        }

        @Watch('settings')
        private onSettingsChanged() {
            this.initItems();
        }


        private resetDateRanges() {
            const defaultRanges = getDefaultSettings(SettingsDataModule.settings.extensionLanguage).dateRanges;

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                dateRanges: defaultRanges,
            });

            this.initItems();
        }
    }
</script>
<style lang="scss" scoped>
    .mdi {
        opacity: 0.5;
        transform: scale(1.5);
        display: inline-block;

        &:hover {
            opacity: 1;
        }
    }

    .delete,
    .add {
        cursor: pointer;
    }

    .grab {
        cursor: grab;
    }

    input[type="number"] {
        width: 64px;
        margin-right: 0.5rem;
    }
</style>