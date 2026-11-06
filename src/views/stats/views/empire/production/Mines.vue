<template>
    <grid-table :columns="columns" :items="items" :footerItems="footerItems">
        <template #header-metalMine>
            <o-building :building="BuildingType.metalMine" size="75px" />
        </template>
        <template #header-crystalMine>
            <o-building :building="BuildingType.crystalMine" size="75px" />
        </template>
        <template #header-deuteriumSynthesizer>
            <o-building :building="BuildingType.deuteriumSynthesizer" size="75px" />
        </template>
        <template #header-solarPlant>
            <o-building :building="BuildingType.solarPlant" size="75px" />
        </template>
        <template #header-fusionReactor>
            <o-building :building="BuildingType.fusionReactor" size="75px" />
        </template>

        <template #header-crawlers>
            <o-ship :ship="ShipType.crawler" size="75px" />
        </template>

        <template #cell-planet="{ value: planet }">
            <div class="planet-info">
                <span v-text="planet.name" />
                <span> [{{ planet.coordinates.galaxy }}:{{ planet.coordinates.system }}:{{ planet.coordinates.position }}] </span>
            </div>
        </template>

        <template #cell-crawlers="{ value }">
            <div class="crawlers">
                <span>
                    <span
                        v-text="formatNumber(value.active)"
                        :class="{
                            'crawlers-good': value.active == value.maximum,
                            'crawlers-ok': value.active > 0 && value.active < value.maximum,
                            'crawlers-bad': value.active == 0,
                        }"
                    />
                    <span>/{{ formatNumber(value.maximum) }}</span>
                </span>
                <span v-text="`(${formatNumber(value.available)} ${translations().extension.empire.production.mines.crawlersAvailable})`" />
            </div>
        </template>

        <template #footer-planet>⌀</template>

        <template #footer-metalMine="{ value }">
            <span v-text="formatNumber(value, avgNumberFormat)" />
        </template>

        <template #footer-crystalMine="{ value }">
            <span v-text="formatNumber(value, avgNumberFormat)" />
        </template>

        <template #footer-deuteriumSynthesizer="{ value }">
            <span v-text="formatNumber(value, avgNumberFormat)" />
        </template>

        <template #footer-solarPlant="{ value }">
            <span v-text="formatNumber(value, avgNumberFormat)" />
        </template>

        <template #footer-fusionReactor="{ value }">
            <span v-text="formatNumber(value, avgNumberFormat)" />
        </template>

        <template #footer-crawlers="{ value }">
            <div class="crawlers">
                <span
                    v-text="formatNumber(value.active, avgNumberFormat)"
                    :class="{
                        'crawlers-good': value.active == value.maximum,
                        'crawlers-ok': value.active > 0 && value.active < value.maximum,
                        'crawlers-bad': value.active == 0,
                    }"
                />
                <span v-text="`(${formatNumber(value.available, avgNumberFormat)} ${translations().extension.empire.production.mines.crawlersAvailable})`" />
                <span
                    style="grid-column: 1 / span 2"
                    v-text="translations().extension.empire.production.mines.crawlersToReachLimit(formatNumber(effectiveCrawlerLimit))"
                />
            </div>
        </template>
    </grid-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import type { PlanetData } from '@ogame-tracker/shared/models/empire/PlanetData';
import { useEmpireStore } from '@stats/data/EmpireDataModule';
import type { Coordinates } from '@ogame-tracker/shared/models/ogame/common/Coordinates';
import type { GridTableColumn } from '@stats/components/common/GridTable.vue';
import { BuildingType } from '@ogame-tracker/shared/models/ogame/buildings/BuildingType';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import type { LocalPlayerData } from '@ogame-tracker/shared/models/empire/LocalPlayerData';
import { PlanetType } from '@ogame-tracker/shared/models/ogame/common/PlanetType';
import { useServerSettingsStore } from '@stats/data/ServerSettingsDataModule';
import { getLifeformCollectorClassBonus } from '@ogame-tracker/shared/models/ogame/lifeforms/buildings/getLifeformCollectorClassBonus';
import { getMaxActiveCrawlers } from '@ogame-tracker/shared/models/ogame/resource-production/getMaxActiveCrawlers';
import { PlayerClass } from '@ogame-tracker/shared/models/ogame/classes/PlayerClass';
import { getCrawlerCountForMaximumBoost } from '@ogame-tracker/shared/models/ogame/resource-production/getCrawlerCountForMaximumBoost';
import { getProductionBreakdowns } from '@stats/models/empire/production';

interface ProductionMineItem {
    planet: {
        name: string;
        coordinates: Coordinates;
    };

    metalMine: number;
    crystalMine: number;
    deuteriumSynthesizer: number;
    solarPlant: number;
    fusionReactor: number;

    crawlers: {
        active: number;
        maximum: number;
        available: number;
    };
}

const serverSettingsStore = useServerSettingsStore();

