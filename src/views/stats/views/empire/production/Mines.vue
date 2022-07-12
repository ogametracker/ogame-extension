<template>
    <grid-table :columns="columns" :items="items" :footerItems="footerItems">
        <template #header-metalMine>
            <o-building building="metal-mine" size="75px" />
        </template>
        <template #header-crystalMine>
            <o-building building="crystal-mine" size="75px" />
        </template>
        <template #header-deuteriumSynthesizer>
            <o-building building="deuterium-synthesizer" size="75px" />
        </template>
        <template #header-solarPlant>
            <o-building building="solar-plant" size="75px" />
        </template>
        <template #header-fusionReactor>
            <o-building building="fusion-reactor" size="75px" />
        </template>

        <template #header-crawlers>
            <o-ship ship="crawler" size="75px" />
        </template>

        <template #cell-planet="{ value: planet }">
            <div class="planet-info">
                <span v-text="planet.name" />
                <span>
                    [{{ planet.coordinates.galaxy }}:{{
                        planet.coordinates.system
                    }}:{{ planet.coordinates.position }}]
                </span>
            </div>
        </template>

        <template #cell-crawlers="{ value }">
            <div class="crawlers">
                <span>
                    <span
                        v-text="$i18n.$n(value.active)"
                        :class="{
                            'crawlers-good': value.active == value.maximum,
                            'crawlers-ok':
                                value.active > 0 &&
                                value.active < value.maximum,
                            'crawlers-bad': value.active == 0,
                        }"
                    />
                    <span>/{{ $i18n.$n(value.maximum) }}</span>
                </span>
                <span
                    v-text="`(${$i18n.$n(value.available)} ${$i18n.$t.empire.production.mines.crawlersAvailable})`"
                />
            </div>
        </template>

        <template #footer-planet>⌀</template>

        <template #footer-metalMine="{ value }">
            <span v-text="$i18n.$n(value, avgNumberFormat)" />
        </template>

        <template #footer-crystalMine="{ value }">
            <span v-text="$i18n.$n(value, avgNumberFormat)" />
        </template>

        <template #footer-deuteriumSynthesizer="{ value }">
            <span v-text="$i18n.$n(value, avgNumberFormat)" />
        </template>

        <template #footer-solarPlant="{ value }">
            <span v-text="$i18n.$n(value, avgNumberFormat)" />
        </template>

        <template #footer-fusionReactor="{ value }">
            <span v-text="$i18n.$n(value, avgNumberFormat)" />
        </template>

        <template #footer-crawlers="{ value }">
            <div class="crawlers">
                <span
                    v-text="$i18n.$n(value.active, avgNumberFormat)"
                    :class="{
                        'crawlers-good': value.active == value.maximum,
                        'crawlers-ok':
                            value.active > 0 && value.active < value.maximum,
                        'crawlers-bad': value.active == 0,
                    }"
                />
                <span
                    v-text="
                        `(${$i18n.$n(
                            value.available,
                            avgNumberFormat
                        )} ${$i18n.$t.empire.production.mines.crawlersAvailable})`
                    "
                />
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/empire/PlanetData';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Vue } from 'vue-property-decorator';
    import { compareCoordinates, Coordinates } from '@/shared/models/ogame/common/Coordinates';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { BuildingType } from '@/shared/models/ogame/buildings/BuildingType';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { getMaxActiveCrawlers } from '@/shared/models/ogame/buildings/getMaxActiveCrawlers';
    import { LocalPlayerData } from '@/shared/models/empire/LocalPlayerData';
    import { PlanetType } from '@/shared/models/ogame/common/PlanetType';
import { ServerSettingsDataModule } from '@/views/stats/data/ServerSettingsDataModule';
import { getLifeformCollectorClassBonus } from '@/shared/models/ogame/lifeforms/buildings/getLifeformCollectorClassBonus';

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

    @Component({})
    export default class Resources extends Vue {
        private readonly avgNumberFormat: Intl.NumberFormatOptions = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };

        private get columns(): GridTableColumn<keyof ProductionMineItem>[] {
            return [
                {
                    key: 'planet',
                    label: this.$i18n.$t.empire.planet,
                    size: '1fr',
                },
                { key: 'metalMine', size: '1fr' },
                { key: 'crystalMine', size: '1fr' },
                { key: 'deuteriumSynthesizer', size: '1fr' },
                { key: 'solarPlant', size: '1fr' },
                { key: 'fusionReactor', size: '1fr' },

                { key: 'crawlers' },
            ];
        }

        private get footerItems(): ProductionMineItem[] {
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

            const items = this.items;
            const result = items.reduce((acc, item) => {
                acc.metalMine += item.metalMine / items.length;
                acc.crystalMine += item.crystalMine / items.length;
                acc.deuteriumSynthesizer += item.deuteriumSynthesizer / items.length;
                acc.solarPlant += item.solarPlant / items.length;
                acc.fusionReactor += item.fusionReactor / items.length;

                acc.crawlers.active += item.crawlers.active / items.length;
                acc.crawlers.maximum += item.crawlers.maximum / items.length;
                acc.crawlers.available += item.crawlers.available / items.length;

                return acc;
            }, item);

            return [result];
        }

        private get items(): ProductionMineItem[] {
            const collectorClassBonus = 1 + getLifeformCollectorClassBonus(this.player);

            return this.planets
                .map(planet => {
                    const maxActiveCrawlers = getMaxActiveCrawlers(
                        planet.buildings[BuildingType.metalMine],
                        planet.buildings[BuildingType.crystalMine],
                        planet.buildings[BuildingType.deuteriumSynthesizer],
                        this.player.playerClass,
                        this.player.officers.geologist,
                        ServerSettingsDataModule.serverSettings,
                        collectorClassBonus,
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
        }

        private get player(): LocalPlayerData {
            return EmpireDataModule.empire;
        }


        private get planets(): PlanetData[] {
            return Object.values(EmpireDataModule.empire.planets)
                .filter(planet => !planet.isMoon)
                .sort((a, b) => EmpireDataModule.empire.planetOrder.indexOf(a.id) - EmpireDataModule.empire.planetOrder.indexOf(b.id)) as PlanetData[]; 
        }
    }
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