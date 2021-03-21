<template>
    <table class="table text-white border border-white">
        <thead>
            <tr>
                <th></th>
                <th
                    v-for="(range, index) in settingsModule.settings.tables
                        .ranges"
                    :key="index"
                >
                    {{
                        range.label != null
                            ? range.label
                            : `${$t("since")} ${$d(firstExpoDate, "short")}`
                    }}
                </th>
                <th v-if="settingsModule.settings.tables.showPercentage">%</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="size in sizes" :key="size">
                <td>{{ $t(`expoSizes['${size}']`) }}</td>
                <td
                    v-for="(range, index) in settingsModule.settings.tables
                        .ranges"
                    :key="index"
                >
                    {{ $n(getExpoEventCount(range, size)) }}
                </td>
                <td v-if="settingsModule.settings.tables.showPercentage">
                    {{
                        $n(
                            (100 * getExpoEventCount(null, size)) /
                                getExpoEventCount(null)
                        )
                    }}
                </td>
            </tr>
            <tr style="border-top-style: double;">
                <td>{{ $t("total") }}</td>
                <td
                    v-for="(range, index) in settingsModule.settings.tables
                        .ranges"
                    :key="index"
                >
                    {{ $n(getExpoEventCount(range)) }}
                </td>
                <td v-if="settingsModule.settings.tables.showPercentage"></td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import ExpoEvent from '@/models/expeditions/ExpoEvent';
    import ExpoSize from '@/models/expeditions/ExpoSize';
    import ExpoType from '@/models/expeditions/ExpoType';
    import DateRange from '@/models/settings/DateRange';
    import ExpoModule from '@/store/modules/ExpoModule';
    import SettingsModule from '@/store/modules/SettingsModule';
    import isInRange from '@/utils/isInRange';
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ExpoSizeDistributionTable extends Vue {
        @Prop({ required: true, type: String as PropType<ExpoType> })
        private type!: string;

        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;

        private readonly sizes: ExpoSize[] = [
            ExpoSize.small,
            ExpoSize.medium,
            ExpoSize.large,
        ];

        private get firstExpoDate(): number {
            return this.expoModule.firstExpo?.date ?? Date.now();
        }

        private getExpoEventCount(range: DateRange | null, size?: ExpoSize): number {
            return this.expoModule.expos.filter(
                (d) => d.type == ExpoType.resources
                    && (range == null || isInRange(d.date, range))
                    && (size == null || d.size == size)
            ).length;
        }
    }
</script>