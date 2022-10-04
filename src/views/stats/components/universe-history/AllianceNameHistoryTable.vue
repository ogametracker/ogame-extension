<template>
    <loading-spinner v-if="loading" />
    <grid-table v-else :columns="columns" :items="items" inline>
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
    import { OgameTrackerUniverseHistoryAllianceName } from '@/shared/db/schema/universe-history';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import { GridTableColumn } from '../common/GridTable.vue';

    interface NameHistoryItem {
        name: string;
        start: number | null;
        end: number | null;
    }

    @Component({})
    export default class AllianceNameHistoryTable extends Vue {
        @Prop({ required: true, type: Number })
        private allianceId!: number;

        private history: OgameTrackerUniverseHistoryAllianceName[] = [];
        private loading = true;

        @Watch('allianceId', { immediate: true })
        private async onAllianceIdChanged() {
            this.history = await UniverseHistoryDataModule.getAllianceNameHistory(this.allianceId);
            this.loading = false;
        }

        private get columns(): GridTableColumn<keyof NameHistoryItem | '-'>[] {
            return [
                {
                    key: 'name',
                    label: this.$i18n.$t.extension.universeHistory.name,
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

        private get items(): NameHistoryItem[] {
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