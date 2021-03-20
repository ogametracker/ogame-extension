<template>
    <div>
        <h5>Übersicht</h5>
        <b-table-simple class="text-white border border-white">
            <b-thead>
                <b-tr>
                    <b-th></b-th>
                    <b-th
                        v-for="(range, index) in settingsModule.settings.tables
                            .ranges"
                        :key="index"
                    >
                        {{
                            range.label != null
                                ? range.label
                                : `Seit ${firstDayString}`
                        }}
                    </b-th>
                    <b-th v-if="settingsModule.settings.tables.showPercentage"
                        >%</b-th
                    >
                </b-tr>
            </b-thead>
            <b-tbody>
                <b-tr v-for="type in types" :key="type">
                    <b-td>{{ type }}</b-td>
                    <b-td
                        v-for="(range, index) in settingsModule.settings.tables
                            .ranges"
                        :key="index"
                    >
                        {{ getExpoEventCount(type, range) }}
                    </b-td>
                    <b-th v-if="settingsModule.settings.tables.showPercentage"
                        >Percentage</b-th
                    >
                </b-tr>
            </b-tbody>
        </b-table-simple>

        <template v-for="type in detailedTypes">
            <h5 :key="`${type}-header`">{{ type }}</h5>
            <b-table-simple
                :key="`${type}-table`"
                class="text-white border border-white"
            >
                <b-thead>
                    <b-tr>
                        <b-th></b-th>
                        <b-th
                            v-for="(range, index) in settingsModule.settings
                                .tables.ranges"
                            :key="index"
                        >
                            {{
                                range.label != null
                                    ? range.label
                                    : `Seit ${firstDayString}`
                            }}
                        </b-th>
                        <b-th
                            v-if="settingsModule.settings.tables.showPercentage"
                            >%</b-th
                        >
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="size in sizes" :key="size">
                        <b-td>{{ type }}</b-td>
                        <b-td
                            v-for="(range, index) in settingsModule.settings
                                .tables.ranges"
                            :key="index"
                        >
                            {{ getExpoEventCount(type, range, size) }}
                        </b-td>
                        <b-th
                            v-if="settingsModule.settings.tables.showPercentage"
                            >Percentage</b-th
                        >
                    </b-tr>
                </b-tbody>
            </b-table-simple>
        </template>
    </div>
</template>
 
<script lang="ts">
    import ExpoType from "@/models/expeditions/ExpoType";
    import DateRange from "@/models/settings/DateRange";
    import { Component, Vue } from "vue-property-decorator";
    import isInRange from "@/utils/isInRange";
    import ExpoModule from "@/store/modules/ExpoModule";
    import SettingsModule from "@/store/modules/SettingsModule";
    import { format } from "date-fns";
    import ExpoSize from "@/models/expeditions/ExpoSize";

    @Component({})
    export default class ExpeditionOverviewTables extends Vue {
        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;

        private types = Object.values(ExpoType);
        private detailedTypes = [
            ExpoType.resources,
            ExpoType.fleet,
            ExpoType.darkMatter,
            ExpoType.pirates,
            ExpoType.aliens,
        ];
        private sizes = [
            ExpoSize.small,
            ExpoSize.medium,
            ExpoSize.large,
        ];

        private get firstDayString() {
            const firstExpoTime = this.expoModule.expos.reduce((acc, cur) => {
                if (acc < cur.date)
                    return cur.date;
                return acc;
            }, 0);
            return format(firstExpoTime, 'dd.MM.yyyy');
        }

        private getExpoEventCount(type: ExpoType, range: DateRange, size?: ExpoSize): number {
            return this.expoModule.expos.filter(
                (d) => d.type == type && isInRange(d.date, range) && (size == null || d.size == size)
            ).length;
        }
    }
</script>