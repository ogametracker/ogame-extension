<template>
    <div>
        <select v-model="research" style="display: block; margin-bottom: 4px">
            <optgroup :label="$i18n.$t.extension.empire.lifeforms.researchBonuses.researchCostTime.researches">
                <option v-for="research in Researches" :key="research" :value="research" v-text="$i18n.$t.ogame.research[research]" />
            </optgroup>
            <option value="lifeform-researches" v-text="$i18n.$t.extension.empire.lifeforms.researchBonuses.researchCostTime.lifeformResearches" />
        </select>

        <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits">
            <template #header>
                <div style="display: flex; flex-direction: column; align-items: start" v-if="research == 'lifeform-researches'">
                    <span v-text="$i18n.$t.extension.empire.lifeforms.researchBonuses.researchCostTime.lifeformResearches" />
                </div>
                <div style="display: flex; flex-direction: column; align-items: start" v-else>
                    <span>
                        <o-research :research="research" class="mr-2" />
                        <span v-text="$i18n.$t.ogame.research[research]" />
                    </span>
                </div>
            </template>
        </lifeform-bonuses-breakdown>
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ResearchCostAndTimeReductionLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { ResearchCostAndTimeReductionLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { CostAndTimeReduction } from '@/shared/models/ogame/lifeforms/common-interfaces';
    import { ResearchType } from '@/shared/models/ogame/research/ResearchType';
    import { ResearchTypes } from '@/shared/models/ogame/research/ResearchTypes';
import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';

    type Bonuses = {
        cost: number;
        time: number;
    };

    type BonusBreakdown = {
        base: Bonuses;
        level: Bonuses;
        buildings: Bonuses;
        buildingsBoost: number;
        total: Bonuses;

        bugBonus: Bonuses;
    };

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class ResearchCostTime extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof Bonuses>[] = [
            {
                key: 'cost',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.buildingCostTime.cost,
            },
            {
                key: 'time',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.buildingCostTime.time,
            },
        ];

        private readonly technologies = ResearchCostAndTimeReductionLifeformTechnologies;

        private get techs(): LifeformTechnologyType[] {
            const research = this.research == 'lifeform-researches' ? LifeformTechnologyType.intergalacticEnvoys : this.research;

            return this.technologies
                .filter(tech => tech.appliesTo(research))
                .map(t => t.type);
        }

        private get limits(): Record<keyof Bonuses, (value: number) => number> {
            const research = this.research == 'lifeform-researches'
                ? LifeformTechnologyType.intergalacticEnvoys
                : this.research;

            const costLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechCostReduction, tech: research });
            const timeLimit = getLifeformBonusLimit({ type: LifeformBonusTypeId.TechTimeReduction, tech: research });

            return {
                cost: value => costLimit != null ? Math.max(value, -costLimit) : value,
                time: value => timeLimit != null ? Math.max(value, -timeLimit) : value,
            };
        }

        private research: ResearchType | 'lifeform-researches' = ResearchType.energyTechnology;
        private readonly Researches = ResearchTypes.filter(b => this.technologies.some(tech => tech.appliesTo(b)));

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
                                ['cost', 'time'],
                                key => ({
                                    base: planetBonuses.base[key],
                                    buildings: planetBonuses.buildings[key],
                                    level: planetBonuses.level[key],
                                    total: planetBonuses.total[key],
                                    bugBonus: planetBonuses.bugBonus[key],
                                })),
                        };
                    })
            );
        }

        private get experience() {
            return EmpireDataModule.empire.lifeformExperience;
        }

        private getPlanetBonus(tech: ResearchCostAndTimeReductionLifeformTechnology, planet: PlanetData): BonusBreakdown {
            const result: BonusBreakdown = {
                base: { cost: 0, time: 0 },
                level: { cost: 0, time: 0 },
                buildings: { cost: 0, time: 0 },
                buildingsBoost: 0,
                total: { cost: 0, time: 0 },
                bugBonus: { cost: 0, time: 0 },
            };
            const research = this.research == 'lifeform-researches' ? LifeformTechnologyType.intergalacticEnvoys : this.research;

            if (planet.activeLifeform == LifeformType.none
                || !planet.activeLifeformTechnologies.includes(tech.type)
                || !tech.appliesTo(research)
            ) {
                return result;
            }


            const buildingsBoost = Math.min(
                getPlanetLifeformTechnologyBoost(planet),
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
            result.buildingsBoost += buildingsBoost;

            const bonuses = tech.getResearchCostAndTimeReduction(research, planet.lifeformTechnologies[tech.type]);

            const mapping: Record<keyof Bonuses, keyof CostAndTimeReduction> = {
                cost: 'cost',
                time: 'time',
            };
            (Object.entries(mapping) as [keyof Bonuses, keyof CostAndTimeReduction][]).forEach(pair => {
                const [bonusType, statsType] = pair;

                const baseBonus = -1 * bonuses[statsType];
                result.base[bonusType] += baseBonus;

                const levelBoost = getLifeformLevelTechnologyBonus(this.experience[planet.activeLifeform as ValidLifeformType]);
                const lifeformLevelBonus = baseBonus * levelBoost;
                result.level[bonusType] += lifeformLevelBonus;

                const lifeformBuildingBonus = baseBonus * buildingsBoost;
                result.buildings[bonusType] += lifeformBuildingBonus;
                
                let bugBonus = 0;
                if(bonusType == 'time') {
                    const bonusFactor = 1 + buildingsBoost + levelBoost;
                    const bugBonusFactor = bonusFactor ** 2 - bonusFactor;
                    bugBonus = bugBonusFactor * baseBonus;
                }
                result.bugBonus[bonusType] = bugBonus;

                
                const total = baseBonus + lifeformLevelBonus + lifeformBuildingBonus + bugBonus;
                result.total[bonusType] += total;
            });

            return result;
        }
    }
</script>