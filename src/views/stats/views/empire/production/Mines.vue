<template>
    <grid-table :columns="columns" :items="items">
        <template #header-metalMine>
            <o-building building="metal-mine" size="100px" />
        </template>
        <template #header-crystalMine>
            <o-building building="crystal-mine" size="100px" />
        </template>
        <template #header-deuteriumSynthesizer>
            <o-building building="deuterium-synthesizer" size="100px" />
        </template>
        <template #header-solarPlant>
            <o-building building="solar-plant" size="100px" />
        </template>
        <template #header-fusionReactor>
            <o-building building="fusion-reactor" size="100px" />
        </template>

        <template #header-crawlers>
            <o-ship ship="crawler" size="100px" />
        </template>

        <template #cell-planet="{ value: item }">
            <div class="planet-info">
                <span v-text="item.planet.name" />
                <span>
                    [{{ item.planet.coordinates.galaxy }}:{{
                        item.planet.coordinates.system
                    }}:{{ item.planet.coordinates.position }}]
                </span>
            </div>
        </template>

        <template #cell-crawlers="{ value }">
            <div class="crawlers">
                <span v-text="value.crawlers.active" />
                <span v-text="'/'" />
                <span v-text="value.crawlers.maximum" />
                <span v-text="`(${value.crawlers.available} LOCA: available)`" />
            </div>
        </template>
    </grid-table>
</template>

<script lang="ts">
    import { PlanetData } from '@/shared/models/v1/empire/PlanetData';
    import { EmpireDataModule } from '@/views/stats/data/EmpireDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Coordinates } from '@/shared/models/v1/ogame/common/Coordinates';
    import { GridTableColumn } from '@/views/stats/components/common/GridTable.vue';
    import { BuildingType } from '@/shared/models/v1/ogame/buildings/BuildingType';
    import { ShipType } from '@/shared/models/v1/ogame/ships/ShipType';
    import { getMaxActiveCrawlers } from '@/shared/models/v1/ogame/buildings/getMaxActiveCrawlers';
    import { LocalPlayerData } from '@/shared/models/v1/empire/LocalPlayerData';

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
        private get columns(): GridTableColumn<keyof ProductionMineItem>[] {
            return [
                {
                    key: 'planet',
                    label: 'LOCA: Planet',
                },
                { key: 'metalMine' },
                { key: 'crystalMine' },
                { key: 'deuteriumSynthesizer' },
                { key: 'solarPlant' },
                { key: 'fusionReactor' },

                { key: 'crawlers' },
            ];
        }

        private get items(): ProductionMineItem[] {
            return this.planets.map(planet => {
                const maxActiveCrawlers = getMaxActiveCrawlers(
                    planet.buildings.production[BuildingType.metalMine],
                    planet.buildings.production[BuildingType.crystalMine],
                    planet.buildings.production[BuildingType.deuteriumSynthesizer],
                    this.player.playerClass,
                    this.player.officers.geologist
                );
                const availableCrawlers = planet.ships[ShipType.crawler];

                return {
                    planet,
                    metalMine: planet.buildings.production[BuildingType.metalMine],
                    crystalMine: planet.buildings.production[BuildingType.crystalMine],
                    deuteriumSynthesizer: planet.buildings.production[BuildingType.deuteriumSynthesizer],
                    solarPlant: planet.buildings.production[BuildingType.solarPlant],
                    fusionReactor: planet.buildings.production[BuildingType.fusionReactor],
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
                .filter(planet => !planet.isMoon) as PlanetData[];
        }
    }
</script>