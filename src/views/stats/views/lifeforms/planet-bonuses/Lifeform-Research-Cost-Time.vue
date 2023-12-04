<template>
    <lifeform-planet-bonuses-component
        :technologyBonuses="technologyBonuses" 
        :types="bonusTypes" 
        :buildings="buildings" 
        :planets="planets" 
        :limits="limits" 
        research-bonus-breakdown-route-name="lifeforms/bonus-breakdown/research-cost-time" 
    />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformPlanetBonusesComponent, { LifeformPlanetBonusesType, LifeformPlanetBonuses } from '@/views/stats/components/lifeforms/LifeformPlanetBonuses.vue';
    import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
    import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformBuildingsByType, LifeformTechnologyResearchBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { LifeformTechnologyResearchBuilding } from '@/shared/models/ogame/lifeforms/buildings/interfaces';
    import { ResearchCostAndTimeReductionLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { getLifeformTechnologyBonus } from '@/shared/models/ogame/lifeforms/buildings/getLifeformTechnologyBonus';
    import { ResearchCostAndTimeReductionLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';

    type Bonuses = {
        cost: number;
        time: number;
    };

    @Component({
        components: {
            LifeformPlanetBonusesComponent,
        }
    })
    export default class ResourceProduction extends Vue {
        private get bonusTypes(): LifeformPlanetBonusesType<keyof Bonuses>[] {
            return [
                {
                    key: 'cost',
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.buildingCostTime.cost,
                },
                {
                    key: 'time',
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.buildingCostTime.time,
                },
            ];
        }

        private readonly buildings: LifeformBuildingType[] = LifeformTechnologyResearchBuildings.map(b => b.type);

        private get limits(): Record<keyof Bonuses, (value: number) => number> {
            const research = LifeformTechnologyType.intergalacticEnvoys;

            const costLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechCostReduction, tech: research });
            const timeLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechTimeReduction, tech: research });

            return {
                cost: value => costLimit != null ? Math.max(value, -costLimit) : value,
                time: value => timeLimit != null ? Math.max(value, -timeLimit) : value,
            };
        }

        private readonly techs: ResearchCostAndTimeReductionLifeformTechnology[] = ResearchCostAndTimeReductionLifeformTechnologies;

        private get technologyBonuses(): Record<keyof Bonuses, number> {
            const research = LifeformTechnologyType.intergalacticEnvoys;

            const keys: (keyof Bonuses)[] = ['cost', 'time'];
            const globalBonuses: Record<keyof Bonuses, number> = createRecord(keys, () => 0);

            const lifeformTechnologyBoostPerPlanet = getLifeformTechnologyBonus(EmpireDataModule.empire);
            this.empirePlanets.forEach(planet => {
                this.techs.filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
                    .forEach(tech => keys.forEach(key => {
                        const techBonus = tech.getResearchCostAndTimeReduction(research, planet.lifeformTechnologies[tech.type])[key];
                        const techBoost = lifeformTechnologyBoostPerPlanet[planet.id];

                        globalBonuses[key] += -1 * techBonus * (1 + techBoost);
                    }));
            });
            
            return globalBonuses;
        }

        private get empirePlanets() {
            return EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[];
        }

        private get planets(): Record<number, LifeformPlanetBonuses<keyof Bonuses>> {
            return createMappedRecord(
                this.empirePlanets,

                planet => planet.id,
                planet => {
                    const activeBuildingTypes = LifeformBuildingTypesByLifeform[planet.activeLifeform].filter(b => this.buildings.includes(b)); 
                    const bonusByBuilding = createRecord<keyof Bonuses, Record<LifeformBuildingType, number>>(
                            ['cost', 'time'], 
                            key => createRecord(
                                activeBuildingTypes, 
                                type => -1 * (LifeformBuildingsByType[type] as LifeformTechnologyResearchBuilding)
                                        .getLifeformTechnologyResearchCostAndTimeReduction(planet.lifeformBuildings[type])[key]
                        )
                    );

                    return {
                        planet,
                        bonusByBuilding,
                    }
                }
            );
        }
    }
</script>