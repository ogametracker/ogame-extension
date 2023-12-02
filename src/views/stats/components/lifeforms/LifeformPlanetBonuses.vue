<template>
    <div class="lifeform-planet-bonuses" :style="`--bonus-types: ${types.length}`">
        <div class="header-row">
            <div class="title">
                <slot v-if="$scopedSlots.header != null" name="header" />
                <span v-else v-text="header" />
            </div>

            <div v-for="type in types" :key="type.key" class="partial-bonus">
                <div class="title" v-text="type.label" />
                <span class="avg-value">
                    <decimal-number :value="averageBonus[type.key] * 100" prefix="⌀ " suffix="%" :digits="3" :fade-decimals="false" style="--small-fraction-size: 0.75em" />
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
                        <template v-if="LifeformBuildingTypesByLifeform[planet.activeLifeform].includes(building) && planet.lifeformBuildings[building] > 0">
                            <div />
                            <div class="tech">
                                <o-lifeform-building :building="building" size="24px" />
                                <span v-text="$i18n.$t.ogame.lifeformBuildings[building] + ` (${planet.lifeformBuildings[building]})`" />
                            </div>
                            <span v-for="type in types" :key="type.key" class="bonus">
                                <decimal-number
                                    :value="planets[planet.id].bonusByBuilding[type.key][building] * 100"
                                    suffix="%"
                                    :digits="3"
                                    :fade-decimals="false"
                                    style="--small-fraction-size: 0.75em"
                                />
                            </span>
                        </template>
                    </div>

                    <div class="tech-row">
                        <div />
                        <div>
                            <router-link :to="{ name: researchBonusBreakdownRouteName }">
                                <span v-text="'LOCA: global research bonus'" />
                                <span class="mdi mdi-open-in-new" />
                            </router-link>
                        </div>
                        <span v-for="type in types" :key="type.key" class="bonus">
                            <decimal-number
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
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { PropType } from 'vue';
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';

    export type LifeformPlanetBonusesType<TKey extends string = string> = {
        key: TKey;
        label: string;
    }

    export type LifeformPlanetBonuses<TKey extends string = string> = {
        planet: PlanetData;
        bonusByBuilding: Record<TKey, Record<LifeformBuildingType, number>>;
    }

    @Component({})
    export default class LifeformBonusesBreakdown extends Vue {

        @Prop({ required: false, type: String, default: () => '' })
        private header!: string;

        @Prop({ required: true, type: Array as PropType<LifeformPlanetBonusesType[]> })
        private types!: LifeformPlanetBonusesType[];

        @Prop({ required: true, type: Object as PropType<Record<string, number>> })
        private technologyBonuses!: Record<string, number>;

        @Prop({ required: true, type: Object as PropType<Record<number, LifeformPlanetBonuses>> })
        private planets!: Record<number, LifeformPlanetBonuses>;

        @Prop({ required: true, type: Array as PropType<LifeformBuildingType[]> })
        private buildings!: LifeformBuildingType[];

        @Prop({ required: true, type: Object as PropType<Record<string, (value: number) => number>> })
        private limits!: Record<string, (value: number) => number>;

        @Prop({ required: true, type: String })
        private researchBonusBreakdownRouteName!: string;

        private get buildingsSorted(): LifeformBuildingType[] {
            return [...this.buildings].sort((a, b) => a - b);
        }

        private readonly LifeformBuildingTypesByLifeform = LifeformBuildingTypesByLifeform;

        private readonly expandedPlanets: Partial<Record<number, boolean>> = {};

        private togglePlanet(id: number) {
            Vue.set(this.expandedPlanets, id, !(this.expandedPlanets[id] ?? false));
        }

        private formatCoordinates(coords: Coordinates) {
            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }

        private getTotalPlanetBonus(planet: LifeformPlanetBonuses, type: string): number {
            return Object.values(planet.bonusByBuilding[type]).reduce((total, cur) => total + cur, 0)
                + this.technologyBonuses[type];
        }

        private get averageBonus(): Record<string, number> {
            const result: Record<string, number> = {};

            this.types.forEach(type => {
                const total = Object.values(this.planets)
                    .map(planet => this.getTotalPlanetBonus(planet, type.key))
                    .reduce((total, cur) => total + cur, 0);
                
                result[type.key] = total / this.empirePlanets.length;
            });

            return result;
        }

        private get empirePlanets() {
            return EmpireDataModule.empire.planetOrder
                .map(id => EmpireDataModule.empire.planets[id])
                .filter(planet => !planet.isMoon) as PlanetData[]
        }
    }
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