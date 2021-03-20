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
                <b-tr v-for="resource in resources" :key="resource">
                    <b-td>{{ resource }}</b-td>
                    <b-td
                        v-for="(range, index) in settingsModule.settings.tables
                            .ranges"
                        :key="index"
                    >
                        {{ getResourceAmount(resource, range) }}
                    </b-td>
                    <b-th v-if="settingsModule.settings.tables.showPercentage"
                        >Percentage</b-th
                    >
                </b-tr>
            </b-tbody>
        </b-table-simple>
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
    import Resource from "@/models/Resource";
    import { ExpoEventResources } from "@/models/expeditions/ExpoEvent";

    @Component({})
    export default class ExpeditionOverviewTables extends Vue {
        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;

        private resources: Resource[] = [
            Resource.metal,
            Resource.crystal,
            Resource.deuterium,
        ];

        private get firstDayString() {
            const firstExpoTime = this.expoModule.expos.reduce((acc, cur) => {
                if (acc < cur.date)
                    return cur.date;
                return acc;
            }, 0);
            return format(firstExpoTime, 'dd.MM.yyyy');
        }

        private getResourceAmount(resource: Resource, range: DateRange): number {
            const expos = this.expoModule.expos.filter(
                (d) => d.type == ExpoType.resources && isInRange(d.date, range)
            ) as ExpoEventResources[];
            return expos.reduce((acc, d) => acc + d.resources[resource], 0);
        }
    }
</script>