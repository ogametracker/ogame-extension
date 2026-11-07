<template>
    <div class="table-container">
        <div
            style="
                grid-column: 1 / span 2;
                display: grid;
                grid-template-rows: auto 1fr;
                max-height: 100%;
                overflow: hidden;
            "
        >
            <div>
                <button @click="showProductionSettings = !showProductionSettings">
                    <span class="mdi mdi-cogs" />
                    <span class="mdi mdi-menu-down" v-if="!showSettings" />
                    <span class="mdi mdi-menu-up" v-else />

                    <span
                        v-if="!showProductionSettings"
                        v-text="translations().extension.empire.production.settings.header"
                    />
                    <span v-else v-text="translations().extension.empire.production.settings.applyAndClose" />
                </button>
                <button @click="resetProductionSettings()" class="ml-2">
                    <span class="mdi mdi-refresh" />
                    <span v-text="translations().extension.empire.production.settings.reset" />
                </button>
            </div>

            <div v-show="showProductionSettings" class="mt-2" style="overflow: auto">
                <div style="display: flex; gap: 8px; flex-wrap: wrap">
                    <AmortizationPlayerSettingsInputs
                        v-model="playerSettings"
                        :lifeform-levels="playerSettings.lifeformLevels"
                        production-mode
                        style="height: max-content; margin-top: 44px"
                    />

                    <AmortizationPlanetSettingsInputs
                        v-for="planetSetting in planetSettings"
                        :key="planetSetting.id"
                        :model-value="planetSetting"
                        :planet-data="empire.planets[planetSetting.id] as PlanetData"
                        production-mode
                    />
                </div>
            </div>
        </div>

        <div
            v-text="translations().extension.empire.production.messageProduction100"
            style="grid-column: 1 / span 2"
            v-show="!showProductionSettings"
        />
        <GridTable
            :columns="columns"
            :items="items"
            sticky="100%"
            :footerItems="footerItems"
            class="resources-production-table"
            :style="`--item-count: ${maxItemCount}`"
            v-show="!showProductionSettings"
        >
            <template #header-metal>
                <OResource :resource="ResourceType.metal" size="75px" />
            </template>
            <template #header-crystal>
                <OResource :resource="ResourceType.crystal" size="75px" />
            </template>
            <template #header-deuterium>
                <OResource :resource="ResourceType.deuterium" size="75px" />
            </template>
            <template #header-total> {{ translations().extension.common.resourceUnits }} </template>
            <template #header-totalConverted>
                {{ `${translations().extension.common.resourceUnits} (${conversionModeText})` }}
            </template>

            <template #header-productionSettings>
                <div class="production-settings-mini-table">
                    <span class="header" v-text="translations().extension.empire.production.activeProductionSettings" />
                    <OBuilding :building="BuildingType.metalMine" />
                    <OBuilding :building="BuildingType.crystalMine" />
                    <OBuilding :building="BuildingType.deuteriumSynthesizer" />
                    <OBuilding :building="BuildingType.solarPlant" />
                    <OBuilding :building="BuildingType.fusionReactor" />
                    <OShip :ship="ShipType.solarSatellite" />
                    <OShip :ship="ShipType.crawler" />
                    <span
                        style="grid-column: auto / span 4"
                        v-text="translations().extension.empire.production.items"
                    />
                </div>
            </template>

            <template #cell-planet="{ value: planet }">
                <div class="planet-info">
                    <span v-text="planet.name" />
                    <span>
                        [{{ planet.coordinates.galaxy }}:{{ planet.coordinates.system }}:{{
                            planet.coordinates.position
                        }}]
                    </span>
                    <span
                        class="mdi toggle-breakdown"
                        :class="showBreakdown[planet.id] ? 'mdi-menu-up' : 'mdi-menu-down'"
                        @click="toggleBreakdown(planet.id)"
                    />
                </div>
            </template>

            <template #cell-productionSettings="{ value: settings, item: prodItem }">
                <div class="production-settings-mini-table">
                    <span v-text="settings.metalMine" />
                    <span v-text="settings.crystalMine" />
                    <span v-text="settings.deuteriumSynthesizer" />
                    <span v-text="settings.solarPlant" />
                    <span v-text="settings.fusionReactor" />
                    <span v-text="settings.solarSatellite" />
                    <span v-text="settings.crawler" />

                    <template v-for="(item, i) in getActiveItems(prodItem)" :key="i">
                        <span v-if="item == null" />
                        <OItem v-else :item="item" size="24px" />
                    </template>
                </div>
            </template>

            <template #cell-breakdown="{ item }">
                <div v-if="showBreakdown[item.planet.id]" class="breakdown-list">
                    <div v-text="translations().extension.empire.production.breakdown.basicIncome" />
                    <div v-text="translations().extension.empire.production.breakdown.mineProduction" />
                    <div v-text="translations().extension.empire.production.breakdown.consumption" />
                    <div v-text="translations().extension.empire.production.breakdown.lifeformBuildings" />
                    <div v-text="translations().extension.empire.production.breakdown.crawlers" />
                    <div v-text="translations().ogame.research[ResearchType.plasmaTechnology]" />
                    <div v-text="translations().extension.empire.production.breakdown.items" />
                    <div v-text="translations().extension.empire.production.breakdown.geologist" />
                    <div v-text="translations().extension.empire.production.breakdown.commandStaff" />
                    <div v-text="translations().extension.empire.production.breakdown.playerClass" />
                    <div v-text="translations().extension.empire.production.breakdown.allianceClass" />
                    <div v-text="translations().extension.empire.production.breakdown.lifeformTechnologies" />
                    <div class="breakdown-sum" v-text="translations().extension.common.sum" />
                </div>
            </template>
            <template #cell-metal="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <DecimalNumber :value="value.baseProduction" />
                        <DecimalNumber :value="value.mineProduction" />
                        <DecimalNumber :value="0" />
                        <DecimalNumber :value="value.lifeformBuildingsProduction" />
                        <DecimalNumber :value="value.crawlerProduction" />
                        <DecimalNumber :value="value.plasmaTechnologyProduction" />
                        <DecimalNumber :value="value.itemProduction" />
                        <DecimalNumber :value="value.geologistProduction" />
                        <DecimalNumber :value="value.commandStaffProduction" />
                        <DecimalNumber :value="value.playerClassProduction" />
                        <DecimalNumber :value="value.allianceClassProduction" />
                        <DecimalNumber :value="value.lifeformTechnologiesProduction" />
                    </template>

                    <DecimalNumber class="breakdown-sum" :value="value.total" />
                </div>
            </template>
            <template #cell-crystal="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <DecimalNumber :value="value.baseProduction" />
                        <DecimalNumber :value="value.mineProduction" />
                        <DecimalNumber :value="0" />
                        <DecimalNumber :value="value.lifeformBuildingsProduction" />
                        <DecimalNumber :value="value.crawlerProduction" />
                        <DecimalNumber :value="value.plasmaTechnologyProduction" />
                        <DecimalNumber :value="value.itemProduction" />
                        <DecimalNumber :value="value.geologistProduction" />
                        <DecimalNumber :value="value.commandStaffProduction" />
                        <DecimalNumber :value="value.playerClassProduction" />
                        <DecimalNumber :value="value.allianceClassProduction" />
                        <DecimalNumber :value="value.lifeformTechnologiesProduction" />
                    </template>

                    <DecimalNumber class="breakdown-sum" :value="value.total" />
                </div>
            </template>
            <template #cell-deuterium="{ value, item }">
                <div class="breakdown-list" :class="showBreakdown[item.planet.id] ? 'breakdown-list--expanded' : null">
                    <template v-if="showBreakdown[item.planet.id]">
                        <DecimalNumber :value="value.baseProduction" />
                        <DecimalNumber :value="value.mineProduction" />
                        <DecimalNumber
                            :class="{ 'negative-value': -item.fusionReactorConsumption < 0 }"
                            :value="-item.fusionReactorConsumption"
                        />
                        <DecimalNumber :value="value.lifeformBuildingsProduction" />
                        <DecimalNumber :value="value.crawlerProduction" />
                        <DecimalNumber :value="value.plasmaTechnologyProduction" />
                        <DecimalNumber :value="value.itemProduction" />
                        <DecimalNumber :value="value.geologistProduction" />
                        <DecimalNumber :value="value.commandStaffProduction" />
                        <DecimalNumber :value="value.playerClassProduction" />
                        <DecimalNumber :value="value.allianceClassProduction" />
                        <DecimalNumber :value="value.lifeformTechnologiesProduction" />
                    </template>

                    <DecimalNumber class="breakdown-sum" :value="value.total - item.fusionReactorConsumption" />
                </div>
            </template>
            <template #cell-total="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value" />
                </div>
            </template>
            <template #cell-totalConverted="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value" />
                </div>
            </template>

            <template #footer-planet="{ value, item }">
                <span v-if="!item.isResourcePackageRow" v-text="value.name" />
                <span v-else class="resource-packages-cell">
                    <OItem item="resourcePackage_all" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.all" min="0" step="1" />

                    <OItem item="resourcePackage_metal" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.metal" min="0" step="1" />

                    <OItem item="resourcePackage_crystal" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.crystal" min="0" step="1" />

                    <OItem item="resourcePackage_deuterium" size="32px" hide-item-grade />
                    <input type="number" v-model.number="resourcePackageAmounts.deuterium" min="0" step="1" />
                </span>
            </template>
            <template #footer-metal="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value.total" />
                </div>
            </template>
            <template #footer-crystal="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value.total" />
                </div>
            </template>
            <template #footer-deuterium="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value.total" />
                </div>
            </template>
            <template #footer-total="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value" />
                </div>
            </template>
            <template #footer-totalConverted="{ value }">
                <div class="breakdown-list">
                    <DecimalNumber :value="value" />
                </div>
            </template>
        </GridTable>

        <FloatingMenu v-model="showSettings" left v-show="!showProductionSettings">
            <template #activator>
                <button @click="showSettings = !showSettings">
                    <span class="mdi mdi-cog" />
                </button>
            </template>

            <ShowConvertedResourcesInCellsSettings />
        </FloatingMenu>
    </div>
