<template>
    <div>
        <div class="small-tables">
            <grid-table inline :columns="infoColumns" :items="infoItems" no-header>
                <template #cell-value="{ value, item }">
                    <o-player-class v-if="item.type == 'playerClass'" :player-class="value" />
                    <span v-else-if="item.type == 'number'" v-text="value" />
                    <span v-else v-text="$i18n.$n(value * 100, percentageFormat) + '%'" />
                </template>
            </grid-table>

            <grid-table inline :columns="maxFindsColumns" :items="maxFindsItems">
                <template #cell-key="{ value }">
                    <template v-if="value == 'metal'">
                        <o-resource resource="metal" size="24px" />
                        <span v-text="$i18n.$n(finds.large[finds.large.length - 1].metal)" />
                    </template>
                    <template v-else-if="value == 'crystal'">
                        <o-resource resource="crystal" size="24px" />
                        <span v-text="$i18n.$n(finds.large[finds.large.length - 1].crystal)" />
                    </template>
                    <template v-else-if="value == 'deuterium'">
                        <o-resource resource="deuterium" size="24px" />
                        <span v-text="$i18n.$n(finds.large[finds.large.length - 1].deuterium)" />
                    </template>
                    <template v-else-if="value == 'shipUnits'">
                        <o-ship :ship="ShipType.battleship" size="24px" />
                        <span v-text="$i18n.$n(finds.large[finds.large.length - 1].shipUnits)" />
                    </template>
                </template>
            </grid-table>

            <grid-table inline :columns="darkMatterColumns" :items="darkMatterItems">
                <template #cell-size="{ value }">
                    <expedition-size-icon :size="value" class="scaled-icon" />
                </template>
                <template #cell-amount="{ item }">
                    <o-resource resource="dark-matter" size="24px" />
                    <span v-text="`${$i18n.$n(item.amount[0])} - ${$i18n.$n(item.amount[1])}`" />
                </template>
            </grid-table>
        </div>

        <hr />

        <h3 v-text="$i18n.$t.extension.expeditions.possibleFinds.listOfPossibleFinds" />
        <div class="find-col" v-for="size in sizes" :key="size">
            <h3 class="table-title">
                <expedition-size-icon :size="size" />
                <span v-text="$i18n.$t.extension.expeditions.possibleFinds.findSizes($i18n.$t.extension.expeditions.expeditionEventSizes[size])" />
            </h3>
            <grid-table inline :items="finds[size]" :columns="columns" :style="`--color: ${sizeColors[size]}`">
                <template v-slot:[`cell-.+`]="{ value }">
                    <span v-text="$i18n.$n(value)" />
                </template>
            </grid-table>
        </div>
    </div>
</template>

