<template>
    <table class="expo-ranged-table">
        <thead>
            <tr>
                <th></th>
                <th
                    v-for="(range, index) in settingsModule.settings.tables
                        .ranges"
                    :key="index"
                >
                    {{
                        range.label ||
                        `${$t("since")} ${$d(firstExpoDate, "short")}`
                    }}
                </th>
                <th v-if="settingsModule.settings.tables.showPercentage">%</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.label }}</td>
                <td
                    v-for="(range, index) in settingsModule.settings.tables
                        .ranges"
                    :key="index"
                >
                    {{ $n(item.getValue(expoModule.expos, range)) }}
                </td>
                <td v-if="settingsModule.settings.tables.showPercentage">
                    {{ $n(getPercentage(item)) }}
                </td>
            </tr>
            <tr v-if="showTotal" class="total-row">
                <td>{{ $t(`total`) }}</td>
                <td
                    v-for="(range, index) in settingsModule.settings.tables
                        .ranges"
                    :key="index"
                >
                    {{ $n(getTotal(range)) }}
                </td>
                <td v-if="settingsModule.settings.tables.showPercentage"></td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import ExpoEvent from '@/models/expeditions/ExpoEvent';
    import DateRange from '@/models/settings/DateRange';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    export interface ExpoRangeTableItem {
        label: string;
        getValue: (expos: ExpoEvent[], range?: DateRange) => number;
    }

    @Component({})
    export default class ExpoRangedTable extends Vue {
        @Prop({ required: true, type: Array as PropType<ExpoRangeTableItem[]> })
        private items!: ExpoRangeTableItem[];

        @Prop({ required: false, type: Boolean, default: false })
        private showTotal!: boolean;

        private getTotal(range?: DateRange) {
            return this.items.reduce(
                (total, i) => total + i.getValue(this.expoModule.expos, range),
                0
            );
        }

        private getPercentage(item: ExpoRangeTableItem, range?: DateRange) {
            return (100 * item.getValue(this.expoModule.expos)) / this.getTotal(range);
        }

        private readonly settingsModule = SettingsModule;
        private readonly expoModule = ExpoModule;

        private get firstExpoDate(): number {
            return this.expoModule.firstExpo?.date ?? Date.now();
        }
    }
</script>
<style lang="scss">
    table {
        border-spacing: 0;
        border-collapse: collapse;

        width: 100%;

        td, th {
            border: 1px solid rgba(white, 0.2);
            padding: 8px;
        }

        .total-row {
            border-top-style: double;
        }
    }
</style>