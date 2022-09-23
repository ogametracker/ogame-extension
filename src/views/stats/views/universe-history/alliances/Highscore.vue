<template>
    <div class="highscores">
        <loading-spinner v-if="dataModuleLoading" />
        <template v-else>
            <grid-table :columns="tableColumns" :items="tableItems" class="alliance-selection-table">
                <template #cell-alliance="{ value: alliance }">
                    <template v-if="alliance == null">
                        <input
                            type="text"
                            v-model="selectedAllianceName"
                            :placeholder="$i18n.$t.extension.universeHistory.allianceSelection.search"
                            list="alliance-list"
                            @change="onAllianceSelected($event.target.value)"
                            style="width: 100%"
                        />
                        <datalist id="alliance-list">
                            <option v-for="(name, i) in allianceNames" :key="i">
                                {{ name }}
                            </option>
                        </datalist>
                    </template>

                    <div v-else class="list-item">
                        <span class="mdi mdi-delete" @click="removeAlliance(alliance.id)" />
                        <span v-text="getAllianceString(alliance)" />
                    </div>
                </template>
            </grid-table>

            <tabs :tabs="tabs">
                <template v-for="key in keys">
                    <template :slot="`tab-content-${key}`">
                        <span v-if="allianceScoresLoading" :key="`score-${key}-loading`" class="loading" />
                        <scrollable-chart
                            v-else-if="allianceIds.length > 0"
                            :key="`score-${key}`"
                            :datasets="scoreDatasets[key]"
                            continue-last-value
                            show-x-values-in-grid
                            :tick-interval="1000 * 60 * 60 * 24"
                            :ticks="30"
                            :tick-list="days"
                            :min-tick="firstDay"
                            :max-tick="nextDay"
                            :x-label-formatter="(x) => $i18n.$d(x, 'date')"
                            :x-label-tooltip-formatter="(x) => $i18n.$d(x, 'datetime')"
                        />
                    </template>
                </template>
            </tabs>
        </template>
    </div>
</template>