<script lang="ts">
    import { ExpeditionEventSize, ExpeditionEventSizes } from '@/shared/models/expeditions/ExpeditionEventSize';
    import { PlayerClass } from '@/shared/models/ogame/classes/PlayerClass';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { createMappedRecord, createRecord } from '@/shared/utils/createRecord';
    import { Component, Vue } from 'vue-property-decorator';
    import { GridTableColumn } from '../../../components/common/GridTable.vue';
    import { EmpireDataModule } from '../../../data/EmpireDataModule';
    import { SettingsDataModule } from '../../../data/SettingsDataModule';
    import { getRGBString } from '../../../utils/getRGBString';
    import ExpeditionSizeIcon from '@/views/stats/components/expeditions/ExpeditionSizeIcon.vue';
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { ClassBonusLifeformTechnologies, ExpeditionBonusLifeformTechnologies } from '@/shared/models/ogame/lifeforms/technologies/LifeformTechnologies';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { getPlanetLifeformTechnologyBoost } from '../../../models/lifeforms';
    import { LifeformType } from '@/shared/models/ogame/lifeforms/LifeformType';
    import { getLifeformLevelTechnologyBonus } from '@/shared/models/ogame/lifeforms/experience';
    import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
    import { getExpeditionFindFactor } from '@/shared/models/expeditions/getExpeditionFindFactor';
    import { findBaseAmounts } from '@/shared/models/expeditions/findBaseAmounts';
    import { ExpeditionFindableShipTypes } from "@/shared/models/expeditions/ExpeditionEvents";
    import { ShipByTypes } from "@/shared/models/ogame/ships/ShipTypes";
    import { getMsuOrDsu } from "@/views/stats/models/settings/getMsuOrDsu";


    type FindableUnits = {
        metal: number;
        crystal: number;
        deuterium: number;
        shipUnits: number;
        maxShipUnitsConverted: number;
    };

    @Component({
        components: {
            ExpeditionSizeIcon,
        }
    })
    export default class MaxFinds extends Vue {

        private readonly ShipType = ShipType;
        private readonly ExpeditionEventSize = ExpeditionEventSize;
        private readonly sizes = ExpeditionEventSizes;

        private readonly percentageFormat: Intl.NumberFormatOptions = {
            maximumFractionDigits: 3,
            minimumFractionDigits: 3,
        };

        private get sizeColors(): Record<ExpeditionEventSize, string> {
            const colors = SettingsDataModule.settings.colors.expeditions.sizes;

            return {
                [ExpeditionEventSize.small]: getRGBString(colors.small)!,
                [ExpeditionEventSize.medium]: getRGBString(colors.medium)!,
                [ExpeditionEventSize.large]: getRGBString(colors.large)!,
            };
        }

        private get columns(): GridTableColumn<keyof FindableUnits>[] {
            return [
                {
                    key: 'metal',
                    label: this.$i18n.$t.ogame.resources.metal,
                },
                {
                    key: 'crystal',
                    label: this.$i18n.$t.ogame.resources.crystal,
                },
                {
                    key: 'deuterium',
                    label: this.$i18n.$t.ogame.resources.deuterium,
                },
                {
                    key: 'shipUnits',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.shipUnits,
                },
                {
                    key: 'maxShipUnitsConverted',
                    label: 'LOCA: Max. Ship Units (MSU)',
                },
            ];
        }

        private get infoColumns(): GridTableColumn<'label' | 'value'>[] {
            return [
                { key: 'label' },
                { key: 'value' },
            ];
        }
        private get infoItems(): { type: 'playerClass' | 'percentage' | 'number'; label: string; value: number | PlayerClass }[] {
            const info = this.info;

            return [
                {
                    type: 'playerClass',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.info.playerClass,
                    value: info.playerClass,
                },
                {
                    type: 'number',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.info.economySpeed,
                    value: info.ecoSpeed,
                },
                {
                    type: 'percentage',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.info.resourceFindBonus,
                    value: info.resourceFindBonus,
                },
                {
                    type: 'percentage',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.info.shipFindBonus,
                    value: info.shipFindBonus,
                },
                {
                    type: 'percentage',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.info.darkMatterFindBonus,
                    value: info.darkMatterBonus,
                },
                {
                    type: 'percentage',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.info.discovererBonus,
                    value: info.discovererBonus,
                },
            ];
        }

        private get maxFindsColumns(): GridTableColumn<'key'>[] {
            return [
                {
                    key: 'key',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.maximumFinds,
                    style: {
                        'justify-content': 'space-between',
                        'gap': '4px',
                    },
                },
            ];
        }
        private get maxFindsItems(): { key: keyof FindableUnits }[] {
            return [
                { key: 'metal' },
                { key: 'crystal' },
                { key: 'deuterium' },
                { key: 'shipUnits' },
                { key: 'maxShipUnitsConverted' },
            ];
        }

        private get darkMatterColumns(): GridTableColumn<'size' | 'amount'>[] {
            return [
                { key: 'size' },
                {
                    key: 'amount',
                    label: this.$i18n.$t.extension.expeditions.possibleFinds.findsDarkMatter,
                    style: {
                        'justify-content': 'start',
                        'gap': '6px',
                    },
                },
            ];
        }
        private get darkMatterItems(): { size: ExpeditionEventSize, amount: [min: number, max: number] }[] {
            const factor = 1 + this.info.darkMatterBonus;

            return [
                {
                    size: ExpeditionEventSize.small,
                    amount: [300, 400].map(x => Math.trunc(x * factor)) as [number, number],
                },
                {
                    size: ExpeditionEventSize.medium,
                    amount: [500, 700].map(x => Math.trunc(x * factor)) as [number, number],
                },
                {
                    size: ExpeditionEventSize.large,
                    amount: [1000, 1800].map(x => Math.trunc(x * factor)) as [number, number],
                },
            ];
        }

        private get info() {
            const empire = EmpireDataModule.empire;

            const planets = Object.values(empire.planets).filter(p => !p.isMoon) as PlanetData[];
            const planetBuildingBoosts = createMappedRecord(
                planets,
                planet => planet.id,
                planet => getPlanetLifeformTechnologyBoost(planet),
            );

            const resourceFindBonus = ExpeditionBonusLifeformTechnologies.reduce((total, tech) => {
                let techBonus = 0;
                planets.forEach(planet => {
                    const level = planet.activeLifeformTechnologies.includes(tech.type)
                        ? planet.lifeformTechnologies[tech.type]
                        : 0;

                    const baseBonus = tech.getExpeditionBonus(ExpeditionEventType.resources, level);
                    const levelBonus = planet.activeLifeform == LifeformType.none
                        ? 0
                        : baseBonus * getLifeformLevelTechnologyBonus(EmpireDataModule.lifeformExperience[planet.activeLifeform]);
                    const buildingBonus = baseBonus * planetBuildingBoosts[planet.id];

                    const total = baseBonus + levelBonus + buildingBonus;
                    techBonus += total;
                });

                return total + techBonus;
            }, 0);

            const shipFindBonus = ExpeditionBonusLifeformTechnologies.reduce((total, tech) => {
                let techBonus = 0;
                planets.forEach(planet => {
                    const level = planet.activeLifeformTechnologies.includes(tech.type)
                        ? planet.lifeformTechnologies[tech.type]
                        : 0;

                    const baseBonus = tech.getExpeditionBonus(ExpeditionEventType.fleet, level);
                    const levelBonus = planet.activeLifeform == LifeformType.none
                        ? 0
                        : baseBonus * getLifeformLevelTechnologyBonus(EmpireDataModule.lifeformExperience[planet.activeLifeform]);
                    const buildingBonus = baseBonus * planetBuildingBoosts[planet.id];

                    const total = baseBonus + levelBonus + buildingBonus;
                    techBonus += total;
                });

                return total + techBonus;
            }, 0);

            const darkMatterBonus = ExpeditionBonusLifeformTechnologies.reduce((total, tech) => {
                let techBonus = 0;
                planets.forEach(planet => {
                    const level = planet.activeLifeformTechnologies.includes(tech.type)
                        ? planet.lifeformTechnologies[tech.type]
                        : 0;

                    const baseBonus = tech.getExpeditionBonus(ExpeditionEventType.darkMatter, level);
                    const levelBonus = planet.activeLifeform == LifeformType.none
                        ? 0
                        : baseBonus * getLifeformLevelTechnologyBonus(EmpireDataModule.lifeformExperience[planet.activeLifeform]);
                    const buildingBonus = baseBonus * planetBuildingBoosts[planet.id];

                    const total = baseBonus + levelBonus + buildingBonus;
                    techBonus += total;
                });

                return total + techBonus;
            }, 0);

            const discovererBonus = ClassBonusLifeformTechnologies.reduce((total, tech) => {
                let techBonus = 0;
                planets.forEach(planet => {
                    const level = planet.activeLifeformTechnologies.includes(tech.type)
                        ? planet.lifeformTechnologies[tech.type]
                        : 0;

                    const baseBonus = tech.getClassBonus(PlayerClass.discoverer, level);
                    const levelBonus = planet.activeLifeform == LifeformType.none
                        ? 0
                        : baseBonus * getLifeformLevelTechnologyBonus(EmpireDataModule.lifeformExperience[planet.activeLifeform]);
                    const buildingBonus = baseBonus * planetBuildingBoosts[planet.id];

                    const total = baseBonus + levelBonus + buildingBonus;
                    techBonus += total;
                });

                return total + techBonus;
            }, 0);

            return {
                playerClass: empire.playerClass,
                ecoSpeed: ServerSettingsDataModule.serverSettings.speed.economy,
                resourceFindBonus,
                shipFindBonus,
                discovererBonus,
                darkMatterBonus,
            };
        }

        private get finds(): Record<ExpeditionEventSize, FindableUnits[]> {
            const pathfinderFactor = 2;
            const info = this.info;

            const classFactor = info.playerClass == PlayerClass.discoverer
                ? info.ecoSpeed * (1.5 * (1 + info.discovererBonus))
                : 1;
            
            const topPointsFactors = getExpeditionFindFactor(ServerSettingsDataModule.serverSettings.topScore ?? 0);

            const maxConvertedShipCost = ExpeditionFindableShipTypes.map(shipType => {
                    const ship = ShipByTypes[shipType];
                    const cost = ship.cost;

                    const converted = getMsuOrDsu(cost);
                    const units = cost.metal + cost.crystal;

                    return {
                        converted,
                        units,
                        score: converted / units,
                    };
                }).sort((a,b) => b.score - a.score)[0];

            return createRecord(
                ExpeditionEventSizes,
                size => findBaseAmounts[size].map<FindableUnits>(base => {
                    const metal = topPointsFactors * base * pathfinderFactor * classFactor * (1 + info.resourceFindBonus);
                    const shipUnits = topPointsFactors * base * pathfinderFactor * classFactor * (1 + info.shipFindBonus) / 2;
                    const maxShipUnitsConverted = Math.trunc(shipUnits / maxConvertedShipCost.units) * maxConvertedShipCost.converted;

                    return {
                        metal: Math.trunc(metal),
                        crystal: Math.trunc(metal / 2),
                        deuterium: Math.trunc(metal / 3),
                        shipUnits: Math.trunc(shipUnits),
                        maxShipUnitsConverted,
                    };
                }),
            );
        }
    }
</script>
<style lang="scss" scoped>
    .find-col {
        display: inline-flex;
        flex-direction: column;
        margin-right: 16px;
    }

    .table-title {
        display: flex;
        align-items: center;
        gap: 4px;

        .mdi {
            font-size: 24px;
        }
    }

    .small-tables {
        display: flex;
        gap: 16px;
        align-items: start;
    }
    .scaled-icon {
        transform: scale(1.6);
    }
</style>