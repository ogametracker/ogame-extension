<template>
    <loading-spinner v-if="loading" />
    <div v-else>
        <div class="header-row">
            <div v-text="'LOCA: Date'" />
            <template v-for="planet in history">
                <div v-text="`LOCA: Planet ${planet.id}`" :key="`planet-${planet.id}`" />
                <div v-text="`LOCA: Moon ${planet.id}`" :key="`moon-${planet.id}`" />
            </template>
        </div>

        <div class="row" v-for="group in groups" :key="group.date">
            <div v-text="group.date" />
            <div v-text="group.changes" />
        </div>
    </div>
</template>

<script lang="ts">
    import { DbUniverseHistoryCoordinates, DbUniverseHistoryPlanetMoonState } from '@/shared/db/schema/universe-history';
    import { createRecord } from '@/shared/utils/createRecord';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { UniverseHistoryDataModule, UniverseHistoryPlanetHistory } from '../../data/UniverseHistoryDataModule';

    interface PlanetChanges {
        names: string[];
        states: DbUniverseHistoryPlanetMoonState[];
        coordinates: DbUniverseHistoryCoordinates[];

        moons: Record<number, MoonChanges>
    }

    interface MoonChanges {
        names: string[];
        states: DbUniverseHistoryPlanetMoonState[];
    }

    interface Group {
        date: number;
        changes: Record<number, PlanetChanges>;
    }

    @Component({})
    export default class PlayerPlanetsAndMoonsHistory extends Vue {
        @Prop({ required: true, type: Number })
        private playerId!: number;

        private history: UniverseHistoryPlanetHistory[] = [];
        private loading = true;

        private async mounted() {
            this.history = await UniverseHistoryDataModule.getPlayerPlanetsAndMoonsHistory(this.playerId);
            this.history.sort((a, b) => a.id - b.id);

            this.loading = false;
        }

        private get groups() {
            const planetIds = this.history.map(p => p.id);

            const groups: Record<number, Group> = {};
            const getGroup = (date: number) => {
                return (groups[date] ??= {
                    date,
                    changes: createRecord(planetIds, () => ({
                        names: [],
                        states: [],
                        coordinates: [],

                        moons: {},
                    })),
                });
            };
            const getPlanet = (date: number, planetId: number) => getGroup(date).changes[planetId];
            const getMoon = (date: number, planetId: number, moonId: number) => {
                const moons = getGroup(date).changes[planetId].moons;
                return (moons[moonId] ??= {
                    names: [],
                    states: [],
                });
            };

            this.history.forEach(planet => {
                planet.names.forEach(history => getPlanet(history.date, planet.id).names.push(history.name));
                planet.states.forEach(history => getPlanet(history.date, planet.id).states.push(history.state));
                planet.coordinates.forEach(history => getPlanet(history.date, planet.id).coordinates.push(history.coordinates));

                planet.moons.forEach(moon => {
                    moon.names.forEach(history => getMoon(history.date, planet.id, moon.id).names.push(history.name));
                    moon.states.forEach(history => getMoon(history.date, planet.id, moon.id).states.push(history.state));
                });
            });

            return Object.values(groups).sort((a, b) => a.date - b.date);
        }
    }
</script>