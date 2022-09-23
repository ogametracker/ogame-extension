<template>
    <loading-spinner v-if="loading" />
    <grid-table v-else :columns="allianceHistoryColumns" :items="allianceHistoryItems" inline>
        <template #cell-alliance="{ value }">
            <span v-if="value != null" v-text="`[${value.tag}] ${value.name}`" />
            <i v-else v-text="$i18n.$t.extension.universeHistory.noAlliance" />
        </template>

        <template #cell-start="{ value }">
            <span v-if="value != null" v-text="$i18n.$d(value, 'date')" />
            <span v-else v-text="'?'" />
        </template>

        <template #cell-->-</template>

        <template #cell-end="{ value }">
            <span v-if="value != null" v-text="$i18n.$d(value, 'date')" />
            <span v-else v-text="$i18n.$t.extension.universeHistory.today" />
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { OgameTrackerUniverseHistoryPlayerAlliance } from '@/shared/db/schema/universe-history';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import { GridTableColumn } from '../common/GridTable.vue';

    interface AllianceHistoryItem {
        alliance: { name: string; tag: string } | null;
        start: number | null;
        end: number | null;
    }

    @Component({})
    export default class PlayerAllianceHistoryTable extends Vue {
        @Prop({ required: true, type: Number })
        private playerId!: number;

        private history: OgameTrackerUniverseHistoryPlayerAlliance[] = [];
        private loading = true;

        @Watch('playerId', { immediate: true })
        private async onPlayerIdChanged() {
            this.history = await UniverseHistoryDataModule.getPlayerAllianceHistory(this.playerId);
            this.loading = false;
        }

        private get allianceHistoryColumns(): GridTableColumn<keyof AllianceHistoryItem | '-'>[] {
            return [
                {
                    key: 'alliance',
                    label: this.$i18n.$t.extension.universeHistory.alliance,
                },
                {
                    key: 'start',
                    label: this.$i18n.$t.extension.universeHistory.from,
                },
                {
                    key: '-',
                },
                {
                    key: 'end',
                    label: this.$i18n.$t.extension.universeHistory.until,
                },
            ];
        }

        private get allianceHistoryItems(): AllianceHistoryItem[] {
            return this.history.map<AllianceHistoryItem>((item, i, history) => {
                const start = i == 0 ? null : item.date;
                const end = history[i + 1]?.date ?? null;

                return {
                    alliance: UniverseHistoryDataModule.alliances.find(a => a.id == item.allianceId) ?? null,
                    start,
                    end,
                };
            }).reverse();
        }
    }
</script>