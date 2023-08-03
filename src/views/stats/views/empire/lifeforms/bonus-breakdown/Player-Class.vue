<template>
    <div>
        <select v-model.number="playerClass" style="display: block; margin-bottom: 4px">
            <option v-for="playerClass in PlayerClasses" :key="playerClass" :value="playerClass" v-text="$i18n.$t.extension.playerClasses[playerClass]" />
        </select>

        <grid-table inline :columns="classBonusesColumns" :items="classBonusesRows">
            <template #cell-base="{ value, item }">
                <decimal-number v-if="item.isPercentage" :value="value * 100" suffix="%" :digits="3" :fade-decimals="false" />
                <span v-else v-text="$i18n.$n(value)" />
            </template>
            <template #cell-actual="{ value, item }">
                <decimal-number v-if="item.isPercentage" :value="value * 100" suffix="%" :digits="3" :fade-decimals="false" />
                <span v-else v-text="$i18n.$n(value)" />
            </template>
        </grid-table>

        <hr />

        <lifeform-bonuses-breakdown :types="bonusTypes" :technologies="techs" :planets="planets" :limits="limits" />
    </div>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { LifeformTechnologyType } from '@/shared/models/ogame/lifeforms/LifeformTechnologyType';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { ClassBonusLifeformTechnology } from '@/shared/models/ogame/lifeforms/technologies/interfaces';
    import { ClassBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { getPlanetLifeformTechnologyBoost } from '@/views/stats/models/empire/lifeforms';
    import { Component, Vue } from 'vue-property-decorator';
    import LifeformBonusesBreakdown, { LifeformBonusesBreakdownType, LifeformBonusesPlanetBreakdown } from '@/views/stats/components/empire/lifeforms/LifeformBonusesBreakdown.vue';
    import { PlayerClass, SelectablePlayerClasses } from '@/shared/models/ogame/classes/PlayerClass';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
import { getLifeformBonusLimit } from '@/shared/models/ogame/lifeforms/LifeformBonusLimits';
import { LifeformBonusTypeId } from '@/shared/models/ogame/lifeforms/LifeformBonusType';

    type ClassBonusBreakdown = {
        base: number;
        level: number;
        buildings: number;
        buildingsBoost: number;
        total: number;
    };

    type ClassBonusValues = {
        label: string;
        isPercentage: boolean;
        base: number;
        actual: number;
    }

    @Component({
        components: {
            LifeformBonusesBreakdown,
        }
    })
    export default class PlayerClassBonuses extends Vue {

        private get serverSettings() {
            return ServerSettingsDataModule.serverSettings;
        }

        private get classBonusesRows(): ClassBonusValues[] {
            const totalBonus = Object.values(this.planets).reduce(
                (total, cur) => total + cur.reduce(
                    (total, cur) => total + cur.bonuses.classBonus.total,
                    0
                ),
                0);

            switch (this.playerClass) {
                case PlayerClass.collector:
                    return this.getCollectorClassBonusesRows(totalBonus);

                case PlayerClass.discoverer:
                    return this.getDiscovererClassBonusesRows(totalBonus);

                case PlayerClass.general:
                    return this.getGeneralClassBonusesRows(totalBonus);
            }

            throw new Error('invalid player class');
        }

        private get limits(): Record<'classBonus', (value: number) => number> {
            const limit = getLifeformBonusLimit({ type: LifeformBonusTypeId.PlayerClassBonus, playerClass: this.playerClass });

            return {
                classBonus: value => limit != null ? Math.min(value, limit) : value,
            };
        }

        private getCollectorClassBonusesRows(classBonus: number): ClassBonusValues[] {
            const factor = 1 + classBonus;
            return [
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.collector.productionBonus,
                    base: this.serverSettings.playerClasses.collector.productionFactorBonus,
                    actual: this.serverSettings.playerClasses.collector.productionFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.collector.energyProductionBonus,
                    base: this.serverSettings.playerClasses.collector.energyProductionFactorBonus,
                    actual: this.serverSettings.playerClasses.collector.energyProductionFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.collector.transporterSpeedBonus,
                    base: this.serverSettings.playerClasses.collector.tradingShips.speedFactorBonus,
                    actual: this.serverSettings.playerClasses.collector.tradingShips.speedFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.collector.transporterCargoBonus,
                    base: this.serverSettings.playerClasses.collector.tradingShips.cargoCapacityFactorBonus,
                    actual: this.serverSettings.playerClasses.collector.tradingShips.cargoCapacityFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.collector.crawlerProductionBonus,
                    base: this.serverSettings.playerClasses.collector.crawlers.productionFactorBonus,
                    actual: this.serverSettings.playerClasses.collector.crawlers.productionFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.collector.geologistCrawlerAmountBonus,
                    base: this.serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
                    actual: this.serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus * factor,
                    isPercentage: true,
                },
            ];
        }

        private getDiscovererClassBonusesRows(classBonus: number): ClassBonusValues[] {
            const factor = 1 + classBonus;
            return [
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.researchDuration,
                    base: -this.serverSettings.playerClasses.discoverer.researchSpeedFactor,
                    actual: -this.serverSettings.playerClasses.discoverer.researchSpeedFactor * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.increasedExpeditionFinds,
                    base: this.serverSettings.playerClasses.discoverer.expeditions.outcomeFactorBonus,
                    actual: this.serverSettings.playerClasses.discoverer.expeditions.outcomeFactorBonus * (1 + classBonus * 3), //TODO: fix formula when discoverer bonus formula fixed
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.largerPlanets,
                    base: this.serverSettings.playerClasses.discoverer.planetSizeFactorBonus,
                    actual: this.serverSettings.playerClasses.discoverer.planetSizeFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.additionalExpeditionSlots,
                    base: this.serverSettings.playerClasses.discoverer.bonusExpeditionSlots,
                    actual: Math.trunc(this.serverSettings.playerClasses.discoverer.bonusExpeditionSlots * factor),
                    isPercentage: false,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.reducedExpeditionCombatChance,
                    base: -0.5, //TODO: value not in server settings
                    actual: -0.5 * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.discoverer.phalanxRange,
                    base: this.serverSettings.playerClasses.discoverer.phalanxRangeFactorBonus,
                    actual: this.serverSettings.playerClasses.discoverer.phalanxRangeFactorBonus * factor,
                    isPercentage: true,
                },
            ];
        }

        private getGeneralClassBonusesRows(classBonus: number): ClassBonusValues[] {
            const factor = 1 + classBonus;
            return [
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.combatShipSpeed,
                    base: this.serverSettings.playerClasses.general.combatShipSpeedFactorBonus,
                    actual: this.serverSettings.playerClasses.general.combatShipSpeedFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.recyclerSpeed,
                    base: this.serverSettings.playerClasses.general.recyclers.speedFactorBonus,
                    actual: this.serverSettings.playerClasses.general.recyclers.speedFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.fuelConsumption,
                    base: -this.serverSettings.playerClasses.general.deuteriumConsumptionFactorReduction,
                    actual: -this.serverSettings.playerClasses.general.deuteriumConsumptionFactorReduction * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.increasedCargoRecyclersPathfinders,
                    base: this.serverSettings.playerClasses.general.recyclers.cargoCapacityFactorBonus,
                    actual: this.serverSettings.playerClasses.general.recyclers.cargoCapacityFactorBonus * factor,
                    isPercentage: true,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.additionalCombatResearchLevels,
                    base: 2, //TODO: not in server settings
                    actual: Math.trunc(2 * factor),
                    isPercentage: false,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.additionalFleetSlots,
                    base: this.serverSettings.playerClasses.general.bonusFleetSlots,
                    actual: Math.trunc(this.serverSettings.playerClasses.general.bonusFleetSlots * factor),
                    isPercentage: false,
                },
                {
                    label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.general.additionalMoonFields,
                    base: this.serverSettings.playerClasses.general.bonusMoonFields,
                    actual: Math.trunc(this.serverSettings.playerClasses.general.bonusMoonFields * factor),
                    isPercentage: false,
                },
            ];
        }

        private readonly classBonusesColumns: GridTableColumn<keyof ClassBonusValues>[] = [
            {
                key: 'label',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.bonus,
            },
            {
                key: 'base',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.baseValue,
            },
            {
                key: 'actual',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.valueWithBonuses,
            },
        ];

        private playerClass = PlayerClass.collector;
        private readonly PlayerClasses = SelectablePlayerClasses;

        mounted() {
            this.playerClass = EmpireDataModule.empire.playerClass == PlayerClass.none
                ? PlayerClass.collector
                : EmpireDataModule.empire.playerClass;
        }

        private readonly bonusTypes: LifeformBonusesBreakdownType<'classBonus'>[] = [
            {
                key: 'classBonus',
                label: this.$i18n.$t.extension.empire.lifeforms.researchBonuses.playerClasses.classBonus,
            },
        ];

        private readonly technologies: ClassBonusLifeformTechnology[] = ClassBonusLifeformTechnologies;
        private get techs(): LifeformTechnologyType[] {
            return this.technologies
                .filter(tech => tech.appliesTo(this.playerClass))
                .map(t => t.type);
        }

        private get planets(): Record<number, LifeformBonusesPlanetBreakdown<'classBonus'>[]> {
            return createMappedRecord(
                EmpireDataModule.empire.planetOrder
                    .map(id => EmpireDataModule.empire.planets[id])
                    .filter(planet => !planet.isMoon) as PlanetData[],
                planet => planet.id,
                planet => this.technologies
                    .filter(tech => tech.appliesTo(this.playerClass))
                    .map<LifeformBonusesPlanetBreakdown<'classBonus'>>(tech => {
                        const planetBonuses = this.getPlanetBonus(tech, planet);

                        return {
                            planet,
                            technologyType: tech.type,
                            bonuses: createRecord<'classBonus', LifeformBonusesPlanetBreakdown['bonuses'][string]>(
                                ['classBonus'],
                                _ => ({
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

        private getPlanetBonus(tech: ClassBonusLifeformTechnology, planet: PlanetData): ClassBonusBreakdown {
            if (planet.activeLifeform == LifeformType.none || !planet.activeLifeformTechnologies.includes(tech.type)) {
                return {
                    base: 0,
                    level: 0,
                    buildings: 0,
                    buildingsBoost: 0,
                    total: 0,
                };
            }

            const buildingsBoost = Math.min(
                getPlanetLifeformTechnologyBoost(planet),
                getLifeformBonusLimit({ type: LifeformBonusTypeId.LifeformResearchBonusBoost }) ?? Number.MAX_SAFE_INTEGER,
            );
            
            const baseBonus = tech.getClassBonus(this.playerClass, planet.lifeformTechnologies[tech.type]);
            const lifeformLevelBonus = baseBonus * getLifeformLevelTechnologyBonus(this.experience[planet.activeLifeform]);
            const lifeformBuildingBonus = baseBonus * buildingsBoost;

            return {
                base: baseBonus,
                level: lifeformLevelBonus,
                buildings: lifeformBuildingBonus,
                buildingsBoost,
                total: baseBonus + lifeformLevelBonus + lifeformBuildingBonus,
            };
        }
    }
</script>