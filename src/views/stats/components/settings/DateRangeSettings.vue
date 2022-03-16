<template>
    <div>
        <span>
            LOCA: Settings for the time spans of the columns of the tables. You
            can change the order of the columns by dragging the respective rows
            below to the desired positions.
        </span>

        <reset-button @reset="resetDateRanges()" />

        <div class="table">
            <table>
                <thead>
                    <tr>
                        <td />
                        <td />
                        <td v-text="'LOCA: Label'" />
                        <td v-text="'LOCA: Type'" />
                        <td v-text="'LOCA: Range start'" />
                        <td v-text="'LOCA: Range contains'" />
                        <td />
                    </tr>
                </thead>
                <draggable tag="tbody" v-model="itemsTest" handle=".grab">
                    <tr v-for="(item, i) in itemsTest" :key="i">
                        <td>
                            <span class="grab mdi mdi-drag" />
                        </td>
                        <td>
                            <span
                                v-if="item.range.type != 'all'"
                                class="delete mdi mdi-delete"
                                @click="deleteRange(item.range)"
                            />
                        </td>
                        <td v-text="item.label" />
                        <td v-text="item.type" />
                        <td v-text="item.skip" />
                        <td v-text="item.take" />
                        <td v-text="item.rangeText" />
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
                        <td colspan="5" />
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import { DateRange, FullDateRangeType } from '@/shared/models/settings/DateRange';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { getRangeDays } from '../../utils/dateRanges';
    import ResetButton from './ResetButton.vue';
    import draggable from 'vuedraggable';

    interface DateRangeSettingsItem {
        label: string;
        type: FullDateRangeType;
        skip: number;
        take: number;
        rangeText: string;

        range: DateRange;
    }

    @Component({
        components: {
            ResetButton,
            draggable,
        },
    })
    export default class DateRangeSettings extends Vue {

        private get columns(): GridTableColumn<keyof DateRangeSettingsItem | 'delete' | 'drag'>[] {
            return [
                { key: 'drag' },
                { key: 'delete' },
                {
                    key: 'label',
                    label: 'LOCA: Label',
                },
                {
                    key: 'type',
                    label: 'LOCA: Type',
                },
                {
                    key: 'skip',
                    label: 'LOCA: Range starts',
                },
                {
                    key: 'take',
                    label: 'LOCA: Range ends',
                },
                { key: 'rangeText' },
            ];
        }

        private itemsTest: DateRangeSettingsItem[] = [];

        mounted() {
            this.itemsTest = this.items;
        }

        private get items(): DateRangeSettingsItem[] {
            return SettingsDataModule.settings.dateRanges.map(range => {
                const rangeDays = getRangeDays(range);
                let rangeText = '';
                if (range.type != 'all') {
                    rangeText = `${this.$date(rangeDays.firstDay)} - ${this.$date(rangeDays.lastDay)}`;
                }

                return {
                    label: range.label ?? 'LOCA: Since <first day>',
                    type: range.type,
                    skip: range.type == 'all' ? 0 : range.skip,
                    take: range.type == 'all' ? 0 : range.take,
                    rangeText,

                    range,
                };
            });
        }

        private set items(value: DateRangeSettingsItem[]) {
            console.log('set', value);
        }

        private get footerItems(): {}[] {
            return [{}];
        }

        private deleteRange(range: DateRange) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                dateRanges: SettingsDataModule.settings.dateRanges.filter(r => r != range),
            });
        }

        private addNewRange() {
            //TODO: add new date range
        }


        private resetDateRanges() {
            const defaultRanges = getDefaultSettings(SettingsDataModule.settings.extensionLanguage).dateRanges;

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                dateRanges: defaultRanges,
            });
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
</style>