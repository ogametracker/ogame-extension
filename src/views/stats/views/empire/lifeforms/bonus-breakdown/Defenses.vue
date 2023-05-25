<template>
    <lifeform-bonuses-breakdown :header="'LOCA: Defense stats bonuses'" :types="bonusTypes" :technologies="techs" :planets="planets" />
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType, ValidLifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { StatsBonus, StatsBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { StatsBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { DefenseType } from '@/shared/models/ogame/defenses/DefenseType';

    type StatsBonuses = {
        armor: number;
        shield: number;
        damage: number;
    };

    type DefenseBonusBreakdown = {
        base: StatsBonuses;
        level: StatsBonuses;
        buildings: StatsBonuses;
        buildingsBoost: number;
        total: StatsBonuses;
    };

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class Defenses extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof StatsBonuses>[] = [
            {
                key: 'armor',
                label: 'LOCA: Armor',
            },
            {
                key: 'shield',
                label: 'LOCA: Shield',
            },
            {
                key: 'damage',
                label: 'LOCA: Damage',
            },
        ];

        private readonly technologies = StatsBonusLifeformTechnologies
            .filter(tech => tech.appliesTo(DefenseType.rocketLauncher));

        private get techs(): LifeformTechnologyType[] {
            return this.technologies.map(t => t.type);
        }

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<keyof StatsBonuses>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.technologies
                    .map<LifeformBonusesPlanetBreakdown<keyof StatsBonuses>>(tech => {
                        const planetBonuses = this.getPlanetBonus(tech, planet);

                        return {
                            planet,
                            technologyType: tech.type,
                            bonuses: createRecord<keyof StatsBonuses, LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                                ['armor', 'shield', 'damage'],
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

        private getPlanetBonus(tech: StatsBonusLifeformTechnology, planet: PlanetData): DefenseBonusBreakdown {
            const result: DefenseBonusBreakdown = {
                base: { armor: 0, shield: 0, damage: 0 },
                level: { armor: 0, shield: 0, damage: 0 },
                buildings: { armor: 0, shield: 0, damage: 0 },
                buildingsBoost: 0,
                total: { armor: 0, shield: 0, damage: 0 },
            };

            if (planet.activeLifeform == LifeformType.none
                || !planet.activeLifeformTechnologies.includes(tech.type)
            ) {
                return result;
            }


            const buildingsBoost = getPlanetLifeformTechnologyBoost(planet);
            result.buildingsBoost += buildingsBoost;

            const bonuses = tech.getStatsBonus(DefenseType.rocketLauncher, planet.lifeformTechnologies[tech.type]);

            const mapping: Record<keyof StatsBonuses, keyof StatsBonus> = {
                armor: 'armor',
                shield: 'shield',
                damage: 'damage',
            };
            (Object.entries(mapping) as [keyof StatsBonuses, keyof StatsBonus][]).forEach(pair => {
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