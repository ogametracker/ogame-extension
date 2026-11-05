<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script lang="ts">
    import { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
    import { FleetSpeedBonusLifeformTechnology } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/interfaces';
    import { FleetSpeedBonusLifeformTechnologies } from '@ogame-tracker/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@ogame-tracker/shared/utils/createRecord';
    import { EmpireDataModule } from '@stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@stats/models/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@stats/components/lifeforms/LifeformBonusesBreakdown.vue';
    import { FleetMissionType } from '@ogame-tracker/shared/models/ogame/fleets/FleetMissionType';
import { getLifeformBonusLimit } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBonusType';


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
    export default class DiscoveryMissions extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<'speed'>[] = [
            {
                key: 'speed',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.discoveryMissions.header,
            },
        ];

        private readonly technologies = FleetSpeedBonusLifeformTechnologies.filter(tech => tech.appliesTo(FleetMissionType.searchForLifeforms));

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
            return EmpireDataModule.lifeformExperience;
        }

        private get limits(): Record<'speed', (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.FleetSpeedBonus, missionType: FleetMissionType.searchForLifeforms });

            return {
                speed: value => limit != null ? Math.min(value, limit) : value,
            };
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


            const buildingsBoost = Math.min(
                getPlanetLifeformTechnologyBoost(planet)[tech.type],
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
            result.buildingsBoost += buildingsBoost;

            const baseBonus = tech.getFleetSpeedBonus(FleetMissionType.searchForLifeforms, planet.lifeformTechnologies[tech.type]);
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