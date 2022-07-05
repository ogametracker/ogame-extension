<template>
    <loading-spinner v-if="loading" />
    <grid-table v-else :columns="nameHistoryColumns" :items="nameHistoryItems" inline>
        <template #cell-start="{ value }">
            <span v-if="value != null" v-text="$i18n.$d(value, 'date')" />
            <span v-else v-text="'?'" />
        </template>

        <template #cell-->-</template>

        <template #cell-end="{ value }">
            <span v-if="value != null" v-text="$i18n.$d(value, 'date')" />
            <span v-else v-text="$i18n.$t.universeHistory.today" />
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { OgameTrackerUniverseHistoryPlayerName } from '@/shared/db/schema/universe-history';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import { GridTableColumn } from '../common/GridTable.vue';

    interface NameHistoryItem {
        name: string;
        start: number | null;
        end: number | null;
    }

    @Component({})
    export default class PlayerNameHistoryTable extends Vue {
        @Prop({ required: true, type: Number })
        private playerId!: number;

        private history: OgameTrackerUniverseHistoryPlayerName[] = [];
        private loading = true;

        private async mounted() {
            this.history = await UniverseHistoryDataModule.getPlayerNameHistory(this.playerId);
            this.loading = false;
        }

        private get nameHistoryColumns(): GridTableColumn<keyof NameHistoryItem | '-'>[] {
            return [
                {
                    key: 'name',
                    label: this.$i18n.$t.universeHistory.name,
                },
                {
                    key: 'start',
                    label: this.$i18n.$t.universeHistory.from,
                },
                {
                    key: '-',
                },
                {
                    key: 'end',
                    label: this.$i18n.$t.universeHistory.until,
                },
            ];
        }

        private get nameHistoryItems(): NameHistoryItem[] {
            return this.history.map<NameHistoryItem>((item, i, history) => {
                const start = i == 0 ? null : item.date;
                const end = history[i + 1]?.date ?? null;

                return {
                    name: item.name,
                    start,
                    end,
                };
            }).reverse();
        }

    }
</script>