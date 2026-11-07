<template>
    <LoadingSpinner v-if="loading" />
    <div v-else :style="`--planets: ${history.length}; --offset: ${clientHeight}`">
        <div class="planets-moons-history" ref="container">
            <div class="row" v-for="item in items" :key="item.date">
                <div v-text="formatDate(item.date, 'date')" class="date-column" />
                <div
                    v-for="planet in item.items"
                    :key="`planet-${planet.id}`"
                    class="planet"
                    :class="{
                        new: planet.state.hasChange && planet.state.value == 'new',
                    }"
                >
                    <span class="ogti ogti-planet" />
                    <div v-text="planet.name.value" :class="{ change: planet.name.hasChange }" />
                    <div
                        v-text="formatCoords(planet.coordinates.value)"
                        :class="{ change: planet.coordinates.hasChange }"
                    />

                    <div
                        v-if="planet.moon != null"
                        class="moon"
                        :class="{
                            new: planet.moon.state.hasChange && planet.moon.state.value == 'new',
                        }"
                    >
                        <span class="ogti ogti-moon" />
                        <div v-text="planet.moon.name.value" :class="{ change: planet.moon.name.hasChange }" />
                        <div v-text="`${formatNumber(planet.moon.size)} km`" />
                    </div>
                </div>

                <div class="planet--empty" :style="`--start: ${item.items.length + 2};`" />
            </div>
        </div>
        <div class="scroller" />
    </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '@stats/components/common/LoadingSpinner.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { formatNumber, formatDate } from '@stats/i18n';
import type {
    DbUniverseHistoryCoordinates,
    DbUniverseHistoryPlanetMoonState,
} from '@ogame-tracker/shared/db/schema/universe-history';
import { compareCoordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import type { UniverseHistoryPlanetHistory } from '../../data/UniverseHistoryDataModule';

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
    id: number;
    name: string | null;
    state: null | 'new';
    coordinates: DbUniverseHistoryCoordinates | null;

    moon: MoonState | null;
}

interface MoonState {
    id: number;
    size: number;
    name: string | null;
    state: null | 'new';
}

interface PlanetItem {
    id: number;
    name: {
        value: string | null;
        hasChange: boolean;
    };
    state: {
        value: null | 'new';
        hasChange: boolean;
    };
    coordinates: {
        value: DbUniverseHistoryCoordinates | null;
        hasChange: boolean;
    };

    moon: MoonItem | null;
}

interface MoonItem {
    id: number;
    size: number;
    name: {
        value: string | null;
        hasChange: boolean;
    };
    state: {
        value: null | 'deleted' | 'new';
        hasChange: boolean;
    };
}

interface PlanetItemRow {
    date: number;
    items: PlanetItem[];
}

interface MoonInfo {
    id: number;
    size: number;
}

const props = defineProps({
    playerId: { required: true, type: Number },
});

const universeHistoryStore = useUniverseHistoryStore();

const container = useTemplateRef<HTMLDivElement>('container');

const parentContainer = computed<HTMLElement>(() => container.value!.closest('main')!);

const history = ref<UniverseHistoryPlanetHistory[]>([]);

const moonSizes = ref<Record<number, number>>({});

const loading = ref(true);

const clientHeight = ref(0);

const observer = new ResizeObserver(x => updateClientHeight());

function updateClientHeight() {
    if (items.value.length == 0) {
        clientHeight.value = 0;
        return;
    }

    const containerHeight = container.value!.clientHeight;
    const parentHeight = parentContainer.value.clientHeight;
    const lastRowHeight = container.value!.querySelector(
        `.row:nth-of-type(${items.value.length}) > .date-column`,
    )!.clientHeight;

    const offset = Math.max(parentHeight, containerHeight) - lastRowHeight - 24; // 2*12px = padding of main
    clientHeight.value = offset;
}

const items = ref<PlanetItemRow[]>([]);