</template>

<script setup lang="ts">
import { ResourceType, ResourceTypes } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import DecimalNumber from '@stats/components/common/DecimalNumber.vue';
import FloatingMenu from '@stats/components/common/FloatingMenu.vue';
import GridTable from '@stats/components/common/GridTable.vue';
import OBuilding from '@stats/components/ogame/OBuilding.vue';
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import OShip from '@ogame-tracker/view-shared/components/ogame/OShip.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { translations } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { FusionReactor } from '@ogame-tracker/shared/models/ogame/buildings/FusionReactor';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';
import { Items, type ItemId } from '@ogame-tracker/shared/models/ogame/items/Items.generated';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import type { CrawlerProductionPercentage } from '@ogame-tracker/shared/models/empire/CrawlerProductionPercentage';
import { PlayerClass } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';
import type { PlanetProductionBreakdown } from '@ogame-tracker/shared/models/ogame/resource-production/types';
import { getMsuOrDsu } from '@stats/models/settings/getMsuOrDsu';
import { getProductionBreakdowns } from '@stats/models/empire/production';
import { ResearchType } from '@ogame-tracker/shared/models/ogame/research/ResearchType';
import type { LocalPlayerData } from '@ogame-tracker/shared/models/empire/LocalPlayerData';
import { createRecord } from '@ogame-tracker/shared/utils/createRecord';
import { ValidLifeformTypes } from '@ogame-tracker/shared/models/ogame/lifeforms/LifeformType';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { AmortizationPlayerSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationPlayerSettings';
import AmortizationPlanetSettingsInputs from '@stats/components/empire/amortization/AmortizationPlanetSettingsInputs.vue';
import AmortizationPlayerSettingsInputs from '@stats/components/empire/amortization/AmortizationPlayerSettingsInputs.vue';
import type { AmortizationPlanetSettings } from '@ogame-tracker/shared/models/empire/amortization/AmortizationPlanetSettings';
import { _throw } from '@ogame-tracker/shared/utils/_throw';
import { AllianceClass } from '@ogame-tracker/shared/models/ogame/classes/AllianceClass';
import {
    getLifeformExperienceNeededForLevel,
    getLifeformLevel,
} from '@ogame-tracker/shared/models/ogame/lifeforms/experience';

interface ProductionItem {
    planet: {
        id: number;
        name: string;
        coordinates: Coordinates;
    };
    metal: PlanetProductionBreakdown;
    crystal: PlanetProductionBreakdown;
    deuterium: PlanetProductionBreakdown;
    fusionReactorConsumption: number;
    total: number;
    totalConverted: number;

    productionSettings: ProductionSettingsItem;
    activeItems: ItemId[];

    isResourcePackageRow?: boolean;
}

interface ProductionSettingsItem {
    metalMine: number;
    crystalMine: number;
    deuteriumSynthesizer: number;
    solarPlant: number;
    fusionReactor: number;
    solarSatellite: number;
    crawler: number;
}

const empireStore = useEmpireStore();

const settingsStore = useSettingsStore();

const serverSettingsStore = useServerSettingsStore();

const showSettings = ref(false);

const showProductionSettings = ref(false);

const playerSettings = ref<AmortizationPlayerSettings>({
    optimizeForResources: [],
    officers: {
        admiral: false,
        commander: false,
        engineer: false,
        geologist: false,
        technocrat: false,
    },
    playerClass: PlayerClass.none,
    allianceClass: AllianceClass.none,
    levelPlasmaTechnology: 0,
    levelAstrophysics: 0,
    numberOfUnusedRaidColonySlots: 0,
    lifeformLevels: createRecord(ValidLifeformTypes, 0),
});

const planetSettings = ref<AmortizationPlanetSettings[]>([]);

function onPlayerClassSelectionChanged(newClass: PlayerClass) {
    if (!showProductionSettings.value) {
        return;
    }

    const isCollector = newClass == PlayerClass.collector;
    const percentage: CrawlerProductionPercentage = isCollector ? 150 : 100;

    planetSettings.value.forEach(p => {
        p.crawlers.percentage = percentage;
        p.crawlers.max = isCollector;
    });
}

function resetProductionSettings() {
    const localEmpire = empireStore.empire;

    playerSettings.value = {
        officers: { ...localEmpire.officers },
        playerClass: localEmpire.playerClass,
        allianceClass: localEmpire.allianceClass,
        levelPlasmaTechnology: localEmpire.research[ResearchType.plasmaTechnology],
        lifeformLevels: createRecord(ValidLifeformTypes, lf => getLifeformLevel(empireStore.lifeformExperience[lf])),

        // don't matter
        optimizeForResources: [],
        levelAstrophysics: 0,
        numberOfUnusedRaidColonySlots: 0,
    };
    planetSettings.value = getPlanetSettings();
}

const empire = computed<LocalPlayerData>(() => {
    const localEmpire = JSON.parse(JSON.stringify(empireStore.empire)) as LocalPlayerData;
    localEmpire.playerClass = playerSettings.value.playerClass;
    localEmpire.allianceClass = playerSettings.value.allianceClass;
    localEmpire.officers = playerSettings.value.officers;
    localEmpire.research[ResearchType.plasmaTechnology] = playerSettings.value.levelPlasmaTechnology;

    planetSettings.value.forEach(ps => {
        const planet = localEmpire.planets[ps.id] as PlanetData;
        planet.maxTemperature = ps.maxTemperature;
        planet.coordinates.position = ps.position;
        planet.activeItems = createRecord(ps.activeItems, 'permanent');
        planet.buildings[BuildingType.metalMine] = ps.mines?.metalMine ?? _throw('no metal mine level');
        planet.buildings[BuildingType.crystalMine] = ps.mines?.crystalMine ?? _throw('no crystal mine level');
        planet.buildings[BuildingType.deuteriumSynthesizer] =
            ps.mines?.deuteriumSynthesizer ?? _throw('no deuterium synthesizer level');
        planet.ships[ShipType.crawler] = ps.crawlers.max ? 10_000 : ps.crawlers.count;
        planet.productionSettings[ShipType.crawler] = ps.crawlers.percentage;
        planet.activeLifeform = ps.lifeform;
        planet.activeLifeformTechnologies = ps.activeLifeformTechnologies;
        planet.lifeformTechnologies = {
            ...planet.lifeformTechnologies,
            ...ps.lifeformTechnologyLevels,
        };
        planet.lifeformBuildings = {
            ...planet.lifeformBuildings,
            ...ps.lifeformBuildingLevels,
        };
    });

    return localEmpire;
});

const resourcePackageAmounts = ref({
    all: 0,
    metal: 0,
    crystal: 0,
    deuterium: 0,
});

const conversionModeText = computed(() => {
    return settingsStore.settings.conversionRates.mode == 'msu'
        ? translations().extension.common.msu
        : translations().extension.common.dsu;
});

function getPlanetSettings(): AmortizationPlanetSettings[] {
    const isCollector = playerSettings.value.playerClass == PlayerClass.collector;

    return planets.value.map<AmortizationPlanetSettings>(planet => ({
        include: true,
        ignoreEmptyLifeformTechnologySlots: false,

        id: planet.id,
        name: planet.name,
        position: planet.coordinates.position,
        coordinates: planet.coordinates,
        maxTemperature: planet.maxTemperature,
        activeItems: Object.keys(planet.activeItems) as ItemId[],
        lifeform: planet.activeLifeform,
        activeLifeformTechnologies: [...planet.activeLifeformTechnologies],
        lifeformBuildingLevels: { ...planet.lifeformBuildings },
        lifeformTechnologyLevels: { ...planet.lifeformTechnologies },
        mines: {
            metalMine: planet.buildings[BuildingType.metalMine],
            crystalMine: planet.buildings[BuildingType.crystalMine],
            deuteriumSynthesizer: planet.buildings[BuildingType.deuteriumSynthesizer],
        },
        crawlers: {
            percentage:
                !isCollector && planet.productionSettings[ShipType.crawler] > 100
                    ? 100
                    : planet.productionSettings[ShipType.crawler],
            count: planet.ships[ShipType.crawler],
            max: false,
        },
    }));
}

const columns = computed<GridTableColumn<keyof ProductionItem | 'breakdown'>[]>(() => {
    const result: GridTableColumn<keyof ProductionItem | 'breakdown'>[] = [
        {
            key: 'planet',
            label: translations().extension.empire.planet,
        },
        { key: 'breakdown', size: '200px' },
        { key: 'metal' },
        { key: 'crystal' },
        { key: 'deuterium' },
        {
            key: 'total',
            class: 'total-column',
        },
    ];

    if (settingsStore.settings.showCellsWithConvertedResourceUnits) {
        result.push({ key: 'totalConverted' });
    }

    result.push({
        key: 'productionSettings',
        class: 'production-settings-column',
        headerClass: 'production-settings-header-column',
        size: 'max-content',
    });

    return result;
});

const maxItemCount = computed(() =>
    items.value.reduce((max, item) => Math.max(max, item.activeItems.length), -Infinity),
);

const productionBreakdowns = computed(() => {
    const lifeformExperience = createRecord(ValidLifeformTypes, lf =>
        getLifeformExperienceNeededForLevel(playerSettings.value.lifeformLevels[lf]),
    );

    return getProductionBreakdowns(empire.value, lifeformExperience);
});

const fusionReactorConsumptions = computed<Record<number, number>>(() => {
    const result: Record<number, number> = {};

    planets.value.forEach(planet => {
        const fusionReactorConsumption = FusionReactor.getConsumption(planet.buildings[BuildingType.fusionReactor], {
            planet: {
                position: planet.coordinates.position,
                temperature: planet.maxTemperature,
            },
            productionSettings: {
                metalMine: planet.productionSettings[BuildingType.metalMine],
                crystalMine: planet.productionSettings[BuildingType.crystalMine],
                deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                fusionReactor: planet.productionSettings[BuildingType.fusionReactor],
            },
            serverSettings: {
                economySpeed: serverSettingsStore.serverSettings.speed.economy,
                crystalBoost: serverSettingsStore.serverSettings.resourceProduction.productionFactorBonus.crystal,
            },
        }).deuterium;

        result[planet.id] = fusionReactorConsumption;
    });

    return result;
});

const items = computed<ProductionItem[]>(() => {
    if (planetSettings.value.length == 0) {
        return [];
    }

    const localProductionBreakdowns = productionBreakdowns.value;
    const localFusionReactorConsumptions = fusionReactorConsumptions.value;

    return planets.value.map<ProductionItem>(planet => {
        const production = {
            metal: localProductionBreakdowns.metal.getProductionBreakdown(planet.id),
            crystal: localProductionBreakdowns.crystal.getProductionBreakdown(planet.id),
            deuterium: localProductionBreakdowns.deuterium.getProductionBreakdown(planet.id),
        };

        const settings = planetSettings.value.find(p => p.id == planet.id) ?? _throw('no planet settings found');

        return {
            planet,
            ...production,
            fusionReactorConsumption: localFusionReactorConsumptions[planet.id],
            total:
                production.metal.total
                + production.crystal.total
                + production.deuterium.total
                - localFusionReactorConsumptions[planet.id],
            totalConverted: getMsuOrDsu({
                metal: production.metal.total,
                crystal: production.crystal.total,
                deuterium: production.deuterium.total - localFusionReactorConsumptions[planet.id],
            }),

            productionSettings: {
                metalMine: planet.productionSettings[BuildingType.metalMine],
                crystalMine: planet.productionSettings[BuildingType.crystalMine],
                deuteriumSynthesizer: planet.productionSettings[BuildingType.deuteriumSynthesizer],
                solarPlant: planet.productionSettings[BuildingType.solarPlant],
                fusionReactor: planet.productionSettings[BuildingType.fusionReactor],

                solarSatellite: planet.productionSettings[ShipType.solarSatellite],
                crawler: settings.crawlers.percentage,
            },

            activeItems: settings.activeItems,
        };
    });
});

const footerItems = computed<ProductionItem[]>(() => {
    const localProductionBreakdowns = productionBreakdowns.value;
    const productionPerHour = localProductionBreakdowns.getTotal();

    const metalPerHour = productionPerHour.metal;
    const crystalPerHour = productionPerHour.crystal;
    const deuteriumPerHour =
        productionPerHour.deuterium
        - Object.values(fusionReactorConsumptions.value).reduce((total, cur) => total + cur, 0);
    const totalPerHour = metalPerHour + crystalPerHour + deuteriumPerHour;
    const totalConvertedPerHour = getMsuOrDsu({
        metal: metalPerHour,
        crystal: crystalPerHour,
        deuterium: deuteriumPerHour,
    });

    const metalPackages = metalPerHour * 24 * (resourcePackageAmounts.value.all + resourcePackageAmounts.value.metal);
    const crystalPackages =
        crystalPerHour * 24 * (resourcePackageAmounts.value.all + resourcePackageAmounts.value.crystal);
    const deuteriumPackages =
        deuteriumPerHour * 24 * (resourcePackageAmounts.value.all + resourcePackageAmounts.value.deuterium);

    return [
        {
            planet: {
                id: 0,
                name: translations().extension.empire.production.averagePerHour,
                coordinates: null!,
            },
            metal: { total: metalPerHour / planets.value.length } as PlanetProductionBreakdown,
            crystal: { total: crystalPerHour / planets.value.length } as PlanetProductionBreakdown,
            deuterium: { total: deuteriumPerHour / planets.value.length } as PlanetProductionBreakdown,
            fusionReactorConsumption: 0,
            total: totalPerHour / planets.value.length,
            totalConverted: totalConvertedPerHour / planets.value.length,

            productionSettings: null!,
            activeItems: [],
        },
        {
            planet: {
                id: 0,
                name: translations().extension.empire.production.totalPerHour,
                coordinates: null!,
            },
            metal: { total: metalPerHour } as PlanetProductionBreakdown,
            crystal: { total: crystalPerHour } as PlanetProductionBreakdown,
            deuterium: { total: deuteriumPerHour } as PlanetProductionBreakdown,
            fusionReactorConsumption: 0,
            total: totalPerHour,
            totalConverted: totalConvertedPerHour,

            productionSettings: null!,
            activeItems: [],
        },
        {
            planet: {
                id: 0,
                name: translations().extension.empire.production.totalPerDay,
                coordinates: null!,
            },
            metal: { total: metalPerHour * 24 } as PlanetProductionBreakdown,
            crystal: { total: crystalPerHour * 24 } as PlanetProductionBreakdown,
            deuterium: { total: deuteriumPerHour * 24 } as PlanetProductionBreakdown,
            fusionReactorConsumption: 0,
            total: totalPerHour * 24,
            totalConverted: totalConvertedPerHour * 24,

            productionSettings: null!,
            activeItems: [],
        },
        {
            planet: {
                id: 0,
                name: translations().extension.empire.production.totalPerWeek,
                coordinates: null!,
            },
            metal: { total: metalPerHour * 24 * 7 } as PlanetProductionBreakdown,
            crystal: { total: crystalPerHour * 24 * 7 } as PlanetProductionBreakdown,
            deuterium: { total: deuteriumPerHour * 24 * 7 } as PlanetProductionBreakdown,
            fusionReactorConsumption: 0,
            total: totalPerHour * 24 * 7,
            totalConverted: totalConvertedPerHour * 24 * 7,

            productionSettings: null!,
            activeItems: [],
        },
        {
            isResourcePackageRow: true,
            planet: {
                id: 0,
                name: 'row-for-resource-packages',
                coordinates: null!,
            },
            metal: { total: metalPackages } as PlanetProductionBreakdown,
            crystal: { total: crystalPackages } as PlanetProductionBreakdown,
            deuterium: { total: deuteriumPackages } as PlanetProductionBreakdown,
            fusionReactorConsumption: 0,
            total: metalPackages + crystalPackages + deuteriumPackages,
            totalConverted: getMsuOrDsu({
                metal: metalPackages,
                crystal: crystalPackages,
                deuterium: deuteriumPackages,
            }),

            productionSettings: null!,
            activeItems: [],
        },
    ];
});

const showBreakdown = ref<Record<number, boolean>>({});

function onPlanetsChanged() {
    planets.value.forEach(planet => {
        if (showBreakdown.value[planet.id] == null) {
            showBreakdown.value[planet.id] = false;
        }
    });
}

function toggleBreakdown(planetId: number) {
    showBreakdown.value[planetId] = !showBreakdown.value[planetId];
}

const planets = computed<PlanetData[]>(() => {
    return Object.values(empireStore.empire.planets)
        .filter(planet => !planet.isMoon)
        .sort(
            (a, b) => empireStore.empire.planetOrder.indexOf(a.id) - empire.value.planetOrder.indexOf(b.id),
        ) as PlanetData[];
});

function getActiveItems(item: ProductionItem): (ItemId | null)[] {
    const resourceItems = ResourceTypes.map(
        resource =>
            item.activeItems.find(id => {
                const effect = Items[id]?.effect;
                return (
                    effect?.type === 'resourceProductionBonus'
                    && effect.value[resource] != null
                    && Object.keys(effect.value).length === 1
                );
            }) ?? null,
    );
    const energyItem = item.activeItems.find(id => Items[id]?.effect?.type === 'energyProductionBonus');
    return [...resourceItems, energyItem ?? null];
}

watch(() => playerSettings.value.playerClass, onPlayerClassSelectionChanged);

watch(() => planets.value, onPlanetsChanged, { immediate: true });

onMounted(() => {
    resetProductionSettings();
});
</script>

<style lang="scss" scoped>
.resources-production-table {
    max-height: 100%;
    overflow: auto;

    :deep(.total-column) {
        border-left: 1px solid rgba(var(--color), 0.33);
    }

    :deep(.production-settings-column) {
        border-left: 3px double rgba(var(--color), 0.5);
    }
    :deep(.production-settings-header-column) {
        border-left: 3px solid transparent;
    }

    :deep(> .grid-table-foot > .grid-table-row:last-of-type > .grid-table-cell) {
        border-top: 3px double rgba(var(--color), 0.5);
    }
}

.planet-info {
    display: grid;
    grid-template-columns: 1fr auto auto;
    justify-items: end;
    column-gap: 8px;
    align-self: start;
}

.production-settings-mini-table {
    display: grid;
    grid-template-columns: repeat(7, 1fr) repeat(4, 24px);
    width: 100%;
    justify-items: center;
    align-items: center;
    gap: 8px;

    > .header {
        grid-column: 1 / span 11;
    }
    > * {
        padding: 0 4px;
    }
}

.resource-packages-cell {
    display: grid;
    grid-template-columns: repeat(2, auto);

    > input[type='number'] {
        width: 60px;
    }
}

.table-container {
    display: grid;
    column-gap: 4px;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto 1fr;
    align-items: start;
    height: 100%;
}

.toggle-breakdown {
    transform: scale(1.5);
    cursor: pointer;
}

.breakdown-list {
    display: flex;
    flex-direction: column;

    &--expanded .breakdown-sum {
        font-weight: bold;
        border-top: 1px solid rgba(var(--color), 0.5);
        margin-top: 1px;
    }

    .negative-value {
        color: rgb(209, 21, 21);
    }
}
</style>
