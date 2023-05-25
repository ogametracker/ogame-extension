<template>
    <lifeform-bonuses-breakdown :header="'LOCA: Expedition find bonuses'" :types="bonusTypes" :technologies="techs" :planets="planets" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ExpeditionBonusLifeformTechnology, ExpeditionEventProbabilityBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { ExpeditionBonusLifeformTechnologies, ExpeditionEventProbabilityBonusLifeformTechnologies, LifeformTechnologiesByType } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';

    type ExpeditionBonuses = {
        resources: number;
        ships: number;
        darkMatter: number;
        fleetLoss: number;
    };

    type ExpeditionBonusBreakdown = {
        base: ExpeditionBonuses;
        level: ExpeditionBonuses;
        buildings: ExpeditionBonuses;
        buildingsBoost: number;
        total: ExpeditionBonuses;
    };

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class ExpeditionFinds extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof ExpeditionBonuses>[] = [
            {
                key: 'resources',
                label: 'LOCA: Resources',
            },
            {
                key: 'ships',
                label: 'LOCA: Ships',
            },
            {
                key: 'darkMatter',
                label: 'LOCA: Dark Matter',
            },
            {
                key: 'fleetLoss',
                label: 'LOCA: Fleet Loss',
            },
        ];

        private readonly technologies = [...ExpeditionEventProbabilityBonusLifeformTechnologies, ...ExpeditionBonusLifeformTechnologies];
        private readonly techs: LifeformTechnologyType[] = this.technologies.map(t => t.type);

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<keyof ExpeditionBonuses>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.techs.map<LifeformBonusesPlanetBreakdown<keyof ExpeditionBonuses>>(techType => {
                    const tech = LifeformTechnologiesByType[techType] as ExpeditionBonusLifeformTechnology | ExpeditionEventProbabilityBonusLifeformTechnology;
                    const planetBonuses = this.getPlanetBonus(tech, planet);

                    return {
                        planet,
                        technologyType: techType,
                        bonuses: createRecord<keyof ExpeditionBonuses, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                            ['resources', 'ships', 'darkMatter', 'fleetLoss'],
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

        private getPlanetBonus(tech: ExpeditionBonusLifeformTechnology | ExpeditionEventProbabilityBonusLifeformTechnology, planet: PlanetData): ExpeditionBonusBreakdown {
            const result: ExpeditionBonusBreakdown = {
                base: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
                level: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
                buildings: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
                buildingsBoost: 0,
                total: { resources: 0, ships: 0, darkMatter: 0, fleetLoss: 0 },
            };
            if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
                return result;
            }


            const buildingsBoost = getPlanetLifeformTechnologyBoost(planet);
            result.buildingsBoost += buildingsBoost;

            const mapping: Record<keyof ExpeditionBonuses, ExpeditionEventType> = {
                resources: ExpeditionEventType.resources,
                ships: ExpeditionEventType.fleet,
                darkMatter: ExpeditionEventType.darkMatter,
                fleetLoss: ExpeditionEventType.lostFleet,
            };
            (Object.entries(mapping) as [keyof ExpeditionBonuses, ExpeditionEventType][]).forEach(pair => {
                const [bonusType, eventType] = pair;

                const baseBonus = 'getExpeditionBonus' in tech
                    ? tech.getExpeditionBonus(eventType, planet.lifeformTechnologies[tech.type])
                    : tech.getExpeditionEventProbabilityBonus(eventType, planet.lifeformTechnologies[tech.type]);
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