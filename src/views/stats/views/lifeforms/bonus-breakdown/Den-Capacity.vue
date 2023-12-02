<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { DenCapacityBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { DenCapacityBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/lifeforms/LifeformBonusesBreakdown.vue';
import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';


    type BonusBreakdown = {
        base: number;
        level: number;
        buildings: number;
        buildingsBoost: number;
        total: number;
    };

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class DenCapacity extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<'capacity'>[] = [
            {
                key: 'capacity',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.denCapacity.header,
            },
        ];

        private readonly technologies = DenCapacityBonusLifeformTechnologies;

        private get techs(): LifeformTechnologyType[] {
            return this.technologies.map(t => t.type);
        }

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<'capacity'>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.technologies
                    .map<LifeformBonusesPlanetBreakdown<'capacity'>>(tech => {
                        const planetBonuses = this.getPlanetBonus(tech, planet);

                        return {
                            planet,
                            technologyType: tech.type,
                            bonuses: createRecord<'capacity', LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                                ['capacity'],
                                key => ({
                                    base: planetBonuses.base,
                                    buildings: planetBonuses.buildings,
                                    level: planetBonuses.level,
                                    total: planetBonuses.total,
                                })),
                        };
                    })
            );
        }

        private get limits(): Record<'capacity', (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.DenCapacityBonus });

            return {
                capacity: value => limit != null ? Math.min(value, limit) : value,
            };
        }

        private get experience() {
            return EmpireDataModule.lifeformExperience;
        }

        private getPlanetBonus(tech: DenCapacityBonusLifeformTechnology, planet: PlanetData): BonusBreakdown {
            const result: BonusBreakdown = {
                base: 0,
                level: 0,
                buildings: 0,
                buildingsBoost: 0,
                total: 0,
            };

            if (planet.activeLifeform == LifeformType.none
                || !planet.activeLifeformTechnologies.includes(tech.type)
            ) {
                return result;
            }


            const buildingsBoost = Math.min(
                getPlanetLifeformTechnologyBoost(planet),
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
            result.buildingsBoost += buildingsBoost;

            const baseBonus = tech.getDenCapacityBonus(planet.lifeformTechnologies[tech.type]);
            const lifeformLevelBonus = baseBonus * getLifeformLevelTechnologyBonus(this.experience[planet.activeLifeform as ValidLifeformType]);
            const lifeformBuildingBonus = baseBonus * buildingsBoost;

            const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus;

            result.base += baseBonus;
            result.level += lifeformLevelBonus;
            result.buildings += lifeformBuildingBonus;
            result.total += total;

            return result;
        }
    }
</script>