const empireStore = useEmpireStore();

const avgNumberFormat: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

const serverSettings = computed(() => serverSettingsStore.serverSettings);

const effectiveCrawlerLimit = computed(() => {
    const bonus = getProductionBreakdowns(player.value, empireStore.lifeformExperience).metal
        .getLifeformBonusFactors()
        .lifeformTechnologyCrawlerProductionBonusFactor;

    return getCrawlerCountForMaximumBoost({
        playerClass: player.value.playerClass,
        lifeformTechnologies: {
            collectorClassBonus: collectorBonus.value,
            crawlerProductionBonus: bonus,
        },
        serverSettings: {
            geologistActiveCrawlerFactorBonus: serverSettings.value.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
            collectorCrawlerProductionFactorBonus: serverSettings.value.playerClasses.collector.crawlers.productionFactorBonus,
            crawlerProductionFactorPerUnit: serverSettings.value.playerClasses.crawlers.productionBoostFactorPerUnit,
            crawlerMaxProductionFactor: serverSettings.value.playerClasses.crawlers.maxProductionFactor,
        },
    });
});

const columns = computed<GridTableColumn<keyof ProductionMineItem>[]>(() => {
    return [
        {
            key: 'planet',
            label: translations().extension.empire.planet,
            size: '1fr',
        },
        { key: 'metalMine', size: '1fr' },
        { key: 'crystalMine', size: '1fr' },
        { key: 'deuteriumSynthesizer', size: '1fr' },
        { key: 'solarPlant', size: '1fr' },
        { key: 'fusionReactor', size: '1fr' },

        { key: 'crawlers' },
    ];
});

const footerItems = computed<ProductionMineItem[]>(() => {
    const item: ProductionMineItem = {
        planet: { name: '⌀', coordinates: { galaxy: 0, system: 0, position: 0, type: PlanetType.planet } },
        metalMine: 0,
        crystalMine: 0,
        deuteriumSynthesizer: 0,
        solarPlant: 0,
        fusionReactor: 0,
        crawlers: {
            active: 0,
            maximum: 0,
            available: 0,
        },
    };

    const localItems = items.value;
    const result = localItems.reduce((acc, item) => {
        acc.metalMine += item.metalMine / localItems.length;
        acc.crystalMine += item.crystalMine / localItems.length;
        acc.deuteriumSynthesizer += item.deuteriumSynthesizer / localItems.length;
        acc.solarPlant += item.solarPlant / localItems.length;
        acc.fusionReactor += item.fusionReactor / localItems.length;

        acc.crawlers.active += item.crawlers.active / localItems.length;
        acc.crawlers.maximum += item.crawlers.maximum / localItems.length;
        acc.crawlers.available += item.crawlers.available / localItems.length;

        return acc;
    }, item);

    return [result];
});

const collectorBonus = computed(() => getLifeformCollectorClassBonus(player.value));

const items = computed<ProductionMineItem[]>(() => {
    return planets.value
        .map(planet => {
            const maxActiveCrawlers = getMaxActiveCrawlers(
                planet.buildings[BuildingType.metalMine],
                planet.buildings[BuildingType.crystalMine],
                planet.buildings[BuildingType.deuteriumSynthesizer],
                player.value.playerClass == PlayerClass.collector,
                player.value.officers.geologist,
                serverSettingsStore.serverSettings.playerClasses.collector.crawlers.geologistActiveCrawlerFactorBonus,
                collectorBonus.value,
            );
            const availableCrawlers = planet.ships[ShipType.crawler];

            return {
                planet,
                metalMine: planet.buildings[BuildingType.metalMine],
                crystalMine: planet.buildings[BuildingType.crystalMine],
                deuteriumSynthesizer: planet.buildings[BuildingType.deuteriumSynthesizer],
                solarPlant: planet.buildings[BuildingType.solarPlant],
                fusionReactor: planet.buildings[BuildingType.fusionReactor],
                crawlers: {
                    available: availableCrawlers,
                    maximum: maxActiveCrawlers,
                    active: Math.min(availableCrawlers, maxActiveCrawlers),
                },
            };
        });
});

const player = computed<LocalPlayerData>(() => empireStore.empire);

const planets = computed<PlanetData[]>(() => {
    return Object.values(empireStore.empire.planets)
        .filter(planet => !planet.isMoon)
        .sort((a, b) => empireStore.empire.planetOrder.indexOf(a.id) - empireStore.empire.planetOrder.indexOf(b.id)) as PlanetData[];
});
</script>

<style lang="scss" scoped>
    .crawlers {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
        column-gap: 8px;
        justify-items: end;

        &-good {
            color: #4caf50;
        }
        &-ok {
            color: #ffc107;
        }
        &-bad {
            color: #dd2c00;
        }
    }

    .planet-info {
        display: grid;
        grid-template-columns: 1fr auto;
        justify-items: end;
        column-gap: 8px;
    }
</style>
