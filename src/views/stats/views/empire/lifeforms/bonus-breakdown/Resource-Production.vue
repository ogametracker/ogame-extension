<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
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
import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';

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

        private readonly techs: LifeformTechnologyType[] = ResourceProductionBonusLifeformTechnologies.map(t => t.type);


        private get limits(): Record<'metal' | 'crystal' | 'deuterium' | 'energy', (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ResourceProductionBonus });
            return {
                metal: value => limit != null ? Math.min(value, limit) : value,
                crystal: value => limit != null ? Math.min(value, limit) : value,
                deuterium: value => limit != null ? Math.min(value, limit) : value,
                energy: value => limit != null ? Math.min(value, limit) : value,
            };
        }

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
            if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
                return {
                    base: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    level: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    buildings: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                    buildingsBoost: 0,
                    total: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
                };
            }

            const buildingsBoost = Math.min(
                getPlanetLifeformTechnologyBoost(planet),
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
            
            const baseBonus = tech.getProductionBonus(planet.lifeformTechnologies[tech.type]);
            const lifeformLevelBonus = multiplyCost(baseBonus, getLifeformLevelTechnologyBonus(this.experience[planet.activeLifeform]));
            const lifeformBuildingBonus = multiplyCost(baseBonus, buildingsBoost);

            return {
                base: baseBonus,
                level: lifeformLevelBonus,
                buildings: lifeformBuildingBonus,
                buildingsBoost,
                total: addCost(baseBonus, lifeformLevelBonus, lifeformBuildingBonus),
            };
        }
    }
</script>