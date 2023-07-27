<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
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
import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';

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
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.expeditionFinds.resources,
            },
            {
                key: 'ships',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.expeditionFinds.ships,
            },
            {
                key: 'darkMatter',
                label: this.$i18n.$t.ogame.premium.darkMatter,
            },
            {
                key: 'fleetLoss',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.expeditionFinds.fleetLoss,
            },
        ];

        private readonly technologies = [...ExpeditionEventProbabilityBonusLifeformTechnologies, ...ExpeditionBonusLifeformTechnologies];
        private readonly techs: LifeformTechnologyType[] = this.technologies.map(t => t.type);


        private get limits(): Record<keyof ExpeditionBonuses, (value: number) => number> {
            const resourcesLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ExpeditionBonus, event: ExpeditionEventType.resources });
            const shipsLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ExpeditionBonus, event: ExpeditionEventType.fleet });
            const darkMatterLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ExpeditionBonus, event: ExpeditionEventType.darkMatter });
            const fleetLossLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.ExpeditionEventProbabilityBonus, event: ExpeditionEventType.lostFleet });

            return {
                resources: value => resourcesLimit != null ? Math.min(value, resourcesLimit) : value,
                ships: value => shipsLimit != null ? Math.min(value, shipsLimit) : value,
                darkMatter: value => darkMatterLimit != null ? Math.min(value, darkMatterLimit) : value,
                fleetLoss: value => fleetLossLimit != null ? Math.max(value, -fleetLossLimit) : value,
            };
        }

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


            const buildingsBoost = Math.min(
                getPlanetLifeformTechnologyBoost(planet),
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
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