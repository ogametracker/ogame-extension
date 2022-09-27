<template>
    <grid-table :items="items" :footerItems="footerItems" :columns="columns" sticky="100%" sticky-footer class="defense-bonuses">
        <template v-slot:[`header-${idSlotNameRegex}`]="{ match }">
            <o-lifeform-technology :technology="parseIntSafe(match.groups.id)" size="48px" />
        </template>

        <template #header-planet>
            <button v-text="'+/-'" @click="isExpanded = !isExpanded" />
        </template>

        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            <span v-text="formatCoordinates(value.coordinates)" />
        </template>

        <template v-slot:[`cell-${idSlotNameRegex}`]="{ item, match }">
            <div class="stats-breakdown stats-breakdown" :class="{ expanded: isExpanded }">
                <div class="row">
                    <span />
                    <span v-text="'Armor'" :class="{ 'expanded-header': isExpanded }" /><!-- LOCA: -->
                    <span v-text="'Shield'" :class="{ 'expanded-header': isExpanded }" /><!-- LOCA: -->
                    <span v-text="'Damage'" :class="{ 'expanded-header': isExpanded }" /><!-- LOCA: -->

                    <template v-if="isExpanded">
                        <span />
                        <template v-for="statKey in statsKeys">
                            <span v-for="key in breakdownKeys" v-text="key" :key="key + statKey" /><!-- LOCA: -->
                        </template>
                    </template>
                </div>

                <div v-for="defense in DefenseTypes" class="row" :key="defense">
                    <o-defense :defense="defense" size="24px" />
                    <template v-for="statKey in statsKeys">
                        <decimal-number
                            v-for="key in breakdownKeys"
                            :key="key + statKey"
                            :digits="3"
                            :value="item.bonuses[match.groups.id][defense][statKey][key] * 100"
                            suffix="%"
                            :fade-decimals="false"
                        />
                    </template>
                </div>
            </div>
        </template>

        <template #cell-totalBonus="{ value }">
            <div class="stats-breakdown">
                <div class="row">
                    <span />
                    <span v-text="'Armor'" /><!-- LOCA: -->
                    <span v-text="'Shield'" /><!-- LOCA: -->
                    <span v-text="'Damage'" /><!-- LOCA: -->
                </div>
                <div v-for="defense in DefenseTypes" class="row" :key="defense">
                    <o-defense :defense="defense" size="24px" />
                    <decimal-number
                        v-for="statKey in statsKeys"
                        :key="statKey"
                        :digits="3"
                        :value="value[defense][statKey] * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
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
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
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

    interface DefenseStatsBonusBreakdown<T> {
        armor: T;
        shield: T;
        damage: T;
    }

    interface BonusOverviewItem {
        planet: PlanetData;

        bonuses: Partial<Record<LifeformTechnologyType, Record<DefenseType, DefenseStatsBonusBreakdown<TechnologyBonusBreakdown>>>>;
        totalBonus: Record<DefenseType, DefenseStatsBonusBreakdown<number>>;
    }

    @Component({})
    export default class DefenseStats extends Vue {
        private readonly DefenseTypes = DefenseTypes;
        private readonly LifeformTechnologies = StatsBonusLifeformTechnologies
            .filter(tech => DefenseTypes.some(def => tech.appliesTo(def)))
            .map(x => x.type)
            .sort((a, b) => a - b);

        private readonly idSlotNameRegex = '(?<id>\\d+)';
        private readonly parseIntSafe = parseIntSafe;

        private isExpanded = false;

        private readonly statsKeys: (keyof DefenseStatsBonusBreakdown<any>)[] = ['armor', 'shield', 'damage'];

        private get breakdownKeys(): (keyof TechnologyBonusBreakdown)[] {
            if (!this.isExpanded) {
                return ['total'];
            }

            return ['base', 'buildingBoost', 'levelBoost', 'total'];
        }

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
                    : getLifeformLevelTechnologyBonus(EmpireDataModule.empire.lifeformExperience[planet.activeLifeform]);

                const buildingBoostFactor = getPlanetLifeformTechnologyBoost(planet);

                const bonuses: BonusOverviewItem['bonuses'] = {};
                StatsBonusLifeformTechnologies.forEach(technology => {
                    const level = planet.lifeformTechnologies[technology.type];

                    bonuses[technology.type] = createRecord<DefenseType, DefenseStatsBonusBreakdown<TechnologyBonusBreakdown>>(DefenseTypes, defense => {
                        const base = technology.getStatsBonus(defense, level);
                        const buildingBoost = { ...base };
                        const levelBoost = { ...base };
                        const total = { ...base };
                        (Object.keys(base) as (keyof DefenseStatsBonusBreakdown<any>)[]).forEach(key => {
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
                        };
                    });
                });

                const result: BonusOverviewItem = {
                    planet,
                    bonuses,
                    totalBonus: createRecord<DefenseType, DefenseStatsBonusBreakdown<number>>(DefenseTypes, defense => {
                        const total = Object.values(bonuses).reduce(
                            (total, cur) => ({
                                armor: total.armor + cur[defense].armor.total,
                                shield: total.shield + cur[defense].shield.total,
                                damage: total.damage + cur[defense].damage.total,
                            }),
                            { armor: 0, shield: 0, damage: 0 },
                        );
                        return total;
                    }),
                };
                return result;
            });
        }

        private get footerItems(): [BonusOverviewItem] {
            return [{
                planet: null!,
                bonuses: {},
                totalBonus: null!,
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

        &.expanded {
            grid-template-columns: auto repeat(12, 1fr);

            .expanded-header {
                grid-column: auto / span 4;
                justify-self: center;
            }
        }

        .row {
            display: contents;
        }
    }

    .defense-bonuses::v-deep {
        .grid-table-cell {
            border-left: 1px solid rgba(var(--color), 0.3);

            &.total-cell {
                border-left: 3px double rgba(var(--color), 0.7);
            }
        }
    }
</style>