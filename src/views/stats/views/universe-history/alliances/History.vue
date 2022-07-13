<template>
    <div class="history" v-if="historyTrackingEnabled">
        <loading-spinner v-if="dataModuleLoading" />
        <template v-else>
            <grid-table :columns="tableColumns" :items="tableItems" class="alliance-selection-table">
                <template #cell-alliance="{ value: alliance }">
                    <template v-if="alliance == null">
                        <input
                            type="text"
                            v-model="selectedAllianceName"
                            :placeholder="$i18n.$t.universeHistory.allianceSelection.search"
                            list="alliance-list"
                            @change="onAllianceSelected($event.target.value)"
                            style="width: 100%"
                        />
                        <datalist id="alliance-list">
                            <option v-for="name in allianceNames" :key="name">
                                {{ name }}
                            </option>
                        </datalist>
                    </template>

                    <div class="list-item" v-else>
                        <span v-text="alliance.name" />
                    </div>
                </template>
            </grid-table>

            <tabs :tabs="tabs">
                <template #tab-content-tag>
                    <alliance-tag-history-table v-if="allianceId != null" :allianceId="allianceId" />
                </template>

                <template #tab-content-name>
                    <alliance-name-history-table v-if="allianceId != null" :allianceId="allianceId" />
                </template>

                <template #tab-content-members>
                    <alliance-member-history-table v-if="allianceId != null" :allianceId="allianceId" />
                </template>
            </tabs>
        </template>
    </div>
    <universe-history-tracking-settings v-else />
</template>

<script lang="ts">
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { Tab } from '@/views/stats/components/common/Tabs.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { UniverseHistoryDataModule, UniverseHistoryAlliance } from '@/views/stats/data/UniverseHistoryDataModule';
    import { Component, Vue } from 'vue-property-decorator';
    import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';
    import StatusHistoryChart from '@stats/components/universe-history/StatusHistoryChart.vue';
    import AllianceTagHistoryTable from '@stats/components/universe-history/AllianceTagHistoryTable.vue';
    import AllianceNameHistoryTable from '@stats/components/universe-history/AllianceNameHistoryTable.vue';
    import AllianceMemberHistoryTable from '@stats/components/universe-history/AllianceMemberHistoryTable.vue';
    import { UniverseSpecificSettingsDataModule } from '@/views/stats/data/UniverseSpecificSettingsDataModule';


    @Component({
        components: {
            UniverseHistoryTrackingSettings,
            StatusHistoryChart,
            AllianceTagHistoryTable,
            AllianceNameHistoryTable,
            AllianceMemberHistoryTable,
        },
    })
    export default class History extends Vue {

        private get historyTrackingEnabled() {
            return SettingsDataModule.settings.universeHistory.trackHistory;
        }

        private get tableColumns(): GridTableColumn<'alliance'>[] {
            return [{
                key: 'alliance',
                label: this.$i18n.$t.universeHistory.allianceSelection.header,
                headerClass: 'alliance-selection-table-cell',
                class: 'alliance-selection-table-cell',
            }];
        }

        private get tableItems(): { alliance: UniverseHistoryAlliance | null }[] {
            return [
                { alliance: null },
                { alliance: this.selectedAlliance },
            ].filter((value, i, array) => array.findIndex(v => v.alliance == value.alliance) == i);
        }

        private get tabs(): Tab[] {
            return [
                {
                    key: 'tag',
                    label: this.$i18n.$t.universeHistory.historyTabs.tags,
                },
                {
                    key: 'name',
                    label: this.$i18n.$t.universeHistory.historyTabs.names,
                },
                {
                    key: 'members',
                    label: this.$i18n.$t.universeHistory.historyTabs.members,
                },
            ];
        }

        private get selectedAlliance() {
            return UniverseHistoryDataModule.alliances.find(p => p.id == this.allianceId) ?? null;
        }

        private get allianceId(): number | null {
            try {
                const allianceId = parseIntSafe(this.$route.query.alliance as string | null ?? '', 10);
                return allianceId;
            } catch {
                return null;
            }
        }

        private dataModuleLoading = true;
        private selectedAllianceName = '';

        private async mounted() {
            await UniverseSpecificSettingsDataModule.ready;
            await this.redirectToDefault();

            this.dataModuleLoading = true;
            await UniverseHistoryDataModule.ready;
            this.dataModuleLoading = false;
        }

        private async redirectToDefault() {
            if (this.allianceId != null) {
                return;
            }

            const defaultAllianceId = UniverseSpecificSettingsDataModule.settings.universeHistory.alliances.history;
            if (defaultAllianceId != null) {
                await this.updateAllianceIdRoute(defaultAllianceId);
            }
        }

        private updateSettings(allianceId: number) {
            const settings = UniverseSpecificSettingsDataModule.settings;
            UniverseSpecificSettingsDataModule.updateSettings({
                ...settings,
                universeHistory: {
                    ...settings.universeHistory,
                    alliances: {
                        ...settings.universeHistory.alliances,
                        history: allianceId,
                    },
                },
            });
        }

        private async updateAllianceIdRoute(id: number) {
            this.updateSettings(id);

            await this.$router.replace({
                query: {
                    alliance: id.toString(),
                },
            });
            await this.redirectToDefault();
        }

        private get allianceNames() {
            return UniverseHistoryDataModule.alliances
                .map(alliance => this.getAllyString(alliance))
                .sort();
        }

        private getAllyString(alliance: UniverseHistoryAlliance) {
            return `[${alliance.tag}] ${alliance.name}`;
        }

        private async onAllianceSelected(name: string) {
            const alliance = UniverseHistoryDataModule.alliances.find(p => this.getAllyString(p).toLowerCase() == name.toLowerCase());
            if (alliance == null) {
                return;
            }

            await this.$nextTick();
            this.selectedAllianceName = '';

            await this.updateAllianceIdRoute(alliance.id);
        }
    }
</script>
<style lang="scss" scoped>
    .history {
        display: grid;
        grid-template-columns: 200px 1fr;
        height: 100%;
    }

    .list {
        display: flex;
        flex-direction: column;
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

    .date-range {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 4px;
    }
</style>