async function onPlayerIdChanged() {
    history.value = await universeHistoryStore.getPlayerPlanetsAndMoonsHistory(props.playerId);
    history.value.sort((a, b) => a.id - b.id);

    getKnownMoons(history.value).forEach(moon => (moonSizes.value[moon.id] = moon.size));

    prepareData();

    loading.value = false;

    observer.disconnect();
    await nextTick();
    observer.observe(container.value!);
    observer.observe(parentContainer.value);

    await nextTick();
    parentContainer.value.scrollTop = parentContainer.value.scrollHeight;
}

const style = ref<HTMLStyleElement | null>(null);

function getKnownMoons(nextHistory: UniverseHistoryPlanetHistory[]): MoonInfo[] {
    const moons = nextHistory.flatMap(his => his.moons).map(moon => ({ id: moon.id, size: moon.size }));
    return moons.filter((moon, i) => moons.findIndex(m => m.id == moon.id) == i);
}

function prepareData() {
    const changes = getChangesByDate();
    const dates = Object.keys(changes)
        .map(date => parseIntSafe(date, 10))
        .sort((a, b) => a - b);

    items.value = getItems(changes, dates);
}

function getItems(
    changesByDate: Record<number, Partial<Record<number, PlanetChange>>>,
    dates: number[],
): PlanetItemRow[] {
    const currentPlanetStates: Partial<Record<number, PlanetState>> = {};

    const getNewState = (
        oldState: 'deleted' | 'new' | null | undefined,
        newState: DbUniverseHistoryPlanetMoonState | undefined,
    ): 'new' | null => {
        if (oldState === undefined) {
            return 'new';
        }

        return null;
    };
    const getNewMoonState = (oldState: MoonState | null | undefined, change: MoonChange[]): MoonState | null => {
        const moon = change.find(moon => moon.state != 'deleted');

        if (moon != null) {
            return {
                id: moon.id,
                size: moonSizes.value[moon.id],
                name: oldState?.name ?? moon?.name ?? null,
                state: getNewState(oldState?.state, moon?.state),
            };
        }

        if (change.length > 0 || oldState == null) {
            return null;
        }

        return {
            ...oldState,
            state: null,
        };
    };
    const getNewPlanetState = (id: number, oldState: PlanetState | undefined, change: PlanetChange): PlanetState => {
        return {
            id,
            name: change.name ?? oldState?.name ?? null,
            state: getNewState(oldState?.state, change.state),
            coordinates: change.coordinates ?? oldState?.coordinates ?? null,

            moon: getNewMoonState(oldState?.moon, Object.values(change.moons)),
        };
    };

    const itemRows: PlanetItemRow[] = [];

    dates.forEach(date => {
        const row: PlanetItemRow = {
            date,
            items: [],
        };

        const changes = changesByDate[date];
        const planetIdsWithChange = Object.keys(changes).map(pid => parseIntSafe(pid, 10));
        planetIdsWithChange.forEach(planetId => {
            const oldState = currentPlanetStates[planetId];
            const change = changes[planetId]!;

            if (change.state == 'deleted') {
                delete currentPlanetStates[planetId];
                return;
            }

            const newState = getNewPlanetState(planetId, oldState, change);

            const item: PlanetItem = {
                id: planetId,
                name: {
                    value: newState.name,
                    hasChange: change.name !== undefined,
                },
                state: {
                    value: newState.state,
                    hasChange: change.state !== undefined,
                },
                coordinates: {
                    value: newState.coordinates,
                    hasChange: change.coordinates !== undefined,
                },

                moon:
                    newState.moon == null
                        ? null
                        : {
                              id: newState.moon.id,
                              size: newState.moon.size,
                              name: {
                                  value: newState.moon.name,
                                  hasChange: Object.values(change.moons).some(mc => mc.name !== undefined),
                              },
                              state: {
                                  value: newState.state,
                                  hasChange: Object.values(change.moons).some(mc => mc.state !== undefined),
                              },
                          },
            };

            row.items.push(item);

            currentPlanetStates[planetId] = newState;
        });

        const getMoonItem = (state: MoonState | null): MoonItem | null => {
            if (state == null) {
                return null;
            }

            return {
                id: state.id,
                size: state.size,
                name: {
                    value: state.name,
                    hasChange: false,
                },
                state: {
                    value: state.state,
                    hasChange: false,
                },
            };
        };
        Object.keys(currentPlanetStates)
            .map(pid => parseIntSafe(pid, 10))
            .filter(pid => !planetIdsWithChange.includes(pid))
            .forEach(planetId => {
                const state = currentPlanetStates[planetId]!;

                const item: PlanetItem = {
                    id: planetId,
                    name: {
                        value: state.name,
                        hasChange: false,
                    },
                    state: {
                        value: state.state,
                        hasChange: false,
                    },
                    coordinates: {
                        value: state.coordinates,
                        hasChange: false,
                    },

                    moon: getMoonItem(state.moon),
                };

                row.items.push(item);
            });

        row.items.sort((a, b) => {
            if (a.coordinates.value == null) {
                return b.coordinates.value == null ? -1 : 1;
            }
            if (b.coordinates.value == null) {
                return -1;
            }
            return compareCoordinates(a.coordinates.value as Coordinates, b.coordinates.value as Coordinates);
        });
        itemRows.push(row);
    });

    return itemRows;
}

