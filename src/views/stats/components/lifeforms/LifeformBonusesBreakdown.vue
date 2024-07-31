<template>
    <div class="lifeform-bonus-breakdown" :style="`--bonus-types: ${types.length}`">
        <div class="header-row">
            <div class="title">
                <slot v-if="$scopedSlots.header != null" name="header" />
                <span v-else v-text="header" />
            </div>

            <div v-for="type in types" :key="type.key" class="partial-bonus">
                <div class="title" v-text="type.label" />
                <span class="total-value">
                    <decimal-number :value="totalBonus[type.key] * 100" suffix="%" :digits="3" :fade-decimals="false" style="--small-fraction-size: 0.75em" />
                    <span 
                        v-if="
                            limits[type.key](Number.MAX_SAFE_INTEGER) == totalBonus[type.key]
                            || limits[type.key](Number.MIN_SAFE_INTEGER) == totalBonus[type.key]
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
                        <decimal-number
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
                        <div class="slot" v-text="$i18n.$t.extension.empire.lifeforms.researchBonuses.breakdown.slot" />
                        <div class="tech" v-text="$i18n.$t.extension.empire.lifeforms.researchBonuses.breakdown.research" />
                        <div v-for="type in types" :key="type.key" class="bonus" v-text="$i18n.$t.extension.empire.lifeforms.researchBonuses.breakdown.bonus" />
                    </div>

                    <div v-for="tech in technologiesSorted" :key="tech" class="tech-row">
                        <template v-if="planet.activeLifeformTechnologies.includes(tech) && planet.lifeformTechnologies[tech] > 0">
                            <div class="slot" v-text="LifeformTechnologySlots[tech]" />
                            <div class="tech">
                                <o-lifeform-technology :technology="tech" size="24px" />
                                <span v-text="$i18n.$t.ogame.lifeformTechnologies[tech] + ` (${planet.lifeformTechnologies[tech]})`" />
                            </div>
                            <span v-for="type in types" :key="type.key" class="bonus">
                                <decimal-number
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
                                $i18n.$t.extension.empire.lifeforms.researchBonuses.breakdown.lifeformBuildingsBoost(
                                    $i18n.$n(getPlanetLifeformTechnologyBoost(planet) * 100, smallPercentageFormat) + '%'
                                )
                            "
                        />
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <decimal-number
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
                                $i18n.$t.extension.empire.lifeforms.researchBonuses.breakdown.lifeformLevelBoost(
                                    $i18n.$t.ogame.lifeforms[planet.activeLifeform],
                                    $i18n.$n(getLifeformLevelTechnologyBonus(experience[planet.activeLifeform]) * 100, smallPercentageFormat) + '%'
                                )
                            "
                        />
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <decimal-number
                                :value="levelPlanetBonusesByType[planet.id][type.key] * 100"
                                suffix="%"
                                :digits="3"
                                :fade-decimals="false"
                                style="--small-fraction-size: 0.75em"
                            />
                        </span>
                    </div>

                    <div class="tech-row boosts" v-if="Object.values(planetBugBonusesByType[planet.id]).some(val => val != 0)">
                        <div />
                        <div
                            v-text="$i18n.$t.extension.empire.lifeforms.researchBonuses.breakdown.bugBoost"
                        />
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <decimal-number
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
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { getLifeformLevel, getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { ValidLifeformType, ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/lifeforms';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';

    export type LifeformBonusesBreakdownType<TKey extends string = string> = {
        key: TKey;
        label: string;
    }

    export type LifeformBonusesPlanetBreakdown<TKey extends string = string> = {
        planet: PlanetData;
        technologyType: LifeformTechnologyType;
        bonuses: Record<TKey, {
            base: number;
            buildings: number;
            level: number;
            total: number;

            bugBonus?: number;
        }>;
    }

    @Component({})
    export default class LifeformBonusesBreakdown extends Vue {

        @Prop({ required: false, type: String, default: () => '' })
        private header!: string;

        @Prop({ required: true, type: Array as PropType<LifeformBonusesBreakdownType[]> })
        private types!: LifeformBonusesBreakdownType[];

        @Prop({ required: true, type: Object as PropType<Record<number, LifeformBonusesPlanetBreakdown[]>> })
        private planets!: Record<number, LifeformBonusesPlanetBreakdown[]>;

        @Prop({ required: true, type: Array as PropType<LifeformTechnologyType[]> })
        private technologies!: LifeformTechnologyType[];

        @Prop({ required: true, type: Object as PropType<Record<string, (value: number) => number>> })
        private limits!: Record<string, (value: number) => number>;

        private get technologiesSorted(): LifeformTechnologyType[] {
            return [...this.technologies].sort((a, b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]);
        }

        private readonly smallPercentageFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        };

        private readonly getLifeformLevelTechnologyBonus = getLifeformLevelTechnologyBonus;
        private readonly getPlanetLifeformTechnologyBoost = getPlanetLifeformTechnologyBoost;

        private readonly expandedPlanets: Partial<Record<number, boolean>> = {};

        private togglePlanet(id: number) {
            Vue.set(this.expandedPlanets, id, !(this.expandedPlanets[id] ?? false));
        }

        private formatCoordinates(coords: Coordinates) {
            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }

        private readonly LifeformTechnologySlots = LifeformTechnologySlots;

        private get experience() {
            return EmpireDataModule.lifeformExperience;
        }

        private get levels(): Record<ValidLifeformType, number> {
            return createRecord(ValidLifeformTypes, type => getLifeformLevel(this.experience[type]));
        }

        private get totalPlanetBonusesByTechnologyType(): Record<number, Record<LifeformTechnologyType, Record<string, LifeformBonusesPlanetBreakdown['bonuses'][string]>>> {
            const result: Record<number, Record<LifeformTechnologyType, Record<string, LifeformBonusesPlanetBreakdown['bonuses'][string]>>> = {};

            Object.entries(this.planets).map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
                .forEach(pair => {
                    const [planetId, breakdowns] = pair;
                    result[planetId] = {} as Record<LifeformTechnologyType, Record<string, LifeformBonusesPlanetBreakdown['bonuses'][string]>>;

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
                    })
                });

            return result;
        }

        private get buildingsPlanetBonusesByType(): Record<number, Record<string, number>> {
            const result: Record<number, Record<string, number>> = {};

            Object.entries(this.planets).map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
                .forEach(pair => {
                    const [planetId, breakdowns] = pair;
                    result[planetId] = {};

                    breakdowns.forEach(breakdown => {
                        Object.entries(breakdown.bonuses).forEach(pair => {
                            const [key, bonuses] = pair;

                            result[planetId][key] ??= 0;
                            result[planetId][key] += bonuses.buildings;
                        });
                    })
                });

            return result;
        }

        private get levelPlanetBonusesByType(): Record<number, Record<string, number>> {
            const result: Record<number, Record<string, number>> = {};

            Object.entries(this.planets).map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
                .forEach(pair => {
                    const [planetId, breakdowns] = pair;
                    result[planetId] = {};

                    breakdowns.forEach(breakdown => {
                        Object.entries(breakdown.bonuses).forEach(pair => {
                            const [key, bonuses] = pair;

                            result[planetId][key] ??= 0;
                            result[planetId][key] += bonuses.level;
                        });
                    })
                });

            return result;
        }

        private get planetBugBonusesByType(): Record<number, Record<string, number>> {
            const result: Record<number, Record<string, number>> = {};

            Object.entries(this.planets).map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
                .forEach(pair => {
                    const [planetId, breakdowns] = pair;
                    result[planetId] = {};

                    breakdowns.forEach(breakdown => {
                        Object.entries(breakdown.bonuses).forEach(pair => {
                            const [key, bonuses] = pair;

                            result[planetId][key] ??= 0;
                            result[planetId][key] += bonuses.bugBonus ?? 0;
                        });
                    })
                });

            return result;
        }

        private get totalPlanetBonusesByType(): Record<number, Record<string, number>> {
            const result: Record<number, Record<string, number>> = {};

            Object.entries(this.planets).map(entry => [parseIntSafe(entry[0]), entry[1]] as const)
                .forEach(pair => {
                    const [planetId, breakdowns] = pair;
                    result[planetId] = {};

                    breakdowns.forEach(breakdown => {
                        Object.entries(breakdown.bonuses).forEach(pair => {
                            const [key, bonuses] = pair;

                            result[planetId][key] ??= 0;
                            result[planetId][key] += bonuses.total;
                        });
                    })
                });

            return result;
        }

        private get totalBonus(): Record<string, number> {
            return Object.values(this.planets)
                .reduce<Record<string, number>>((total, cur) => {
                    cur.forEach(bonusBreakdown => {
                        Object.keys(bonusBreakdown.bonuses).forEach(key => {
                            total[key] ??= 0;
                            total[key] = this.limits[key](total[key] + bonusBreakdown.bonuses[key].total);
                        });
                    });
                    return total;
                }, {});
        }

        private get empirePlanets() {
            return EmpireDataModule.empire.planetOrder
                .map(id => EmpireDataModule.empire.planets[id])
                .filter(planet => !planet.isMoon) as PlanetData[]
        }
    }
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