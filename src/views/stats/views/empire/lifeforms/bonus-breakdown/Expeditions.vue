<template>
    <grid-table :items="items" :columns="columns" sticky="100%" class="expedition-bonuses" :class="{ 'detailed-view': showDetailed }">
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
            <div class="bonus-breakdown">
                <div class="row">
                    <span />
                    <span class="show-detailed" v-text="'Base'" /><!-- LOCA: -->
                    <span class="show-detailed" v-text="'Buildings'" /><!-- LOCA: -->
                    <span class="show-detailed" v-text="'Level'" /><!-- LOCA: -->
                    <span class="show-not-detailed" />
                </div>
                <div v-for="expeditionType in expeditionTypes" class="row" :key="expeditionType">
                    <expedition-event-type-icon :type="expeditionType" />

                    <decimal-number
                        class="show-detailed"
                        :value="(item.bonuses[match.groups.id] || value)[expeditionType].base * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
                    <decimal-number
                        class="show-detailed"
                        :digits="3"
                        :value="(item.bonuses[match.groups.id] || value)[expeditionType].buildingBoost * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
                    <decimal-number
                        class="show-detailed"
                        :digits="3"
                        :value="(item.bonuses[match.groups.id] || value)[expeditionType].levelBoost * 100"
                        suffix="%"
                        :fade-decimals="false"
                    />
                    <decimal-number
                        class="show-not-detailed"
                        :digits="3"
                        :value="(item.bonuses[match.groups.id] || value)[expeditionType].total * 100"
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
    import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologySlots, LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ExpeditionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createRecord } from '@/shared/utils/createRecord';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ExpeditionEventTypeIcon from '@stats/components/expeditions/ExpeditionEventTypeIcon.vue';

    interface TechnologyBonusBreakdown {
        base: number;
        buildingBoost: number;
        levelBoost: number;
        total: number;
    }

    interface BonusOverviewItem {
        planet: PlanetData;

        bonuses: Partial<Record<LifeformTechnologyType, Record<ExpeditionEventType, TechnologyBonusBreakdown>>>;
        totalBonus: Record<ExpeditionEventType, TechnologyBonusBreakdown>;
    }

    @Component({
        components: {
            ExpeditionEventTypeIcon,
        },
    })
    export default class Expeditions extends Vue {

        private readonly ExpeditionType = ExpeditionEventType;
        private readonly LifeformTechnologies = ExpeditionBonusLifeformTechnologies
            .map(x => x.type)
            .sort((a, b) => LifeformTechnologySlots[a] - LifeformTechnologySlots[b]);

        private readonly expeditionTypes = ExpeditionEventTypes.filter(type =>
            ExpeditionBonusLifeformTechnologies.some(tech => tech.appliesTo(type))
        );

        private readonly idSlotNameRegex = '(?<id>\\d+)';
        private readonly parseIntSafe = parseIntSafe;
        private showDetailed = false;

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
                    : getLifeformLevelTechnologyBonus(EmpireDataModule.lifeformExperience[planet.activeLifeform]);

                const buildingBoostFactor = getPlanetLifeformTechnologyBoost(planet);

                const bonuses: BonusOverviewItem['bonuses'] = {};
                ExpeditionBonusLifeformTechnologies.forEach(technology => {
                    const level = planet.activeLifeformTechnologies.includes(technology.type)
                        ? planet.lifeformTechnologies[technology.type]
                        : 0;

                    const bonusByTypes: Record<ExpeditionEventType, TechnologyBonusBreakdown> = createRecord(ExpeditionEventTypes, type => {
                        const baseBonus = technology.getExpeditionBonus(type, level);
                        const buildingBoost = baseBonus * buildingBoostFactor;
                        const levelBoost = baseBonus * levelBoostFactor;

                        return {
                            base: baseBonus,
                            buildingBoost,
                            levelBoost,
                            total: baseBonus + buildingBoost + levelBoost,
                        };
                    });

                    bonuses[technology.type] = bonusByTypes;
                });

                const totalBonus: Record<ExpeditionEventType, TechnologyBonusBreakdown> = createRecord(ExpeditionEventTypes, type => {
                    const values = Object.values(bonuses).map(x => x[type]);

                    return values.reduce<TechnologyBonusBreakdown>((total, cur) => {
                        return {
                            base: total.base + cur.base,
                            buildingBoost: total.buildingBoost + cur.buildingBoost,
                            levelBoost: total.levelBoost + cur.levelBoost,
                            total: total.total + cur.total,
                        };
                    }, { base: 0, buildingBoost: 0, levelBoost: 0, total: 0 });
                });

                const result: BonusOverviewItem = {
                    planet,
                    bonuses,
                    totalBonus,
                };
                return result;
            });
        }

        private get footerItems(): [BonusOverviewItem] {
            const items = this.items;

            const bonuses: BonusOverviewItem['bonuses'] = {};

            const totalBonus: Record<ExpeditionEventType, TechnologyBonusBreakdown> = createRecord(
                ExpeditionEventTypes,
                type => {
                    const values = Object.values(bonuses).map(x => x[type]);

                    return values.reduce<TechnologyBonusBreakdown>((total, cur) => {
                        return {
                            base: total.base + cur.base,
                            buildingBoost: total.buildingBoost + cur.buildingBoost,
                            levelBoost: total.levelBoost + cur.levelBoost,
                            total: total.total + cur.total,
                        };
                    }, { base: 0, buildingBoost: 0, levelBoost: 0, total: 0 });
                }
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
    .bonus-breakdown {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px;
        width: 100%;

        .row {
            display: contents;
        }
    }

    .expedition-bonuses {
        &.detailed-view::v-deep {
            .bonus-breakdown {
                grid-template-columns: auto repeat(3, 1fr);
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