<template>
    <h2>Coming soon&trade;</h2>
    <!--
    <loading-spinner v-if="loading" />
    <div v-else class="planets-moons-history" :style="`--planets: ${history.length}`">
        <div class="header-row">
            <div v-text="'LOCA: Date'" />
            <template v-for="planet in history">
                <div v-text="`LOCA: Planet ${planet.id}`" :key="`planet-${planet.id}`" />
                <div v-text="`LOCA: Moon ${planet.id}`" :key="`moon-${planet.id}`" />
            </template>
        </div>

        <div class="row" v-for="date in dates" :key="date">
            <div v-text="$i18n.$d(date, 'date')" />
            <template v-for="planet in history">
                <div
                    v-if="items[date][planet.id] != null"
                    :key="`planet-${planet.id}`"
                    :class="{
                        deleted: items[date][planet.id].state == 'deleted',
                        new: items[date][planet.id].state == 'new',
                    }"
                >
                    <span class="ogti ogti-planet" />
                    <div v-text="items[date][planet.id].name" />
                    <div v-text="items[date][planet.id].state" />
                    <div v-text="formatCoords(items[date][planet.id].coordinates)" />
                </div>
                <div v-else :key="`planet-${planet.id}`" />
                <div :key="`moon-${planet.id}`">
                    <span class="ogti ogti-moon" />
                    TODO:
                </div>
            </template>
        </div>
    </div>
    -->
</template>

<script lang="ts">
    import { DbUniverseHistoryCoordinates, DbUniverseHistoryPlanetMoonState } from '@/shared/db/schema/universe-history';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { UniverseHistoryDataModule, UniverseHistoryPlanetHistory } from '../../data/UniverseHistoryDataModule';

    interface PlanetChange {
        id: number;
        name?: string;
        state?: DbUniverseHistoryPlanetMoonState;
        coordinates?: DbUniverseHistoryCoordinates;

        moons: Record<number, MoonChange>;
    }

    interface MoonChange {
        id: number;
        name?: string;
        state?: DbUniverseHistoryPlanetMoonState;
    }

    interface PlanetState {
        name: string | null;
        state: null | 'deleted' | 'new';
        coordinates: DbUniverseHistoryCoordinates | null;
    }


    @Component({})
    export default class PlayerPlanetsAndMoonsHistory extends Vue {
        @Prop({ required: true, type: Number })
        private playerId!: number;


        private history: UniverseHistoryPlanetHistory[] = [];
        private loading = true;

        private items: Record<number, Record<number, PlanetState | null>> = {};
        private dates: number[] = [];


        @Watch('playerId', { immediate: true })
        private async onPlayerIdChanged() {
            this.history = await UniverseHistoryDataModule.getPlayerPlanetsAndMoonsHistory(this.playerId);
            this.history.sort((a, b) => a.id - b.id);

            this.prepareData();
            console.log(this.items);

            this.loading = false;
        }

        private prepareData() {
            const changes = this.getChangesByDate();
            this.dates = Object.keys(changes)
                .map(date => parseIntSafe(date, 10))
                .sort((a, b) => a - b);

            this.items = this.getItems(changes, this.dates);
        }

        private getItems(changes: Record<number, Partial<Record<number, PlanetChange>>>, dates: number[]): Record<number, Record<number, PlanetState | null>> {
            const result: Record<number, Record<number, PlanetState | null>> = {};

            const getPrevious = <T>(index: number, planetId: number, selector: (change: PlanetChange) => T | undefined, defaultValue: T): T | null => {
                const prevDates = dates.slice(0, index).reverse();

                for (const date of prevDates) {
                    const planetChanges = changes[date][planetId];
                    if (planetChanges == null) {
                        continue;
                    }

                    const selection = selector(planetChanges);
                    if (selection !== undefined) {
                        return selection;
                    }
                }

                return defaultValue;
            };

            const getState = (index: number, planetId: number): PlanetState['state'] => {
                const isNew = dates.slice(0, index).every(prevDate => changes[prevDate] == null);
                if (isNew) {
                    return 'new';
                }

                const change = changes[dates[index]][planetId];
                const state = change?.state === undefined
                    ? getPrevious(index, planetId, change => change.state, null)
                    : change.state;

                return state;
            };

            const getPlanetState = (date: number, index: number, planetId: number): PlanetState | null => {
                const change = changes[date][planetId];
                if (change?.name == undefined && change?.state == undefined && change?.coordinates == undefined) {
                    return null;
                }

                return {
                    name: change.name ?? getPrevious(index, planetId, change => change.name, null),
                    state: getState(index, planetId),
                    coordinates: change.coordinates ?? getPrevious(index, planetId, change => change.coordinates, null),
                };
            };

            dates.forEach((date, i) => {
                const planetIds = Object.keys(changes[date]).map(planetId => parseIntSafe(planetId, 10));
                planetIds.forEach(planetId => {
                    const state = getPlanetState(date, i, planetId);
                    result[date] ??= {};
                    result[date][planetId] = state;
                });
            });

            return result;
        }

        private getChangesByDate(): Record<number, Partial<Record<number, PlanetChange>>> {
            const result: Record<number, Partial<Record<number, PlanetChange>>> = {};

            const getPlanet = (date: number, planetId: number) => {
                result[date] ??= {};
                return (result[date][planetId] ??= {
                    id: planetId,
                    moons: [],
                });
            };
            const getMoon = (date: number, planetId: number, moonId: number) => {
                return (getPlanet(date, planetId).moons[moonId] ??= {
                    id: moonId,
                });
            };

            this.history.forEach(planet => {
                planet.names.forEach(history => getPlanet(history.date, planet.id).name = history.name);
                planet.states.forEach(history => getPlanet(history.date, planet.id).state = history.state);
                planet.coordinates.forEach(history => getPlanet(history.date, planet.id).coordinates = history.coordinates);

                planet.moons.forEach(moon => {
                    moon.names.forEach(history => getMoon(history.date, planet.id, moon.id).name = history.name);
                    moon.states.forEach(history => getMoon(history.date, planet.id, moon.id).state = history.state);
                });
            });

            return result;
        }

        private formatCoords(coords: DbUniverseHistoryCoordinates | null) {
            if (coords == null) {
                return '';
            }

            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }
    }
</script>
<style lang="scss" scoped>
    .planets-moons-history {
        display: grid;
        grid-template-columns: repeat(calc(1 + 2 * var(--planets)), 1fr);
        gap: 8px;

        .header-row,
        .row {
            display: contents;
        }
    }

    .deleted {
        color: red;
    }

    .new {
        color: lime;
    }

    .row > div {
        position: sticky;
        top: 0;
        background: rgb(var(--color));
    }
</style>