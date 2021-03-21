<template>
    <div>
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
                                : `${$t("since")} ${firstDayString}`
                        }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Dunkle Materie</td>
                    <td
                        v-for="(range, index) in settingsModule.settings.tables
                            .ranges"
                        :key="index"
                    >
                        {{ $n(getDarkMatterAmount(range)) }}
                    </td>
                </tr>
            </tbody>
        </table>

        <h5>DM-Funde</h5>
        <expo-size-distribution-table :type="expoType" />
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
    import { ExpoEventDarkMatter } from "@/models/expeditions/ExpoEvent";
    import ExpoSizeDistributionTable from '../ExpoSizeDistributionTable.vue';

    @Component({
        components: {
            ExpoSizeDistributionTable,
        },
    })
    export default class ExpeditionDarkMatterTables extends Vue {
        private readonly expoModule = ExpoModule;
        private readonly settingsModule = SettingsModule;

        private readonly expoType = ExpoType.darkMatter;

        private get firstDayString() {
            const firstExpoTime = this.expoModule.expos.reduce((acc, cur) => {
                if (acc > cur.date)
                    return cur.date;
                return acc;
            }, 0);
            return format(firstExpoTime, 'dd.MM.yyyy');
        }

        private getDarkMatterAmount(range: DateRange): number {
            const expos = this.expoModule.expos.filter(
                (d) => d.type == ExpoType.darkMatter && isInRange(d.date, range)
            ) as ExpoEventDarkMatter[];
            return expos.reduce((acc, d) => acc + d.darkMatter, 0);
        }
    }
</script>