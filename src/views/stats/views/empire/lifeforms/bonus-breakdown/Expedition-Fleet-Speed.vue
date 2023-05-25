<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { FleetSpeedBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { FleetSpeedBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { FleetMissionType } from '@/shared/models/ogame/fleets/FleetMissionType';


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
    export default class ExpeditionFleetSpeed extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<'speed'>[] = [
            {
                key: 'speed',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.expeditionSpeed.bonus,
            },
        ];

        private readonly technologies = FleetSpeedBonusLifeformTechnologies.filter(tech => tech.appliesTo(FleetMissionType.expedition));

        private get techs(): LifeformTechnologyType[] {
            return this.technologies.map(t => t.type);
        }

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<'speed'>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.technologies
                    .map<LifeformBonusesPlanetBreakdown<'speed'>>(tech => {
                        const planetBonuses = this.getPlanetBonus(tech, planet);

                        return {
                            planet,
                            technologyType: tech.type,
                            bonuses: createRecord<'speed', LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                                ['speed'],
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
            return EmpireDataModule.empire.lifeformExperience;
        }

        private getPlanetBonus(tech: FleetSpeedBonusLifeformTechnology, planet: PlanetData): BonusBreakdown {
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


            const buildingsBoost = getPlanetLifeformTechnologyBoost(planet);
            result.buildingsBoost += buildingsBoost;

            const baseBonus = tech.getFleetSpeedBonus(FleetMissionType.expedition, planet.lifeformTechnologies[tech.type]);
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