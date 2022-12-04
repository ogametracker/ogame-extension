<template>

    <grid-table
        :items="items"
        :footerItems="footerItems"
        :columns="columns"
        sticky="100%"
        class="defense-bonuses"
        :class="{ 'detailed-view': showDetailed }"
    >
        <template v-slot:[`header-${idSlotNameRegex}`]="{ match }">
            <o-lifeform-technology :technology="parseIntSafe(match.groups.id)" size="48px" />
        </template>

        <template #header-planet>
            <button v-text="'+/-'" @click="showDetailed = !showDetailed" />
        </template>

        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            <span v-text="formatCoordinates(value.coordinates)" />
        </template>

        <template v-slot:[`(cell|footer)-(${idSlotNameRegex}|totalBonus)`]="{ value, item, match }">
            <div class="stats-breakdown">
                <div class="row">
                    <span />
                    <span v-text="'Armor'" class="detailed-header" /><!-- LOCA: -->
                    <span v-text="'Shield'" class="detailed-header" /><!-- LOCA: -->
                    <span v-text="'Damage'" class="detailed-header" /><!-- LOCA: -->

                    <span class="show-detailed" />
                    <template v-for="statKey in statsKeys">
                        <span
                            v-for="key in breakdownKeysNoTotal"
                            v-text="key"
                            :key="key + statKey"
                            class="show-detailed"
                        /><!-- LOCA: -->
                    </template>
                </div>

                <div v-for="defense in DefenseTypes" class="row" :key="defense">
                    <o-defense
                        :defense="defense"
                        size="24px"
                        :fade="statsKeys.every((statKey) => (item.bonuses[match.groups.id] || value)[defense][statKey].total == 0)"
                    />
                    <template v-for="statKey in statsKeys">
                        <decimal-number
                            v-for="key in breakdownKeys"
                            :key="key + statKey"
                            :class="key != 'total' ? 'show-detailed' : 'show-not-detailed'"
                            :digits="3"
                            :value="(item.bonuses[match.groups.id] || value)[defense][statKey][key] * 100"
                            suffix="%"
                            :fade-decimals="false"
                        />
                    </template>
                </div>
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { DefenseType } from '@/shared/models/ogame/defenses/DefenseType';
    import { DefenseTypes } from '@/shared/models/ogame/defenses/DefenseTypes';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { StatsBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createRecord } from '@/shared/utils/createRecord';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface TechnologyBonusBreakdown {
        base: number;
        buildingBoost: number;
        levelBoost: number;
        total: number;
    }

    interface DefenseStatsBonusBreakdown {
        armor: TechnologyBonusBreakdown;
        shield: TechnologyBonusBreakdown;
        damage: TechnologyBonusBreakdown;
    }

    interface BonusOverviewItem {
        planet: PlanetData;

        bonuses: Partial<Record<LifeformTechnologyType, Record<DefenseType, DefenseStatsBonusBreakdown>>>;
        totalBonus: Record<DefenseType, DefenseStatsBonusBreakdown>;
    }

    @Component({})
    export default class DefenseStats extends Vue {
        private readonly DefenseTypes = DefenseTypes;
        private readonly LifeformTechnologies = StatsBonusLifeformTechnologies
            .filter(tech => DefenseTypes.some(def => tech.appliesTo(def)))
            .map(x => x.type)
            .sort((a, b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]);

        private readonly idSlotNameRegex = '(?<id>\\d+)';
        private readonly parseIntSafe = parseIntSafe;

        private showDetailed = false;

        private readonly statsKeys: (keyof DefenseStatsBonusBreakdown)[] = ['armor', 'shield', 'damage'];
        private readonly breakdownKeys: (keyof TechnologyBonusBreakdown)[] = ['base', 'buildingBoost', 'levelBoost', 'total']
        private readonly breakdownKeysNoTotal: (keyof TechnologyBonusBreakdown)[] = ['base', 'buildingBoost', 'levelBoost']

        private get columns(): GridTableColumn<keyof BonusOverviewItem | LifeformTechnologyType>[] {
            return [
                {
                    key: 'planet',
                    label: 'LOCA: Planet',
                },
                ...this.LifeformTechnologies.map<GridTableColumn<LifeformTechnologyType>>(t => ({
                    key: t,
                })),
                {
                    key: 'totalBonus',
                    label: 'LOCA: total',
                    class: 'total-cell',
                },
            ];
        }

        private get planets(): PlanetData[] {
            return EmpireDataModule.empire.planetOrder
                .map(id => EmpireDataModule.empire.planets[id])
                .filter(p => !p.isMoon) as PlanetData[];
        }
        
        private get items(): BonusOverviewItem[] {
            return this.planets.map<BonusOverviewItem>(planet => {
                const levelBoostFactor = planet.activeLifeform == LifeformType.none
                    ? 0
                    : getLifeformLevelTechnologyBonus(EmpireDataModule.lifeformExperience[planet.activeLifeform]);

                const buildingBoostFactor = getPlanetLifeformTechnologyBoost(planet);

                const bonuses: BonusOverviewItem['bonuses'] = {};
                StatsBonusLifeformTechnologies.forEach(technology => {
                    const level = planet.activeLifeformTechnologies.includes(technology.type)
                        ? planet.lifeformTechnologies[technology.type]
                        : 0;

                    bonuses[technology.type] = createRecord<DefenseType, DefenseStatsBonusBreakdown>(DefenseTypes, defense => {
                        const base = technology.getStatsBonus(defense, level);
                        const buildingBoost = { ...base };
                        const levelBoost = { ...base };
                        const total = { ...base };
                        (Object.keys(base) as (keyof DefenseStatsBonusBreakdown)[]).forEach(key => {
                            buildingBoost[key] *= buildingBoostFactor;
                            levelBoost[key] *= levelBoostFactor;

                            total[key] += buildingBoost[key] + levelBoost[key];
                        });

                        return {
                            armor: {
                                base: base.armor,
                                buildingBoost: buildingBoost.armor,
                                levelBoost: levelBoost.armor,
                                total: total.armor,
                            },
                            shield: {
                                base: base.shield,
                                buildingBoost: buildingBoost.shield,
                                levelBoost: levelBoost.shield,
                                total: total.shield,
                            },
                            damage: {
                                base: base.damage,
                                buildingBoost: buildingBoost.damage,
                                levelBoost: levelBoost.damage,
                                total: total.damage,
                            },
                            cargo: {
                                base: base.cargo,
                                buildingBoost: buildingBoost.cargo,
                                levelBoost: levelBoost.cargo,
                                total: total.cargo,
                            },
                            speed: {
                                base: base.speed,
                                buildingBoost: buildingBoost.speed,
                                levelBoost: levelBoost.speed,
                                total: total.speed,
                            },
                        };
                    });
                });

                const result: BonusOverviewItem = {
                    planet,
                    bonuses,
                    totalBonus: createRecord<DefenseType, DefenseStatsBonusBreakdown>(
                        DefenseTypes,
                        defense => createRecord(
                            this.statsKeys,
                            statKey => Object.values(bonuses).reduce<TechnologyBonusBreakdown>(
                                (total, cur) => ({
                                    base: total.base + cur[defense][statKey].base,
                                    buildingBoost: total.buildingBoost + cur[defense][statKey].buildingBoost,
                                    levelBoost: total.levelBoost + cur[defense][statKey].levelBoost,
                                    total: total.total + cur[defense][statKey].total,
                                }),
                                { base: 0, buildingBoost: 0, levelBoost: 0, total: 0 },
                            )
                        )
                    ),
                };
                return result;
            });
        }

        private get footerItems(): [BonusOverviewItem] {
            const items = this.items;

            const bonuses: BonusOverviewItem['bonuses'] = {};
            StatsBonusLifeformTechnologies.forEach(technology => {

                bonuses[technology.type] = createRecord(
                    DefenseTypes,
                    defense => createRecord(
                        this.statsKeys,
                        statKey => items
                            .map(item => item.bonuses[technology.type]![defense][statKey])
                            .reduce<TechnologyBonusBreakdown>(
                                (total, cur) => ({
                                    base: total.base + cur.base,
                                    buildingBoost: total.buildingBoost + cur.buildingBoost,
                                    levelBoost: total.levelBoost + cur.levelBoost,
                                    total: total.total + cur.total,
                                }),
                                { base: 0, buildingBoost: 0, levelBoost: 0, total: 0 },
                            )
                    ),
                );
            });

            const totalBonus: Record<DefenseType, DefenseStatsBonusBreakdown> = createRecord(
                DefenseTypes,
                defense => createRecord(
                    this.statsKeys,
                    statKey => Object.values(bonuses)
                        .map(b => b[defense][statKey])
                        .reduce<TechnologyBonusBreakdown>(
                            (total, cur) => ({
                                base: total.base + cur.base,
                                buildingBoost: total.buildingBoost + cur.buildingBoost,
                                levelBoost: total.levelBoost + cur.levelBoost,
                                total: total.total + cur.total,
                            }),
                            { base: 0, buildingBoost: 0, levelBoost: 0, total: 0 },
                        ),
                ),
            );

            return [{
                planet: null!,
                bonuses,
                totalBonus,
            }];
        }

        private formatCoordinates(coords: Coordinates) {
            return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
        }
    }
</script>
<style lang="scss" scoped>
    .stats-breakdown {
        display: grid;
        grid-template-columns: auto repeat(3, 1fr);
        gap: 4px;
        width: 100%;

        .row {
            display: contents;
        }
    }


    .defense-bonuses {
        &.detailed-view::v-deep {
            .stats-breakdown {
                grid-template-columns: auto repeat(9, 1fr);

                .detailed-header {
                    grid-column: auto / span 3;
                    justify-self: center;
                }
            }

            .show-not-detailed {
                display: none;
            }
        }

        &:not(.detailed-view)::v-deep {
            .show-detailed {
                display: none;
            }
        }

        &::v-deep {
            .grid-table-body,
            .grid-table-foot {
                .grid-table-cell {
                    border-left: 1px solid rgba(var(--color), 0.3);

                    &.total-cell {
                        border-left: 3px double rgba(var(--color), 0.7);
                    }
                }
            }
        }
    }
</style>