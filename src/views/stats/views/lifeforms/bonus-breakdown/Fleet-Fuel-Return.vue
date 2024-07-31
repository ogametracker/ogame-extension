<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { FleetFuelReturnLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { FleetFuelReturnLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
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
    export default class FleetFuelReturn extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<'fuelReturn'>[] = [
            {
                key: 'fuelReturn',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.fuelReturn.bonus,
            },
        ];

        private readonly technologies = FleetFuelReturnLifeformTechnologies;

        private get techs(): LifeformTechnologyType[] {
            return this.technologies.map(t => t.type);
        }

        private get limits(): Record<'fuelReturn', (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.FuelReturn });

            return {
                fuelReturn: value => limit != null ? Math.min(value, limit) : value,
            };
        }

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<'fuelReturn'>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.technologies
                    .map<LifeformBonusesPlanetBreakdown<'fuelReturn'>>(tech => {
                        const planetBonuses = this.getPlanetBonus(tech, planet);

                        return {
                            planet,
                            technologyType: tech.type,
                            bonuses: createRecord<'fuelReturn', LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                                ['fuelReturn'],
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

        private get experience() {
            return EmpireDataModule.lifeformExperience;
        }

        private getPlanetBonus(tech: FleetFuelReturnLifeformTechnology, planet: PlanetData): BonusBreakdown {
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
                getPlanetLifeformTechnologyBoost(planet)[tech.type],
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
            result.buildingsBoost += buildingsBoost;

            const baseBonus = tech.getFuelReturn(planet.lifeformTechnologies[tech.type]);
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