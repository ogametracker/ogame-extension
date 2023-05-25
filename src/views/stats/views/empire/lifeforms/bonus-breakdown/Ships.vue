<template>
    <div>
        <select v-model.number="ship" style="display: block; margin-bottom: 4px">
            <option v-for="ship in Ships" :key="ship" :value="ship" v-text="$i18n.$t.ogame.ships[ship]" />
        </select>

        <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets">
            <template #header>
                <div style="display: flex; flex-direction: column; align-items: start">
                    <span>
                        <o-ship :ship="ship" class="mr-2" />
                        <span v-text="$i18n.$t.ogame.ships[ship]" />
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
    import { StatsBonus, StatsBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { LifeformTechnologiesByType, StatsBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { ShipTypes } from '@/shared/models/ogame/ships/ShipTypes';

    type StatsBonuses = {
        armor: number;
        shield: number;
        damage: number;
        cargo: number;
        speed: number;
    };

    type ShipBonusBreakdown = {
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
    export default class Expeditions extends Vue {

        private readonly bonusTypes: LifeformBonusesBreakdownType<keyof StatsBonuses>[] = [
            {
                key: 'armor',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.ships.armor,
            },
            {
                key: 'shield',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.ships.shield,
            },
            {
                key: 'damage',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.ships.damage,
            },
            {
                key: 'cargo',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.ships.cargo,
            },
            {
                key: 'speed',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.ships.speed,
            },
        ];

        private readonly technologies = StatsBonusLifeformTechnologies;
        private get techs(): LifeformTechnologyType[] {
            return this.technologies
                .filter(tech => tech.appliesTo(this.ship))
                .map(t => t.type);
        }

        private ship = ShipType.largeCargo;
        private readonly Ships = ShipTypes;

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
                                ['armor', 'shield', 'damage', 'cargo', 'speed'],
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

        private getPlanetBonus(tech: StatsBonusLifeformTechnology, planet: PlanetData): ShipBonusBreakdown {
            const result: ShipBonusBreakdown = {
                base: { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 },
                level: { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 },
                buildings: { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 },
                buildingsBoost: 0,
                total: { armor: 0, shield: 0, damage: 0, cargo: 0, speed: 0 },
            };

            if (planet.activeLifeform == LifeformType.none
                || !planet.activeLifeformTechnologies.includes(tech.type)
                || !tech.appliesTo(this.ship)
            ) {
                return result;
            }


            const buildingsBoost = getPlanetLifeformTechnologyBoost(planet);
            result.buildingsBoost += buildingsBoost;

            const bonuses = tech.getStatsBonus(this.ship, planet.lifeformTechnologies[tech.type]);

            const mapping: Record<keyof StatsBonuses, keyof StatsBonus> = {
                armor: 'armor',
                shield: 'shield',
                damage: 'damage',
                cargo: 'cargo',
                speed: 'speed',
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