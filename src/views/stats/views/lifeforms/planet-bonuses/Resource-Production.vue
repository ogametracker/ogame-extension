<template>
    <lifeform-planet-bonuses-component
        :technologyBonuses="technologyBonuses" 
        :types="bonusTypes" 
        :buildings="buildings" 
        :planets="planets" 
        :limits="limits" 
        research-bonus-breakdown-route-name="lifeforms/bonus-breakdown/resource-production" 
    />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { Cost } from '@/shared/models/ogame/common/Cost';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformPlanetBonusesComponent, { LifeformPlanetBonusesType, LifeformPlanetBonuses } from '@/views/stats/components/lifeforms/LifeformPlanetBonuses.vue';
    import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
    import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';
    import { LifeformBuildingType, LifeformBuildingTypesByLifeform } from '@/shared/models/ogame/lifeforms/LifeformBuildingType';
    import { LifeformBuildingsByType, ResourceProductionBonusLifeformBuildings } from '@/shared/models/ogame/lifeforms/buildings/LifeformBuildings';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { ResourceProductionBonusLifeformBuilding } from '@/shared/models/ogame/lifeforms/buildings/interfaces';
    import { ResourceProductionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { getLifeformTechnologyBonus } from '@/shared/models/ogame/lifeforms/buildings/getLifeformTechnologyBonus';
    import { ResourceProductionBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';


    @Component({
        components: {
            LifeformPlanetBonusesComponent,
        }
    })
    export default class ResourceProduction extends Vue {
        private get bonusTypes(): LifeformPlanetBonusesType<keyof Cost>[] {
            return [
                {
                    key: 'metal',
                    label: this.$i18n.$t.ogame.resources.metal,
                },
                {
                    key: 'crystal',
                    label: this.$i18n.$t.ogame.resources.crystal,
                },
                {
                    key: 'deuterium',
                    label: this.$i18n.$t.ogame.resources.deuterium,
                },
                {
                    key: 'energy',
                    label: this.$i18n.$t.ogame.resources.energy,
                },
            ];
        }

        private readonly buildings: LifeformBuildingType[] = ResourceProductionBonusLifeformBuildings.map(b => b.type);

        private get limits(): Record<'metal' | 'crystal' | 'deuterium' | 'energy', (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ResourceProductionBonus });
            return {
                metal: value => limit != null ? Math.min(value, limit) : value,
                crystal: value => limit != null ? Math.min(value, limit) : value,
                deuterium: value => limit != null ? Math.min(value, limit) : value,
                energy: value => limit != null ? Math.min(value, limit) : value,
            };
        }

        private readonly techs: ResourceProductionBonusLifeformTechnology[] = ResourceProductionBonusLifeformTechnologies;

        private get technologyBonuses(): Record<keyof Cost, number> {
            const keys: (keyof Cost)[] = ['metal', 'crystal', 'deuterium', 'energy'];
            const globalBonuses: Record<keyof Cost, number> = createRecord(keys, () => 0);

            const lifeformTechnologyBoostPerPlanet = getLifeformTechnologyBonus(EmpireDataModule.empire);
            this.empirePlanets.forEach(planet => {
                this.techs.filter(tech => planet.activeLifeformTechnologies.includes(tech.type))
                    .forEach(tech => keys.forEach(key => {
                        const techBonus = tech.getProductionBonus(planet.lifeformTechnologies[tech.type])[key];
                        const techBoost = lifeformTechnologyBoostPerPlanet[planet.id];

                        globalBonuses[key] += techBonus * (1 + techBoost);
                    }));
            });
            
            return globalBonuses;
        }

        private get empirePlanets() {
            return EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[];
        }

        private get planets(): Record<number, LifeformPlanetBonuses<keyof Cost>> {
            return createMappedRecord(
                this.empirePlanets,

                planet => planet.id,
                planet => {
                    const activeBuildingTypes = LifeformBuildingTypesByLifeform[planet.activeLifeform].filter(b => this.buildings.includes(b)); 
                    const bonusByBuilding = createRecord<keyof Cost, Record<LifeformBuildingType, number>>(
                            ['metal', 'crystal', 'deuterium', 'energy'], 
                            key => createRecord(
                                activeBuildingTypes, 
                                type => (LifeformBuildingsByType[type] as ResourceProductionBonusLifeformBuilding)
                                        .getProductionBonus(planet.lifeformBuildings[type])[key]
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