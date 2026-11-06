<template>
    <div class="lifeform-planet-bonuses" :style="`--bonus-types: ${types.length}`">
        <div class="header-row">
            <div class="title">
                <slot v-if="$slots.header != null" name="header" />
                <span v-else v-text="header" />
            </div>

            <div v-for="type in types" :key="type.key" class="partial-bonus">
                <div class="title" v-text="type.label" />
                <span class="avg-value">
                    <DecimalNumber :value="averageBonus[type.key] * 100" prefix="⌀ " suffix="%" :digits="3" :fade-decimals="false" style="--small-fraction-size: 0.75em" />
                </span>
            </div>
        </div>

        <div v-for="planet in empirePlanets" :key="planet.id" class="planet-row">
            <template v-if="planet.activeLifeform != 'none'">
                <div class="planet-header-row">
                    <div class="toggle">
                        <span
                            class="mdi"
                            :class="{
                                'mdi-menu-down': expandedPlanets[planet.id] == true,
                                'mdi-menu-right': expandedPlanets[planet.id] != true,
                            }"
                            @click="togglePlanet(planet.id)"
                        />
                    </div>
                    <div v-text="`${planet.name} ${formatCoordinates(planet.coordinates)}`" />
                    <span v-for="type in types" :key="type.key" class="bonus">
                        <DecimalNumber
                            :value="getTotalPlanetBonus(planets[planet.id], type.key) * 100"
                            suffix="%"
                            :digits="3"
                            :fade-decimals="false"
                            style="--small-fraction-size: 0.75em"
                        />
                        <span
                            v-if="
                                limits[type.key](Number.MAX_SAFE_INTEGER) == getTotalPlanetBonus(planets[planet.id], type.key)
                                || limits[type.key](Number.MIN_SAFE_INTEGER) == getTotalPlanetBonus(planets[planet.id], type.key)
                            "
                            class="mdi mdi-alert-outline"
                        />
                    </span>
                </div>

                <template v-if="expandedPlanets[planet.id] == true">
                    <div v-for="building in buildingsSorted" :key="building" class="tech-row">
                        <template v-if="
                            (!isStandardBuilding(building) && LifeformBuildingTypesByLifeform[planet.activeLifeform].includes(building) && planet.lifeformBuildings[building] > 0)
                            || forceIncludeBuildings.includes(building)
                        ">
                            <div />
                            <div v-if="isStandardBuilding(building)" class="tech">
                                <OBuilding :building="building" size="24px" />
                                <span v-text="translations().ogame.buildings[building] + ` (${(planet.buildings[building as keyof typeof planet.buildings] ?? 0)})`" />
                            </div>
                            <div v-else class="tech">
                                <OLifeformBuilding :building="building" size="24px" />
                                <span v-text="translations().ogame.lifeformBuildings[building] + ` (${planet.lifeformBuildings[building]})`" />
                            </div>
                            <span v-for="type in types" :key="type.key" class="bonus">
                                <DecimalNumber
                                    :value="(planets[planet.id].bonusByBuilding[type.key][building] ?? 0) * 100"
                                    suffix="%"
                                    :digits="3"
                                    :fade-decimals="false"
                                    style="--small-fraction-size: 0.75em"
                                />
                            </span>
                        </template>
                    </div>

                    <div v-if="!noTechnologyBonuses" class="tech-row">
                        <div />
                        <div>
                            <RouterLink :to="{ name: researchBonusBreakdownRouteName }" style="text-decoration: none">
                                <span v-text="translations().extension.empire.lifeforms.globalResearchBonus" />
                                <span class="mdi mdi-open-in-new" />
                            </RouterLink>
                        </div>
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <DecimalNumber
                                :value="technologyBonuses[type.key] * 100"
                                suffix="%"
                                :digits="3"
                                :fade-decimals="false"
                                style="--small-fraction-size: 0.75em"
                            />
                        </span>
                    </div>
                </template>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';

export type LifeformPlanetBonusesType<TKey extends string = string> = {
    key: TKey;
    label: string;
}

export type LifeformPlanetBonuses<TKey extends string = string> = {
    planet: PlanetData;
    bonusByBuilding: Record<TKey, Partial<Record<LifeformBuildingType | BuildingType, number>>>;
}
</script>

