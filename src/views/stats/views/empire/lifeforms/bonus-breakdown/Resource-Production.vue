<template>
    <grid-table :items="items" :footerItems="footerItems" :columns="columns" sticky="100%" sticky-footer>
        <template v-slot:[`header-${idSlotNameRegex}`]="{ match }">
            <o-lifeform-building v-if="LifeformBuildings.includes(parseIntSafe(match.groups.id))" :building="parseIntSafe(match.groups.id)" size="48px" />
            <o-lifeform-technology v-else :technology="parseIntSafe(match.groups.id)" size="48px" />
        </template>

        <template #cell-planet="{ value }">
            <span v-text="value.name" />
            <span v-text="formatCoordinates(value.coordinates)" />
        </template>

        <template v-slot:[`cell-${idSlotNameRegex}`]="{ item, match }">
            <div class="production-breakdown" v-if="LifeformBuildings.includes(parseIntSafe(match.groups.id))">
                <div class="row">
                    <span />
                    <span v-text="'\xa0'" />
                </div>
                <div v-for="resource in resourceKeys" class="row" :key="resource">
                    <o-resource :resource="resource" size="24px" :fade="item.bonuses[match.groups.id][resource] == 0" />
                    <decimal-number :value="item.bonuses[match.groups.id][resource] * 100" suffix="%" :fade-decimals="false" />
                </div>
            </div>
            <div class="production-breakdown production-breakdown-techs" v-else>
                <div class="row">
                    <span />
                    <span v-text="'Base'" /><!-- LOCA: -->
                    <span v-text="'Buildings'" /><!-- LOCA: -->
                    <span v-text="'Level'" /><!-- LOCA: -->
                    <span v-text="'Total'" /><!-- LOCA: -->
                </div>
                <div v-for="resource in resourceKeys" class="row" :key="resource">
                    <o-resource :resource="resource" size="24px" :fade="item.bonuses[match.groups.id].total[resource] == 0" />
                    <decimal-number :value="item.bonuses[match.groups.id].base[resource] * 100" suffix="%" :fade-decimals="false" />
                    <decimal-number :value="item.bonuses[match.groups.id].buildingBoost[resource] * 100" suffix="%" :fade-decimals="false" />
                    <decimal-number :value="item.bonuses[match.groups.id].levelBoost[resource] * 100" suffix="%" :fade-decimals="false" />
                    <decimal-number :value="item.bonuses[match.groups.id].total[resource] * 100" suffix="%" :fade-decimals="false" />
                </div>
            </div>
        </template>

        <template #cell-totalBonus="{ value }">
            <div class="production-breakdown">
                <div class="row">
                    <span />
                    <span v-text="'\xa0'" />
                </div>
                <div v-for="resource in resourceKeys" class="row" :key="resource">
                    <o-resource :resource="resource" size="24px" :fade="value[resource] == 0" />
                    <decimal-number :value="value[resource] * 100" suffix="%" :fade-decimals="false" />
                </div>
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { addCost, Cost, multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformBuildingType } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
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

        bonuses: (
            Partial<Record<LifeformBuildingType, Cost>>
            & Partial<Record<LifeformTechnologyType, TechnologyBonusBreakdown>>
        );
        totalBonus: Cost;
    }

    @Component({})
    export default class ResourceProduction extends Vue {

        private readonly resourceKeys: (keyof Cost)[] = ['metal', 'crystal', 'deuterium', 'energy'];
        private readonly LifeformBuildings = ResourceProductionBonusLifeformBuildings.map(x => x.type);
        private readonly LifeformTechnologies = ResourceProductionBonusLifeformTechnologies.map(x => x.type);

        private readonly idSlotNameRegex = '(?<id>\\d+)';
        private readonly parseIntSafe = parseIntSafe;

        private get columns(): GridTableColumn<keyof BonusOverviewItem | LifeformBuildingType | LifeformTechnologyType>[] {
            return [
                {
                    key: 'planet',
                    label: 'LOCA: Planet',
                },
                ...this.LifeformBuildings.map<GridTableColumn<LifeformBuildingType>>(b => ({
                    key: b,
                })),
                ...this.LifeformTechnologies.map<GridTableColumn<LifeformTechnologyType>>(t => ({
                    key: t,
                })),
                {
                    key: 'totalBonus',
                    label: 'LOCA: total',
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
                const levelBoost = planet.activeLifeform == LifeformType.none
                    ? 0
                    : getLifeformLevelTechnologyBonus(EmpireDataModule.empire.lifeformExperience[planet.activeLifeform]);

                const buildingBoost = getPlanetLifeformTechnologyBoost(planet);

                const bonuses: BonusOverviewItem['bonuses'] = {};
                ResourceProductionBonusLifeformBuildings.forEach(building => {
                    const level = planet.lifeformBuildings[building.type];
                    const bonus = building.getProductionBonus(level);
                    bonuses[building.type] = bonus;
                });
                ResourceProductionBonusLifeformTechnologies.forEach(technology => {
                    const level = planet.lifeformTechnologies[technology.type];
                    const baseBonus = technology.getProductionBonus(level);

                    bonuses[technology.type] = {
                        base: baseBonus,
                        buildingBoost: multiplyCost(baseBonus, buildingBoost),
                        levelBoost: multiplyCost(baseBonus, levelBoost),
                        get total() {
                            return addCost(this.base, this.buildingBoost, this.levelBoost);
                        },
                    };
                });

                return {
                    planet,
                    bonuses,
                    get totalBonus() {
                        return Object.values(this.bonuses).reduce<Cost>(
                            (total, cur) => {
                                if ('total' in cur) {
                                    return addCost(total, cur.total);
                                }
                                return addCost(total, cur)
                            },
                            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        );
                    }
                };
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
    .production-breakdown {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px;
        width: 100%;

        &-techs {
            grid-template-columns: auto repeat(4, 1fr);
        }

        .row {
            display: contents;
        }
    }
</style>