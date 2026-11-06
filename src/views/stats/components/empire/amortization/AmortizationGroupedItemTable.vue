<template>
    <GridTable
        :items="groupedItems"
        :footerItems="footerItems"
        :columns="columns"
        sticky="100%"
        sticky-footer
        row-borders
    >
        <template #header-cost>
            <div class="cost-grid">
                <span v-text="translations().extension.empire.amortization.table.cost" style="grid-column: 2" />
                <OResource :resource="ResourceType.metal" style="grid-column: 1" />
                <OResource :resource="ResourceType.crystal" />
                <OResource :resource="ResourceType.deuterium" />
            </div>
        </template>

        <template #cell-planet="{ item }">
            <template v-if="item.type === 'planet-item'">
                <span v-if="item.planetId > 0" class="planet">
                    <span v-text="getPlanetName(item.planetId)" />
                    <span v-text="formatPlanetCoordinates(item.planetId)" />
                </span>
                <span v-else class="planet">
                    <span
                        v-text="
                            `${translations().extension.empire.amortization.settings.astrophysicsSettings.newColony} ${-item.planetId}`
                        "
                    />
                    <span v-text="`[-:-:${newColonyPosition}]`" />
                </span>
            </template>
        </template>

        <template #cell-item="{ item }">
            <div v-if="item.type == 'plasma-technology'" class="build-grid">TODO:</div>
            <div v-else class="build-grid">
                <template v-if="item.astrophysicsLevels.length > 0">
                    <OResearch :research="ResearchType.astrophysics" size="36px" />
                    <span class="name-and-level">
                        <span v-text="translations().ogame.research[ResearchType.astrophysics]" />
                        <span v-if="item.astrophysicsLevels.length == 1" v-text="item.astrophysicsLevels[0]" />
                        <span
                            v-else
                            v-text="
                                `${item.astrophysicsLevels[0]} - ${item.astrophysicsLevels[item.astrophysicsLevels.length - 1]}`
                            "
                        />
                    </span>
                </template>

                <template v-for="lfBuilding in LifeformBuildingTypes">
                    <template v-if="item.lifeformBuildings[lfBuilding].length > 0">
                        <OLifeformBuilding :building="lfBuilding" size="36px" :key="`image-${lfBuilding}`" />
                        <span class="name-and-level" :key="`level-${lfBuilding}`">
                            <span v-text="translations().ogame.lifeformBuildings[lfBuilding]" />
                            <span
                                v-if="item.lifeformBuildings[lfBuilding].length == 1"
                                v-text="item.lifeformBuildings[lfBuilding][0]"
                            />
                            <span
                                v-else
                                v-text="
                                    `${item.lifeformBuildings[lfBuilding][0]} - ${
                                        item.lifeformBuildings[lfBuilding][
                                            item.lifeformBuildings[lfBuilding].length - 1
                                        ]
                                    }`
                                "
                            />
                        </span>
                    </template>
                </template>

                <template v-for="mine in mineBuildingTypes">
                    <template v-if="item.mines[mine].length > 0">
                        <OBuilding :building="mine" size="36px" :key="`image-${mine}`" />
                        <span class="name-and-level" :key="`level-${mine}`">
                            <span v-text="translations().ogame.buildings[mine]" />
                            <span v-if="item.mines[mine].length == 1" v-text="item.mines[mine][0]" />
                            <span
                                v-else
                                v-text="`${item.mines[mine][0]} - ${item.mines[mine][item.mines[mine].length - 1]}`"
                            />
                        </span>
                    </template>
                </template>

                <template v-for="lfTech in LifeformTechnologyTypes">
                    <template v-if="item.lifeformTechnologies[lfTech].length > 0">
                        <OLifeformTechnology :technology="lfTech" size="36px" :key="`image-${lfTech}`" />
                        <span class="name-and-level" :key="`level-${lfTech}`">
                            <span v-text="translations().ogame.lifeformTechnologies[lfTech]" />
                            <span
                                v-if="item.lifeformTechnologies[lfTech].length == 1"
                                v-text="item.lifeformTechnologies[lfTech][0]"
                            />
                            <span
                                v-else
                                v-text="
                                    `${item.lifeformTechnologies[lfTech][0]} - ${
                                        item.lifeformTechnologies[lfTech][item.lifeformTechnologies[lfTech].length - 1]
                                    }`
                                "
                            />
                        </span>
                    </template>
                </template>
            </div>
        </template>

        <template #cell-cost="{ value }">
            <div class="cost-grid">
                <span v-text="formatNumber(value.metal)" :class="{ zero: value.metal == 0 }" />
                <span v-text="formatNumber(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                <span v-text="formatNumber(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
            </div>
        </template>

        <template #cell-costConverted="{ value }">
            <DecimalNumber :value="value" />
        </template>

        <template #footer-cost="{ value }">
            <div class="cost-grid">
                <span v-text="formatNumber(value.metal)" :class="{ zero: value.metal == 0 }" />
                <span v-text="formatNumber(value.crystal)" :class="{ zero: value.crystal == 0 }" />
                <span v-text="formatNumber(value.deuterium)" :class="{ zero: value.deuterium == 0 }" />
            </div>
        </template>

        <template #footer-costConverted="{ value }">
            <DecimalNumber :value="value" />
        </template>
    </GridTable>
</template>

<script setup lang="ts">
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import DecimalNumber from '@stats/components/common/DecimalNumber.vue';
import GridTable from '@stats/components/common/GridTable.vue';
import OBuilding from '@stats/components/ogame/OBuilding.vue';
import OLifeformBuilding from '@stats/components/ogame/OLifeformBuilding.vue';
import OLifeformTechnology from '@stats/components/ogame/OLifeformTechnology.vue';
import OResearch from '@stats/components/ogame/OResearch.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import { computed } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import type { PropType } from 'vue';
import type { GroupedAmortizationItem } from '@stats/models/empire/amortization';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import type { MineBuildingType } from '@ogame-tracker/shared/models/empire/amortization/models';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { LifeformBuildingTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformBuildingType';
import { LifeformTechnologyTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformTechnologyType';
import type { GridTableColumn } from '../../common/GridTable.vue';
import { addCost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import type { Cost } from '@ogame-tracker/shared/models/ogame/common/Cost';
import { useSettingsStore } from '@stats/data/SettingsDataModule';

interface TableItem {
    planet?: number;
    item: GroupedAmortizationItem;
    cost: Cost;
    costConverted: number;
}

defineProps({
    groupedItems: { required: true, type: Array as PropType<GroupedAmortizationItem[]> },
    newColonyPosition: { required: true, type: Number },
});

const settingsStore = useSettingsStore();

const empireStore = useEmpireStore();

const mineBuildingTypes: MineBuildingType[] = [
    BuildingType.metalMine,
    BuildingType.crystalMine,
    BuildingType.deuteriumSynthesizer,
];

const columns = computed<GridTableColumn<keyof TableItem>[]>(() => {
    return [
        {
            key: 'planet',
            label: translations().extension.empire.planet,
            size: 'auto',
        },
        {
            key: 'item',
            label: translations().extension.empire.amortization.table.levels,
            size: '1fr',
        },
        {
            key: 'cost',
            label: translations().extension.empire.amortization.table.cost,
            size: '3fr',
        },
        {
            key: 'costConverted',
            label: `${translations().extension.empire.amortization.table.cost} (${
                settingsStore.settings.conversionRates.mode == 'msu'
                    ? translations().extension.common.msu
                    : translations().extension.common.dsu
            })`,
            size: '1fr',
        },
    ];
});

const footerItems = computed<[TableItem]>(() => {
    return [
        {
            item: null!,

            cost: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
            costConverted: 0,
            /* TODO: total best cost after reduction
        cost: props.groupedItems.reduce<Cost>(
            (total, cur) => addCost(total, cur.cost),
            { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
        ),
        costConverted: props.groupedItems.reduce<number>(
            (total, cur) => total + cur.costConverted,
            0,
        ),
        */
        },
    ];
});

function getPlanetName(id: number): string {
    return (
        empireStore.empire.planets[id]?.name
        ?? `${translations().extension.empire.amortization.saveLoad.abandonedPlanet} (${id})`
    );
}

function formatPlanetCoordinates(id: number): string {
    const coordinates = empireStore.empire.planets[id]?.coordinates as Coordinates | undefined;
    if (coordinates == null) {
        return '';
    }

    return formatCoordinates(coordinates);
}

function formatCoordinates(coordinates: Coordinates): string {
    return `[${coordinates.galaxy}:${coordinates.system}:${coordinates.position}]`;
}
</script>

<style lang="scss" scoped>
.cost-grid {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(3, 1fr);
    justify-items: end;
}

.name-and-level {
    display: grid;
    text-align: left;
    justify-self: start;
}

.build-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px;
    align-items: center;
}

.planet {
    display: grid;
    justify-self: end;
}
</style>
