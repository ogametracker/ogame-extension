<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { addCost, Cost, multiplyCost } from '@/shared/models/ogame/common/Cost';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ResourceProductionBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { LifeformTechnologiesByType, ResourceProductionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';

    type ResourceProductionBonusBreakdown = {
        base: Cost;
        level: Cost;
        buildings: Cost;
        buildingsBoost: number;
        total: Cost;
    };

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class ResourceProduction extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof Cost>[] = [
            {
                key: 'metal',
                label: 'LOCA: Metal',
            },
            {
                key: 'crystal',
                label: 'LOCA: Crystal',
            },
            {
                key: 'deuterium',
                label: 'LOCA: Deuterium',
            },
            {
                key: 'energy',
                label: 'LOCA: Energy',
            },
        ];

        private readonly techs: LifeformTechnologyType[] = ResourceProductionBonusLifeformTechnologies.map(t => t.type);

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<keyof Cost>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.techs.map<LifeformBonusesPlanetBreakdown<keyof Cost>>(techType => {
                    const tech = LifeformTechnologiesByType[techType] as ResourceProductionBonusLifeformTechnology;
                    const planetBonuses = this.getPlanetBonus(tech, planet);

                    return {
                        planet,
                        technologyType: techType,
                        bonuses: createRecord<keyof Cost, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                            ['metal', 'crystal', 'deuterium', 'energy'],
                            key => ({
                                base: planetBonuses.base[key],
                                buildings: planetBonuses.buildings[key],
                                level: planetBonuses.level[key],
                                total: planetBonuses.total[key],
                            })),
                    };
                })
            );
        }

        private get experience() {
            return EmpireDataModule.empire.lifeformExperience;
        }

        private getPlanetBonus(tech: ResourceProductionBonusLifeformTechnology, planet: PlanetData): ResourceProductionBonusBreakdown {
            if (planet.activeLifeform == LifeformType.none) {
                return {
                    base: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    level: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    buildings: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    buildingsBoost: 0,
                    total: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                };
            }

            const baseBonus = tech.getProductionBonus(planet.lifeformTechnologies[tech.type]);
            const lifeformLevelBonus = multiplyCost(baseBonus, getLifeformLevelTechnologyBonus(this.experience[planet.activeLifeform]));
            const buildingsBoost = getPlanetLifeformTechnologyBoost(planet);
            const lifeformBuildingBonus = multiplyCost(baseBonus, buildingsBoost);

            return {
                base: baseBonus,
                level: lifeformLevelBonus,
                buildings: lifeformBuildingBonus,
                buildingsBoost,
                total: addCost(baseBonus, lifeformLevelBonus, lifeformBuildingBonus),
            };
        }

        /*

                private readonly percentageFormat: Intl.NumberFormatOptions = {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                };
                private readonly smallPercentageFormat: Intl.NumberFormatOptions = {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                };

                private readonly getLifeformLevelTechnologyBonus = getLifeformLevelTechnologyBonus;
                private readonly resources: (keyof Cost)[] = ['metal', 'crystal', 'deuterium', 'energy'];

                private readonly expandedPlanets: Partial<Record<number, boolean>> = {};

                private togglePlanet(id: number) {
                    Vue.set(this.expandedPlanets, id, !(this.expandedPlanets[id] ?? false));
                }

                private get planets() {
                    return Object.values(EmpireDataModule.empire.planets)
                        .filter(planet => !planet.isMoon) as PlanetData[];
                }

                private formatCoordinates(coords: Coordinates) {
                    return `[${coords.galaxy}:${coords.system}:${coords.position}]`;
                }

                private readonly LifeformTechnologySlots = LifeformTechnologySlots;


                private get levels(): Record<ValidLifeformType, number> {
                    return createRecord(ValidLifeformTypes, type => getLifeformLevel(this.experience[type]));
                }

                private get totalBonus(): ResourceProductionBonusBreakdown {
                    return this.planets.reduce<ResourceProductionBonusBreakdown>((total, cur) => {
                        const planet = this.getTotalPlanetBonus(cur);
                        return {
                            base: addCost(total.base, planet.base),
                            level: addCost(total.level, planet.level),
                            buildings: addCost(total.buildings, planet.buildings),
                            total: addCost(total.total, planet.total),
                            buildingsBoost: 0,
                        };
                    }, {
                        base: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        level: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        buildings: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        buildingsBoost: 0,
                        total: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    });
                }

                private getProductionResearches(planet: PlanetData): ResourceProductionBonusLifeformTechnology[] {
                    return ResourceProductionBonusLifeformTechnologies
                        .filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
                        .sort((a, b) => LifeformTechnologySlots[a.type] - LifeformTechnologySlots[b.type]);
                }

                private getTotalPlanetBonus(planet: PlanetData): ResourceProductionBonusBreakdown {
                    const breakdowns = this.getProductionResearches(planet)
                        .map(tech => this.getPlanetBonus(tech, planet));

                    return breakdowns.reduce<ResourceProductionBonusBreakdown>((total, cur) => {
                        return {
                            base: addCost(total.base, cur.base),
                            level: addCost(total.level, cur.level),
                            buildings: addCost(total.buildings, cur.buildings),
                            total: addCost(total.total, cur.total),
                            buildingsBoost: total.buildingsBoost,
                        };
                    }, {
                        base: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        level: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        buildings: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        total: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                        buildingsBoost: getPlanetLifeformTechnologyBoost(planet),
                    });
                }

                */
    }
</script>