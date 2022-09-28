<template>
    <grid-table :items="items" :footerItems="footerItems" :columns="columns" sticky="100%" sticky-footer class="ship-bonuses">
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
                    <span v-text="'Cargo'" :class="{ 'expanded-header': isExpanded }" /><!-- LOCA: -->
                    <span v-text="'Speed'" :class="{ 'expanded-header': isExpanded }" /><!-- LOCA: -->

                    <template v-if="isExpanded">
                        <span />
                        <template v-for="statKey in shipStatsKeys">
                            <span v-for="key in breakdownKeys" v-text="key" :key="key + statKey" /><!-- LOCA: -->
                        </template>
                    </template>
                </div>

                <div v-for="ship in ShipTypes" class="row" :key="ship">
                    <o-ship :ship="ship" size="24px" />
                    <template v-for="statKey in shipStatsKeys">
                        <decimal-number
                            v-for="key in breakdownKeys"
                            :key="key + statKey"
                            :digits="3"
                            :value="item.bonuses[match.groups.id][ship][statKey][key] * 100"
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
                    <span v-text="'Cargo'" /><!-- LOCA: -->
                    <span v-text="'Speed'" /><!-- LOCA: -->
                </div>
                <div v-for="ship in ShipTypes" class="row" :key="ship">
                    <o-ship :ship="ship" size="24px" />
                    <decimal-number
                        v-for="statKey in shipStatsKeys"
                        :key="statKey"
                        :digits="3"
                        :value="value[ship][statKey] * 100"
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
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { StatsBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { ShipTypes } from '@/shared/models/ogame/ships/ShipTypes';
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

    interface ShipStatsBonusBreakdown<T> {
        armor: T;
        shield: T;
        damage: T;
        cargo: T;
        speed: T;
    }

    interface BonusOverviewItem {
        planet: PlanetData;

        bonuses: Partial<Record<LifeformTechnologyType, Record<ShipType, ShipStatsBonusBreakdown<TechnologyBonusBreakdown>>>>;
        totalBonus: Record<ShipType, ShipStatsBonusBreakdown<number>>;
    }

    @Component({})
    export default class ShipStats extends Vue {
        private readonly LifeformTechnologies = StatsBonusLifeformTechnologies
            .filter(tech => ShipTypes.some(ship => tech.appliesTo(ship)))
            .map(x => x.type)
            .sort((a, b) => a - b);
        private readonly ShipTypes = ShipTypes.filter(ship => StatsBonusLifeformTechnologies.some(tech => tech.appliesTo(ship)));

        private readonly idSlotNameRegex = '(?<id>\\d+)';
        private readonly parseIntSafe = parseIntSafe;

        private isExpanded = false;

        private readonly shipStatsKeys: (keyof ShipStatsBonusBreakdown<any>)[] = ['armor', 'shield', 'damage', 'cargo', 'speed'];

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
                    const level = planet.activeLifeformTechnologies.includes(technology.type)
                        ? planet.lifeformTechnologies[technology.type]
                        : 0;

                    bonuses[technology.type] = createRecord<ShipType, ShipStatsBonusBreakdown<TechnologyBonusBreakdown>>(ShipTypes, ship => {
                        const base = technology.getStatsBonus(ship, level);
                        const buildingBoost = { ...base };
                        const levelBoost = { ...base };
                        const total = { ...base };
                        (Object.keys(base) as (keyof ShipStatsBonusBreakdown<any>)[]).forEach(key => {
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
                    totalBonus: createRecord<ShipType, ShipStatsBonusBreakdown<number>>(ShipTypes, ship => {
                        const total = Object.values(bonuses).reduce(
                            (total, cur) => ({
                                armor: total.armor + cur[ship].armor.total,
                                shield: total.shield + cur[ship].shield.total,
                                damage: total.damage + cur[ship].damage.total,
                                cargo: total.cargo + cur[ship].cargo.total,
                                speed: total.speed + cur[ship].speed.total,
                            }),
                            { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 },
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
        grid-template-columns: auto repeat(5, 1fr);
        gap: 4px;
        width: 100%;

        &.expanded {
            grid-template-columns: auto repeat(20, 1fr);

            .expanded-header {
                grid-column: auto / span 4;
                justify-self: center;
            }
        }

        .row {
            display: contents;
        }
    }

    .ship-bonuses::v-deep {
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
</style>