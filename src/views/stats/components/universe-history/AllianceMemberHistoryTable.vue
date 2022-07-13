<template>
    <loading-spinner v-if="loading" />
    <grid-table v-else :columns="columns" :items="items" inline>
        <template #cell-members="{ value }">
            <div class="member-list">
                <span v-for="(player, i) in value" :key="i" v-text="player" />
            </div>
        </template>

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
    import { OgameTrackerUniverseHistoryAllianceMembers } from '@/shared/db/schema/universe-history';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import { GridTableColumn } from '../common/GridTable.vue';

    interface MembersHistoryItem {
        members: string[];
        start: number | null;
        end: number | null;
    }

    @Component({})
    export default class AllianceMemberHistoryTable extends Vue {
        @Prop({ required: true, type: Number })
        private allianceId!: number;

        private history: OgameTrackerUniverseHistoryAllianceMembers[] = [];
        private playerNames: Record<number, string> = {};
        private loading = true;

        @Watch('allianceId', { immediate: true })
        private async onAllianceIdChanged() {
            this.history = await UniverseHistoryDataModule.getAllianceMemberHistory(this.allianceId);
            this.playerNames = await UniverseHistoryDataModule.getLatestPlayerNamesById();
            this.loading = false;
        }

        private get columns(): GridTableColumn<keyof MembersHistoryItem | '-'>[] {
            return [
                {
                    key: 'members',
                    label: this.$i18n.$t.universeHistory.members,
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

        private get items(): MembersHistoryItem[] {
            return this.history.map<MembersHistoryItem>((item, i, history) => {
                const start = i == 0 ? null : item.date;
                const end = history[i + 1]?.date ?? null;

                return {
                    members: item.members.map(id => this.playerNames[id]).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
                    start,
                    end,
                };
            }).reverse();
        }

    }
</script>
<style lang="scss" scoped>
    .member-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: start;
        column-gap: 16px;
        width: 100%;
    }
</style>