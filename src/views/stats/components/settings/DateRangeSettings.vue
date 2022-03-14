<template>
    <div>
        <span>
            LOCA: Settings for the time spans of the columns of the tables. You
            can change the order of the columns by dragging the respective rows
            below to the desired positions.
        </span>

        <reset-button @reset="resetDateRanges()" />

        <grid-table
            :columns="columns"
            :items="items"
            :footerItems="footerItems"
            style="width: max-content"
        >
            <template #cell-drag>
                <span class="mdi mdi-drag" />
            </template>
            <template #cell-delete="{ item }">
                <span
                    v-if="item.range.type != 'all'"
                    class="mdi mdi-delete"
                    @click="deleteRange(item.range)"
                />
            </template>

            <template #footer-delete>
                <span class="mdi mdi-plus" @click="addNewRange()" />
            </template>
        </grid-table>
    </div>
</template>

<script lang="ts">
    import { DateRange, FullDateRangeType } from '@/shared/models/settings/DateRange';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import startOfDay from 'date-fns/startOfDay/index';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../components/common/GridTable.vue';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { getRangeDays } from '../../utils/dateRanges';
    import ResetButton from './ResetButton.vue';

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

        private get items(): DateRangeSettingsItem[] {
            const today = startOfDay(Date.now());

            return SettingsDataModule.settings.dateRanges.map(range => {
                const rangeDays = getRangeDays(range);
                let rangeText = '';
                if (range.type != 'all') {
                    rangeText; `${this.$date(rangeDays.firstDay)} - ${this.$date(rangeDays.lastDay)}`;
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
        cursor: pointer;

        &:hover {
            opacity: 1;
        }
    }
</style>