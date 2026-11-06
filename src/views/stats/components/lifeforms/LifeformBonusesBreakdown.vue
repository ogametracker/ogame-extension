<template>
    <div class="lifeform-bonus-breakdown" :style="`--bonus-types: ${types.length}`">
        <div class="header-row">
            <div class="title">
                <slot v-if="$slots.header != null" name="header" />
                <span v-else v-text="header" />
            </div>

            <div v-for="type in types" :key="type.key" class="partial-bonus">
                <div class="title" v-text="type.label" />
                <span class="total-value">
                    <DecimalNumber
                        :value="totalBonus[type.key] * 100"
                        suffix="%"
                        :digits="3"
                        :fade-decimals="false"
                        style="--small-fraction-size: 0.75em"
                    />
                    <span
                        v-if="
                            limits[type.key](Number.MAX_SAFE_INTEGER) == totalBonus[type.key] ||
                            limits[type.key](Number.MIN_SAFE_INTEGER) == totalBonus[type.key]
                        "
                        class="mdi mdi-alert-outline"
                    />
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
                            :value="totalPlanetBonusesByType[planet.id][type.key] * 100"
                            suffix="%"
                            :digits="3"
                            :fade-decimals="false"
                            style="--small-fraction-size: 0.75em"
                        />
                    </span>
                </div>

                <template v-if="expandedPlanets[planet.id] == true">
                    <div class="tech-header-row">
                        <div
                            class="slot"
                            v-text="translations().extension.empire.lifeforms.researchBonuses.breakdown.slot"
                        />
                        <div
                            class="tech"
                            v-text="translations().extension.empire.lifeforms.researchBonuses.breakdown.research"
                        />
                        <div
                            v-for="type in types"
                            :key="type.key"
                            class="bonus"
                            v-text="translations().extension.empire.lifeforms.researchBonuses.breakdown.bonus"
                        />
                    </div>

                    <div v-for="tech in technologiesSorted" :key="tech" class="tech-row">
                        <template
                            v-if="
                                planet.activeLifeformTechnologies.includes(tech) &&
                                planet.lifeformTechnologies[tech] > 0
                            "
                        >
                            <div class="slot" v-text="LifeformTechnologySlots[tech]" />
                            <div class="tech">
                                <OLifeformTechnology :technology="tech" size="24px" />
                                <span
                                    v-text="
                                        translations().ogame.lifeformTechnologies[tech] +
                                        ` (${planet.lifeformTechnologies[tech]})`
                                    "
                                />
                            </div>
                            <span v-for="type in types" :key="type.key" class="bonus">
                                <DecimalNumber
                                    :value="totalPlanetBonusesByTechnologyType[planet.id][tech][type.key].base * 100"
                                    suffix="%"
                                    :digits="3"
                                    :fade-decimals="false"
                                    style="--small-fraction-size: 0.75em"
                                />
                            </span>
                        </template>
                    </div>

                    <div class="tech-row boosts">
                        <div />
                        <div
                            v-text="
                                translations().extension.empire.lifeforms.researchBonuses.breakdown
                                    .lifeformBuildingsBoost
                            "
                        />
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <DecimalNumber
                                :value="buildingsPlanetBonusesByType[planet.id][type.key] * 100"
                                suffix="%"
                                :digits="3"
                                :fade-decimals="false"
                                style="--small-fraction-size: 0.75em"
                            />
                        </span>
                    </div>

                    <div class="tech-row">
                        <div />
                        <div
                            v-text="
                                translations().extension.empire.lifeforms.researchBonuses.breakdown.lifeformLevelBoost(
                                    translations().ogame.lifeforms[planet.activeLifeform],
                                    formatNumber(
                                        getLifeformLevelTechnologyBonus(experience[planet.activeLifeform]) * 100,
                                        smallPercentageFormat,
                                    ) + '%',
                                )
                            "
                        />
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <DecimalNumber
                                :value="levelPlanetBonusesByType[planet.id][type.key] * 100"
                                suffix="%"
                                :digits="3"
                                :fade-decimals="false"
                                style="--small-fraction-size: 0.75em"
                            />
                        </span>
                    </div>

                    <div
                        class="tech-row boosts"
                        v-if="Object.values(planetBugBonusesByType[planet.id]).some(val => val != 0)"
                    >
                        <div />
                        <div v-text="translations().extension.empire.lifeforms.researchBonuses.breakdown.bugBoost" />
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <DecimalNumber
                                :value="planetBugBonusesByType[planet.id][type.key] * 100"
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
import {
    LifeformTechnologySlots,
    LifeformTechnologyType,
} from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';

export type LifeformBonusesBreakdownType<TKey extends string = string> = {
    key: TKey;
    label: string;
};

export type LifeformBonusesPlanetBreakdown<TKey extends string = string> = {
    planet: PlanetData;
    technologyType: LifeformTechnologyType;
    bonuses: Record<
        TKey,
        {
            base: number;
            buildings: number;
            level: number;
            total: number;

            bugBonus?: number;
        }
    >;
};
</script>

