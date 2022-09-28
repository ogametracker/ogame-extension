<template>
    <grid-table
        :items="items"
        :footerItems="footerItems"
        :columns="columns"
        sticky="100%"
        sticky-footer
        class="resource-production-bonuses"
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
            <div class="production-breakdown">
                <div class="row">
                    <span />
                    <span class="show-detailed" v-text="'Base'" /><!-- LOCA: -->
                    <span class="show-detailed" v-text="'Buildings'" /><!-- LOCA: -->
                    <span class="show-detailed" v-text="'Level'" /><!-- LOCA: -->
                    <span class="show-detailed" v-text="'Total'" /><!-- LOCA: -->
                    <span class="show-not-detailed" />
                </div>
                <div v-for="resource in resourceKeys" class="row" :key="resource">
                    <o-resource :resource="resource" size="24px" :fade="(item.bonuses[match.groups.id] || value).total[resource] == 0" />
                    <decimal-number
                        class="show-detailed"
                        :value="(item.bonuses[match.groups.id] || value).base[resource] * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
                    <decimal-number
                        class="show-detailed"
                        :digits="3"
                        :value="(item.bonuses[match.groups.id] || value).buildingBoost[resource] * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
                    <decimal-number
                        class="show-detailed"
                        :digits="3"
                        :value="(item.bonuses[match.groups.id] || value).levelBoost[resource] * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
                    <decimal-number :digits="3" :value="(item.bonuses[match.groups.id] || value).total[resource] * 100" suffix="%" :fade-decimals="false" />
                </div>
            </div>
        </template>

        <!-- <template v-slot:[`(cell|footer)-totalBonus`]="{ value }">
            <div class="production-breakdown">
                <div class="row">
                    <span />
                    <span class="show-detailed" v-text="'\xa0'" />
                    <span class="show-not-detailed" />
                </div>
                <div v-for="resource in resourceKeys" class="row" :key="resource">
                    <o-resource :resource="resource" size="24px" :fade="value[resource] == 0" />
                    <decimal-number :digits="3" :value="value[resource] * 100" suffix="%" :fade-decimals="false" />
                </div>
            </div>
        </template> -->
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { addCost, Cost, multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformBuildingType } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ResourceProductionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface TechnologyBonusBreakdown {
        base: Cost;
        buildingBoost: Cost;
        levelBoost: Cost;
        total: Cost;
    }

    interface BonusOverviewItem {
        planet: PlanetData;

        bonuses: Partial<Record<LifeformTechnologyType, TechnologyBonusBreakdown>>;
        totalBonus: TechnologyBonusBreakdown;
    }

    @Component({})
    export default class ResourceProduction extends Vue {

        private readonly resourceKeys: (keyof Cost)[] = ['metal', 'crystal', 'deuterium', 'energy'];
        private readonly LifeformTechnologies = ResourceProductionBonusLifeformTechnologies
            .map(x => x.type)
            .sort((a, b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]);

        private readonly idSlotNameRegex = '(?<id>\\d+)';
        private readonly parseIntSafe = parseIntSafe;
        private showDetailed = false;

        private get columns(): GridTableColumn<keyof BonusOverviewItem | LifeformBuildingType | LifeformTechnologyType>[] {
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
                    footerClass: 'total-cell',
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
                ResourceProductionBonusLifeformTechnologies.forEach(technology => {
                    const level = planet.activeLifeformTechnologies.includes(technology.type)
                        ? planet.lifeformTechnologies[technology.type]
                        : 0;
                    const baseBonus = technology.getProductionBonus(level);
                    const buildingBoost = multiplyCost(baseBonus, buildingBoostFactor);
                    const levelBoost = multiplyCost(baseBonus, levelBoostFactor);

                    bonuses[technology.type] = {
                        base: baseBonus,
                        buildingBoost,
                        levelBoost,
                        total: addCost(baseBonus, buildingBoost, levelBoost),
                    };
                });

                const result: BonusOverviewItem = {
                    planet,
                    bonuses,
                    totalBonus: {
                        base: addCost(...Object.values(bonuses).map(b => b.base)),
                        buildingBoost: addCost(...Object.values(bonuses).map(b => b.buildingBoost)),
                        levelBoost: addCost(...Object.values(bonuses).map(b => b.levelBoost)),
                        total: addCost(...Object.values(bonuses).map(b => b.total)),
                    },
                };
                return result;
            });
        }

        private get footerItems(): [BonusOverviewItem] {
            const items = this.items;

            const bonuses: BonusOverviewItem['bonuses'] = {};
            ResourceProductionBonusLifeformTechnologies.forEach(technology => {
                const baseBonus = addCost(
                    ...items.map(item => item.bonuses[technology.type]!.base),
                );
                const buildingBoost = addCost(
                    ...items.map(item => item.bonuses[technology.type]!.buildingBoost),
                );
                const levelBoost = addCost(
                    ...items.map(item => item.bonuses[technology.type]!.levelBoost),
                );

                bonuses[technology.type] = {
                    base: baseBonus,
                    buildingBoost,
                    levelBoost,
                    total: addCost(baseBonus, buildingBoost, levelBoost),
                };
            });

            const totalBonus = {
                base: addCost(...Object.values(bonuses).map(b => b.base)),
                buildingBoost: addCost(...Object.values(bonuses).map(b => b.buildingBoost)),
                levelBoost: addCost(...Object.values(bonuses).map(b => b.levelBoost)),
                total: addCost(...Object.values(bonuses).map(b => b.total)),
            };

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
    .production-breakdown {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px;
        width: 100%;

        .row {
            display: contents;
        }
    }

    .resource-production-bonuses {
        &.detailed-view::v-deep {
            .production-breakdown {
                grid-template-columns: auto repeat(4, 1fr);
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