function getChangesByDate(): Record<number, Partial<Record<number, PlanetChange>>> {
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

    history.value.forEach(planet => {
        planet.names.forEach(nextHistory => (getPlanet(nextHistory.date, planet.id).name = nextHistory.name));
        planet.states.forEach(nextHistory => (getPlanet(nextHistory.date, planet.id).state = nextHistory.state));
        planet.coordinates.forEach(
            nextHistory => (getPlanet(nextHistory.date, planet.id).coordinates = nextHistory.coordinates),
        );

        planet.moons.forEach(moon => {
            moon.names.forEach(nextHistory => (getMoon(nextHistory.date, planet.id, moon.id).name = nextHistory.name));
            moon.states.forEach(
                nextHistory => (getMoon(nextHistory.date, planet.id, moon.id).state = nextHistory.state),
            );
        });
    });

    return result;
}

function formatCoords(coords: DbUniverseHistoryCoordinates | null) {
    if (coords == null) {
        return '';
    }

    return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
}

watch(() => props.playerId, onPlayerIdChanged, { immediate: true });

onMounted(() => {
    const localStyle = document.createElement('style');
    localStyle.textContent = `
        .tabs > main {
            background: black linear-gradient(0deg, rgba(var(--color), 0.1), rgba(var(--color), 0.1)) !important;
        }
    `;
    document.head.append(localStyle);
    style.value = localStyle;
});

onUnmounted(() => {
    observer.disconnect();
    style.value?.remove();
});
</script>

<style lang="scss" scoped>
.planets-moons-history {
    width: fit-content;
    display: grid;
    grid-template-columns: repeat(calc(1 + var(--planets)), 1fr);

    .header-row,
    .row {
        display: contents;
    }
}

.deleted {
    color: red;
}

.new,
.new .change {
    color: lime;
}

.change {
    color: orange;
}

.row {
    > div {
        position: sticky;
        top: 0;
        background: rgb(var(--color));
        padding: 8px;
        background: black linear-gradient(0deg, rgba(var(--color), 0.1), rgba(var(--color), 0.1));
    }

    &:nth-of-type(odd) > div {
        background: black linear-gradient(0deg, rgba(var(--color), 0.15), rgba(var(--color), 0.15));
    }
}

.planet,
.moon {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 8px;
    line-height: 1;
    white-space: nowrap;

    .ogti {
        grid-row: auto / span 2;
        grid-column: 1;
        font-size: 36px;
    }
}

.planet {
    grid-template-rows: repeat(2, 3fr) repeat(2, 2fr);

    &--empty {
        grid-column: var(--start) / calc(2 + var(--planets));
    }
}

.moon {
    grid-template-rows: 1fr 1fr;
    display: contents;
    font-size: 10px;

    > .ogti {
        font-size: 24px;
        justify-self: end;
    }
}

.date-column {
    grid-column: 1;
    grid-row: auto / span 2;
    display: flex;
    align-items: center;
}

.scroller {
    height: calc(1px * var(--offset));
    grid-column: 1;
}
</style>