<script setup lang="ts">
import DecimalNumber from '@stats/components/common/DecimalNumber.vue';
import OLifeformTechnology from '@stats/components/ogame/OLifeformTechnology.vue';
import { computed, reactive } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import {
    getLifeformLevel,
    getLifeformLevelTechnologyBonus,
} from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import type { ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { PropType } from 'vue';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';

const props = defineProps({
    header: { required: false, type: String, default: () => '' },
    types: { required: true, type: Array as PropType<LifeformBonusesBreakdownType[]> },
    planets: { required: true, type: Object as PropType<Record<number, LifeformBonusesPlanetBreakdown[]>> },
    technologies: { required: true, type: Array as PropType<LifeformTechnologyType[]> },
    limits: { required: true, type: Object as PropType<Record<string, (value: number) => number>> },
});

const empireStore = useEmpireStore();

const technologiesSorted = computed<LifeformTechnologyType[]>(() =>
    [...props.technologies].sort((a, b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]),
);

const smallPercentageFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};

const expandedPlanets = reactive<Partial<Record<number, boolean>>>({});

function togglePlanet(id: number) {
    expandedPlanets[id] = !(expandedPlanets[id] ?? false);
}

function formatCoordinates(coords: Coordinates) {
    return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
}

const experience = computed(() => empireStore.lifeformExperience);

const levels = computed<Record<ValidLifeformType, number>>(() =>
    createRecord(ValidLifeformTypes, type => getLifeformLevel(experience.value[type])),
);

const totalPlanetBonusesByTechnologyType = computed<
    Record<number, Record<LifeformTechnologyType, Record<string, LifeformBonusesPlanetBreakdown['bonuses'][string]>>>
>(() => {
    const result: Record<
        number,
        Record<LifeformTechnologyType, Record<string, LifeformBonusesPlanetBreakdown['bonuses'][string]>>
    > = {};

    Object.entries(props.planets)
        .map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
        .forEach(pair => {
            const [planetId, breakdowns] = pair;
            result[planetId] = {} as Record<
                LifeformTechnologyType,
                Record<string, LifeformBonusesPlanetBreakdown['bonuses'][string]>
            >;

            breakdowns.forEach(breakdown => {
                const techBreakdown = (result[planetId][breakdown.technologyType] ??= {});

                Object.entries(breakdown.bonuses).forEach(pair => {
                    const [key, bonuses] = pair;

                    techBreakdown[key] ??= {
                        base: 0,
                        buildings: 0,
                        level: 0,
                        total: 0,
                        bugBonus: 0,
                    };
                    techBreakdown[key].base += bonuses.base;
                    techBreakdown[key].buildings += bonuses.buildings;
                    techBreakdown[key].level += bonuses.level;
                    techBreakdown[key].total += bonuses.total;
                    techBreakdown[key].bugBonus! += bonuses.bugBonus ?? 0;
                });
            });
        });

    return result;
});

const buildingsPlanetBonusesByType = computed<Record<number, Record<string, number>>>(() => {
    const result: Record<number, Record<string, number>> = {};

    Object.entries(props.planets)
        .map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
        .forEach(pair => {
            const [planetId, breakdowns] = pair;
            result[planetId] = {};

            breakdowns.forEach(breakdown => {
                Object.entries(breakdown.bonuses).forEach(pair => {
                    const [key, bonuses] = pair;

                    result[planetId][key] ??= 0;
                    result[planetId][key] += bonuses.buildings;
                });
            });
        });

    return result;
});

const levelPlanetBonusesByType = computed<Record<number, Record<string, number>>>(() => {
    const result: Record<number, Record<string, number>> = {};

    Object.entries(props.planets)
        .map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
        .forEach(pair => {
            const [planetId, breakdowns] = pair;
            result[planetId] = {};

            breakdowns.forEach(breakdown => {
                Object.entries(breakdown.bonuses).forEach(pair => {
                    const [key, bonuses] = pair;

                    result[planetId][key] ??= 0;
                    result[planetId][key] += bonuses.level;
                });
            });
        });

    return result;
});

const planetBugBonusesByType = computed<Record<number, Record<string, number>>>(() => {
    const result: Record<number, Record<string, number>> = {};

    Object.entries(props.planets)
        .map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
        .forEach(pair => {
            const [planetId, breakdowns] = pair;
            result[planetId] = {};

            breakdowns.forEach(breakdown => {
                Object.entries(breakdown.bonuses).forEach(pair => {
                    const [key, bonuses] = pair;

                    result[planetId][key] ??= 0;
                    result[planetId][key] += bonuses.bugBonus ?? 0;
                });
            });
        });

    return result;
});

const totalPlanetBonusesByType = computed<Record<number, Record<string, number>>>(() => {
    const result: Record<number, Record<string, number>> = {};

    Object.entries(props.planets)
        .map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
        .forEach(pair => {
            const [planetId, breakdowns] = pair;
            result[planetId] = {};

            breakdowns.forEach(breakdown => {
                Object.entries(breakdown.bonuses).forEach(pair => {
                    const [key, bonuses] = pair;

                    result[planetId][key] ??= 0;
                    result[planetId][key] += bonuses.total;
                });
            });
        });

    return result;
});

const totalBonus = computed<Record<string, number>>(() => {
    return Object.values(props.planets).reduce<Record<string, number>>((total, cur) => {
        cur.forEach(bonusBreakdown => {
            Object.keys(bonusBreakdown.bonuses).forEach(key => {
                total[key] ??= 0;
                total[key] = props.limits[key](total[key] + bonusBreakdown.bonuses[key].total);
            });
        });
        return total;
    }, {});
});

const empirePlanets = computed(() => {
    return empireStore.empire.planetOrder
        .map(id => empireStore.empire.planets[id])
        .filter(planet => !planet.isMoon) as PlanetData[];
});
</script>

<style lang="scss" scoped>
.lifeform-bonus-breakdown {
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
