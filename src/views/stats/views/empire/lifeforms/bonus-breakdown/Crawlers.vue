<template>
    <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { CrawlerProductionBonusAndConsumptionReductionLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';

    type Bonuses = {
        production: number;
        energyConsumption: number;
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
    export default class Crawlers extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof Bonuses>[] = [
            {
                key: 'production',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.crawlers.productionBonus,
            },
            {
                key: 'energyConsumption',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.crawlers.energyConsumption,
            },
        ];

        private readonly technologies = CrawlerProductionBonusAndConsumptionReductionLifeformTechnologies;

        private get techs(): LifeformTechnologyType[] {
            return this.technologies.map(t => t.type);
        }

        private get limits(): Record<keyof Bonuses, (value: number) => number> {
            const energyConsumptionLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.CrawlerEnergyConsumptionReduction });
            const productionLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.CrawlerBonus });

            return {
                energyConsumption: value => energyConsumptionLimit != null ? Math.max(value, -energyConsumptionLimit) : value,
                production: value => productionLimit != null ? Math.min(value, productionLimit) : value,
            };
        }

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
                                ['production', 'energyConsumption'],
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
            return EmpireDataModule.lifeformExperience;
        }

        private getPlanetBonus(tech: CrawlerProductionBonusAndConsumptionReductionLifeformTechnology, planet: PlanetData): BonusBreakdown {
            const result: BonusBreakdown = {
                base: { production: 0, energyConsumption: 0 },
                level: { production: 0, energyConsumption: 0 },
                buildings: { production: 0, energyConsumption: 0 },
                buildingsBoost: 0,
                total: { production: 0, energyConsumption: 0 },
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

            const bonuses = {
                production: tech.getCrawlerProductionBonus(planet.lifeformTechnologies[tech.type]),
                energyConsumption: -tech.getCrawlerConsumptionReduction(planet.lifeformTechnologies[tech.type]).energy,
            };

            const mapping: Record<keyof Bonuses, keyof typeof bonuses> = {
                production: 'production',
                energyConsumption: 'energyConsumption',
            };
            (Object.entries(mapping) as [keyof Bonuses, keyof typeof bonuses][]).forEach(pair => {
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