<script setup lang="ts">
import DecimalNumber from '@stats/components/common/DecimalNumber.vue';
import OBuilding from '@stats/components/ogame/OBuilding.vue';
import OLifeformBuilding from '@stats/components/ogame/OLifeformBuilding.vue';
import { RouterLink } from 'vue-router';
import { computed, reactive } from 'vue';
import { translations } from '@stats/i18n';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { PropType } from 'vue';
import type { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { BuildingTypes } from '@ogame-tracker/shared/models/ogame/buildings/BuildingTypes';

const props = defineProps({
    header: { required: false, type: String, default: () => '' },
    types: { required: true, type: Array as PropType<LifeformPlanetBonusesType[]> },
    technologyBonuses: { required: true, type: Object as PropType<Record<string, number>> },
    noTechnologyBonuses: { required: false, type: Boolean },
    planets: { required: true, type: Object as PropType<Record<number, LifeformPlanetBonuses>> },
    buildings: { required: true, type: Array as PropType<(LifeformBuildingType | BuildingType)[]> },
    forceIncludeBuildings: { required: false, type: Array as PropType<(LifeformBuildingType | BuildingType)[]>, default: () => [] },
    limits: { required: true, type: Object as PropType<Record<string, (value: number) => number>> },
    researchBonusBreakdownRouteName: { required: true, type: String },
});

const empireStore = useEmpireStore();

function isStandardBuilding(building: BuildingType | LifeformBuildingType): building is BuildingType {
    return (BuildingTypes as readonly number[]).includes(building);
}

const buildingsSorted = computed<(LifeformBuildingType | BuildingType)[]>(() => [...props.buildings].sort((a, b) => a - b));

const expandedPlanets = reactive<Partial<Record<number, boolean>>>({});

function togglePlanet(id: number) {
    expandedPlanets[id] = !(expandedPlanets[id] ?? false);
}

function formatCoordinates(coords: Coordinates) {
    return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
}

function getTotalPlanetBonus(planet: LifeformPlanetBonuses, type: string): number {
    const bonus = Object.values(planet.bonusByBuilding[type]).reduce((total, cur) => total + (cur ?? 0), 0)
        + (props.noTechnologyBonuses ? 0 : props.technologyBonuses[type]);

    return props.limits[type](bonus);
}

const averageBonus = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {};

    props.types.forEach(type => {
        const total = Object.values(props.planets)
            .map(planet => getTotalPlanetBonus(planet, type.key))
            .reduce((total, cur) => total + cur, 0);

        result[type.key] = total / empirePlanets.value.length;
    });

    return result;
});

const empirePlanets = computed(() => {
    return empireStore.empire.planetOrder
        .map(id => empireStore.empire.planets[id])
        .filter(planet => !planet.isMoon) as PlanetData[]
});
</script>

<style lang="scss" scoped>
    .lifeform-planet-bonuses {
        --border-radius: 4px;

        display: inline-grid;
        grid-template-columns: auto 1fr repeat(var(--bonus-types), auto);
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: var(--border-radius);

        * {
            display: flex;
            padding: 4px 12px;
            align-items: center;
        }
    }

    .toggle > .mdi {
        font-size: 24px;
        padding: 0;
        cursor: pointer;
    }

    .header-row {
        display: contents;

        & > * {
            background-color: black;
            background-image: linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        }

        & > *:first-of-type {
            border-top-left-radius: var(--border-radius);
        }
        & > *:last-of-type {
            border-top-right-radius: var(--border-radius);
        }

        .partial-bonus {
            flex-direction: column;
            align-items: end;

            * {
                padding: 0;
            }
        }

        .title {
            grid-column: 1 / span 2;

            * {
                padding: 0;
            }
        }
    }

    .planet-row {
        display: contents;
        --opacity: 0.3;

        &:nth-of-type(odd) {
            --opacity: 0.25;
        }

        .planet-header-row {
            display: contents;

            > * {
                background: rgba(var(--color), var(--opacity));
            }
        }
    }

    .tech-row {
        display: contents;

        &:nth-of-type(odd) > * {
            background: rgba(var(--color), 0.05);
        }

        &.boosts > * {
            border-top: 1px solid rgba(var(--color), 0.3);
        }
    }

    .tech-header-row {
        display: contents;
        font-style: italic;
    }

    .tech {
        .o-lifeform-technology {
            display: inline-block !important;
            padding: 0;
        }
    }

    .slot {
        justify-content: end;
    }
    .bonus {
        justify-content: end;
    }

    .fade {
        color: rgba(white, 0.2);
    }

    .decimal-number {
        align-items: end !important;
        padding: 0;
    }

    .total-value {
        display: flex;
        flex-direction: column;
        align-items: end;
    }
</style>
