<template>
    <div>
        <select v-model.number="building" style="display: block; margin-bottom: 4px">
            <option v-for="building in Buildings" :key="building" :value="building" v-text="$i18n.$t.ogame.buildings[building]" />
        </select>

        <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets">
            <template #header>
                <div style="display: flex; flex-direction: column; align-items: start">
                    <span v-text="'LOCA: Building cost and time reduction'" />
                    <span>
                        <o-building :building="building" class="mr-2" />
                        <span v-text="$i18n.$t.ogame.buildings[building]" />
                    </span>
                </div>
            </template>
        </lifeform-bonuses-breakdown>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { BuildingCostAndTimeReductionLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { BuildingCostAndTimeReductionLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { BuildingTypes } from '@/shared/models/ogame/buildings/BuildingTypes';
    import { CostAndTimeReduction } from '@/shared/models/ogame/lifeforms/common-interfaces';

    type Bonuses = {
        cost: number;
        time: number;
    };

    type BonusBreakdown = {
        base: Bonuses;
        level: Bonuses;
        buildings: Bonuses;
        buildingsBoost: number;
        total: Bonuses;
    };

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class BuildingCostTime extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof Bonuses>[] = [
            {
                key: 'cost',
                label: 'LOCA: Cost',
            },
            {
                key: 'time',
                label: 'LOCA: Time',
            },
        ];

        private readonly technologies = BuildingCostAndTimeReductionLifeformTechnologies;

        private get techs(): LifeformTechnologyType[] {
            return this.technologies
                .filter(tech => tech.appliesTo(this.building))
                .map(t => t.type);
        }

        private building = BuildingType.allianceDepot;
        private readonly Buildings = BuildingTypes.filter(b => this.technologies.some(tech => tech.appliesTo(b)));

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<keyof Bonuses>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.technologies
                    .map<LifeformBonusesPlanetBreakdown<keyof Bonuses>>(tech => {
                        const planetBonuses = this.getPlanetBonus(tech, planet);

                        return {
                            planet,
                            technologyType: tech.type,
                            bonuses: createRecord<keyof Bonuses, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                                ['cost', 'time'],
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

        private getPlanetBonus(tech: BuildingCostAndTimeReductionLifeformTechnology, planet: PlanetData): BonusBreakdown {
            const result: BonusBreakdown = {
                base: { cost: 0, time: 0 },
                level: { cost: 0, time: 0 },
                buildings: { cost: 0, time: 0 },
                buildingsBoost: 0,
                total: { cost: 0, time: 0 },
            };

            if (planet.activeLifeform == LifeformType.none
                || !planet.activeLifeformTechnologies.includes(tech.type)
                || !tech.appliesTo(this.building)
            ) {
                return result;
            }


            const buildingsBoost = getPlanetLifeformTechnologyBoost(planet);
            result.buildingsBoost += buildingsBoost;

            const bonuses = tech.getBuildingCostAndTimeReduction(this.building, planet.lifeformTechnologies[tech.type]);

            const mapping: Record<keyof Bonuses, keyof CostAndTimeReduction> = {
                cost: 'cost',
                time: 'time',
            };
            (Object.entries(mapping) as [keyof Bonuses, keyof CostAndTimeReduction][]).forEach(pair => {
                const [bonusType, statsType] = pair;

                const baseBonus = bonuses[statsType];
                const lifeformLevelBonus = baseBonus * getLifeformLevelTechnologyBonus(this.experience[planet.activeLifeform as ValidLifeformType]);
                const lifeformBuildingBonus = baseBonus * buildingsBoost;

                const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus;

                result.base[bonusType] += baseBonus;
                result.level[bonusType] += lifeformLevelBonus;
                result.buildings[bonusType] += lifeformBuildingBonus;
                result.total[bonusType] += total;
            });

            return result;
        }
    }
</script>