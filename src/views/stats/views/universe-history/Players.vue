<template>
    <div>
        TODO: Player histories here: {{ playerIds }}:
        <hr />
        <span v-text="playerHistories" />
    </div>
</template>

<script lang="ts">
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { GlobalOgameMetaData } from '../../data/GlobalOgameMetaData';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';

    @Component({})
    export default class Players extends Vue {
        private get playerIds(): number[] {
            return (this.$route.query.players as string | null ?? '')
                .split(',')
                .filter(id => id.length > 0)
                .map(pid => parseIntSafe(pid, 10));
        }

        private mounted() {
            if (this.playerIds.length == 0) {
                this.$router.replace({
                    name: 'universe-history/players',
                    query: {
                        players: GlobalOgameMetaData.playerId.toString(),
                    },
                });
                return;
            }
        }

        private get playerHistories() {
            const playerHistories = UniverseHistoryDataModule.history.players;
            return this.playerIds.map(pid => playerHistories[pid])
                .filter(ph => ph != null);
        }
    }
</script>