<script lang="ts">
    import { DbUniverseHistoryScoreType } from '@/shared/db/schema/universe-history';
    import { HighscoreTypeNames } from '@/shared/models/ogame/highscore';
    import { createRecord } from '@/shared/utils/createRecord';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { _throw } from '@/shared/utils/_throw';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { ScrollableChartDataset } from '@/views/stats/components/common/scrollable-chart/ScrollableChart.vue';
    import { Tab } from '@/views/stats/components/common/Tabs.vue';
    import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
    import { UniverseHistoryDataModule, UniverseHistoryAlliance } from '@/views/stats/data/UniverseHistoryDataModule';
    import { UniverseSpecificSettingsDataModule } from '@/views/stats/data/UniverseSpecificSettingsDataModule';
    import { addDays } from 'date-fns';
    import startOfDay from 'date-fns/startOfDay';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Highscore extends Vue {
        private readonly colors = [
            '#F48FB1', // pink lighten-3
            '#673AB7', // deep-purple
            '#E53935', // red darken-1
            '#3F51B5', // indigo
            '#006064', // cyan darken-4
            '#546E7A', // blue-grey darken-1
            '#EF9A9A', // red lighten-3
            '#64B5F6', // blue lighten-2
            '#FFE082', // amber lighten-3
            '#E91E63', // pink
            '#BA68C8', // purple lighten-2
            '#BF360C', // deep-orange darken-4
            '#039BE5', // light-blue darken-1
            '#8E24AA', // purple darken-1
            '#9CCC65', // light-green lighten-1
            '#A1887F', // brown lighten-2
            '#0097A7', // cyan darken-2
            '#FFAB91', // deep-orange lighten-3
            '#009688', // teal
            '#43A047', // green darken-1
            '#1A237E', // indigo darken-4
            '#558B2F', // light-green darken-3
            '#311B92', // deep-purple darken-4
            '#880E4F', // pink darken-4
            '#01579B', // light-blue darken-4
            '#AFB42B', // lime darken-2
            '#1E88E5', // blue darken-1
            '#827717', // lime darken-4
            '#FFF176', // yellow lighten-2
            '#BDBDBD', // grey lighten-1
            '#FFC107', // amber
            '#FFA726', // orange lighten-1
            '#FF5722', // deep-orange
            '#795548', // brown
            '#004D40', // teal darken-4
            '#81C784', // green lighten-2
            '#90A4AE', // blue-grey lighten-2
            '#757575', // grey darken-1
            '#FDD835', // yellow darken-1
        ];

        private leftX = 0;
        private rightX = 1;
        private dataModuleLoading = true;
        private allianceScoresLoading = true;

        private selectedAllianceName = '';
        private scoreDatasets = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>;
        private firstDay = 0;

        private readonly keys = HighscoreTypeNames;
        private get tabs(): (Tab & { key: DbUniverseHistoryScoreType })[] {
            const tabs: (Tab & { key: DbUniverseHistoryScoreType })[] = [
                {
                    key: 'total',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.total,
                },
                {
                    key: 'economy',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.economy,
                },
                {
                    key: 'research',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.research,
                },
                {
                    key: 'military',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.military,
                },
                {
                    key: 'militaryBuilt',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.militaryBuilt,
                },
                {
                    key: 'militaryDestroyed',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.militaryDestroyed,
                },
                {
                    key: 'militaryLost',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.militaryLost,
                },
                {
                    key: 'honor',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.honor,
                },
                {
                    key: 'numberOfShips',
                    label: this.$i18n.$t.extension.universeHistory.highscoreTabs.numberOfShips,
                },
            ];

            if (ServerSettingsDataModule.serverSettings.lifeforms.enabled) {
                tabs.push(
                    {
                        key: 'lifeform',
                        label: this.$i18n.$t.extension.universeHistory.highscoreTabs.lifeform,
                    },
                    {
                        key: 'lifeformEconomy',
                        label: this.$i18n.$t.extension.universeHistory.highscoreTabs.lifeformEconomy,
                    },
                    {
                        key: 'lifeformTechnology',
                        label: this.$i18n.$t.extension.universeHistory.highscoreTabs.lifeformTechnology,
                    },
                    {
                        key: 'lifeformDiscoveries',
                        label: this.$i18n.$t.extension.universeHistory.highscoreTabs.lifeformDiscoveries,
                    }
                );
            }

            return tabs;
        }

        private get tableColumns(): GridTableColumn<'alliance'>[] {
            return [{
                key: 'alliance',
                label: this.$i18n.$t.extension.universeHistory.allianceSelection.header,
                headerClass: 'alliance-selection-table-cell',
                class: 'alliance-selection-table-cell',
            }];
        }

        private get tableItems(): { alliance: UniverseHistoryAlliance | null }[] {
            return [
                { alliance: null },
                ...this.selectedAlliances.map(alliance => ({ alliance })),
            ];
        }


        private get allianceIds(): number[] {
            return (this.$route.query.alliances as string | null ?? '')
                .split(',')
                .filter(id => id.length > 0)
                .map(allianceId => parseIntSafe(allianceId, 10));
        }

        private async mounted() {
            await UniverseSpecificSettingsDataModule.ready;
            await this.redirectToDefault();

            this.dataModuleLoading = true;
            await UniverseHistoryDataModule.ready;
            this.dataModuleLoading = false;

            await this.loadAllianceScores();
        }

        private async redirectToDefault() {
            if (this.allianceIds.length != 0) {
                return;
            }

            const defaultIds = UniverseSpecificSettingsDataModule.settings.universeHistory.alliances.highscore;
            if (defaultIds.length != 0) {
                await this.updateAllianceIdRoute(defaultIds);
            }
        }


        private async loadAllianceScores() {
            this.allianceScoresLoading = true;


            this.scoreDatasets = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset[]>;

            const datasetsByAlliance: Record<number, Record<DbUniverseHistoryScoreType, ScrollableChartDataset>> = {};
            this.allianceIds.forEach(p => datasetsByAlliance[p] = {} as Record<DbUniverseHistoryScoreType, ScrollableChartDataset>);

            this.keys.forEach(key => {
                this.scoreDatasets[key] = [];

                this.allianceIds.forEach((pid, i) => datasetsByAlliance[pid][key] = {
                    key: `${pid}-${key}`,
                    values: [],
                    color: this.colors[i % this.colors.length],
                    label: this.getAllianceString(this.alliances.find(p => p.id == pid) ?? _throw(`no alliance with id '${pid}' found`)),
                    filled: false,
                    stack: false,
                    hidePoints: false,
                });
            });

            let minDate = Number.MAX_SAFE_INTEGER;

            const scores = await UniverseHistoryDataModule.getAllianceScoreHistory(this.allianceIds);
            const types = HighscoreTypeNames;
            const lastScores = createRecord(this.allianceIds, () => createRecord(types, null)) as Record<number, Record<DbUniverseHistoryScoreType, number | null>>;

            scores.forEach((score, i) => {
                minDate = Math.min(minDate, score.date);

                if (lastScores[score.allianceId][score.type] == score.score) { //no duplicates if only position changed
                    return;
                }
                if (!types.includes(score.type)) {
                    return; // happens if beta data available
                }

                datasetsByAlliance[score.allianceId][score.type].values.push({
                    x: score.date,
                    y: score.score,
                });
                lastScores[score.allianceId][score.type] = score.score;
            });

            this.keys.forEach(key => {
                this.allianceIds.forEach(pid => {
                    this.scoreDatasets[key].push(datasetsByAlliance[pid][key]);
                });
            });

            this.firstDay = startOfDay(minDate).getTime();

            this.allianceScoresLoading = false;
        }

        private get nextDay() {
            return addDays(startOfDay(Date.now()), 1).getTime();
        }

        private get days() {
            const days: number[] = [];

            const maxDay = this.nextDay;
            for (let day = this.firstDay; day <= maxDay; day = addDays(day, 1).getTime()) {
                days.push(day);
            }

            return days;
        }



        private get alliances() {
            return UniverseHistoryDataModule.alliances;
        }

        private getAllianceString(ally: UniverseHistoryAlliance) {
            return `[${ally.tag}] ${ally.name}`;
        }

        private get allianceNames() {
            return this.alliances
                .map(alliance => this.getAllianceString(alliance))
                .sort();
        }

        private get selectedAlliances() {
            return this.allianceIds.map(pid => this.alliances.find(p => p.id == pid)!);
        }

        private async onAllianceSelected(name: string) {
            const alliance = this.alliances.find(a => this.getAllianceString(a).toLowerCase() == name.toLowerCase());
            if (alliance == null) {
                return;
            }

            await this.$nextTick();
            this.selectedAllianceName = '';

            const allianceIds = (this.$route.query.alliances as string | null)?.split(',') ?? [];
            await this.updateAllianceIdRoute([
                ...allianceIds.filter(pid => pid != alliance.id.toString()),
                alliance.id,
            ]);
            await this.loadAllianceScores();
        }

        private async removeAlliance(id: number) {
            await this.updateAllianceIdRoute(this.allianceIds.filter(pid => pid != id));

            await this.loadAllianceScores();
        }


        private updateSettings(allyIds: number[]) {
            const settings = UniverseSpecificSettingsDataModule.settings;
            UniverseSpecificSettingsDataModule.updateSettings({
                ...settings,
                universeHistory: {
                    ...settings.universeHistory,
                    alliances: {
                        ...settings.universeHistory.alliances,
                        highscore: allyIds,
                    },
                },
            });
        }

        private async updateAllianceIdRoute(ids: (string | number)[]) {
            this.updateSettings(ids.map(id => typeof id === 'string' ? parseIntSafe(id, 10) : id));

            await this.$router.replace({
                query: {
                    alliances: ids.join(','),
                },
            });
        }
    }
</script>
<style lang="scss" scoped>
    .highscores {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
    }

    .alliance-selection {
        margin-right: 16px;

        &-table {
            height: fit-content;
            margin-right: 16px;

            &::v-deep {
                .alliance-selection-table-cell {
                    text-align: left;
                    justify-content: start;
                    border-bottom: 1px solid rgba(var(--color), 0.5);
                }
            }
        }
    }

    .list {
        display: flex;
        flex-direction: column;

        &-item {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 12px;
            align-items: center;

            .mdi {
                transform: scale(1.5);
                cursor: pointer;
            }
        }
    }
</style>