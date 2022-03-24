<template>
    <color-settings-table
        :header="header"
        :labels="labels"
        :keys="keys"
        :value="colors"
        @input="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script lang="ts">
    import { LanguageKey } from '@/shared/i18n/LanguageKey';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { getDefaultSettings } from '@/shared/models/settings/getDefaultSettings';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ColorSettingsTable from './ColorSettingsTable.vue';

    @Component({
        components: {
            ColorSettingsTable,
        },
    })
    export default class ShipColorSettings extends Vue {
        private get header() {
            return 'LOCA: Ships';
        }

        private get labels(): Record<ShipType, string> {
            return {
                [ShipType.lightFighter]: 'LOCA: lightFighter',
                [ShipType.heavyFighter]: 'LOCA: heavyFighter',
                [ShipType.cruiser]: 'LOCA: cruiser',
                [ShipType.battleship]: 'LOCA: battleship',
                [ShipType.bomber]: 'LOCA: bomber',
                [ShipType.battlecruiser]: 'LOCA: battlecruiser',
                [ShipType.destroyer]: 'LOCA: destroyer',
                [ShipType.reaper]: 'LOCA: reaper',
                [ShipType.pathfinder]: 'LOCA: pathfinder',
                [ShipType.smallCargo]: 'LOCA: smallCargo',
                [ShipType.largeCargo]: 'LOCA: largeCargo',
                [ShipType.espionageProbe]: 'LOCA: espionageProbe',
                [ShipType.deathStar]: 'LOCA: deathStar',
                [ShipType.recycler]: 'LOCA: recycler',
                [ShipType.colonyShip]: 'LOCA: colonyShip',
                [ShipType.crawler]: 'LOCA: crawler',
                [ShipType.solarSatellite]: 'LOCA: solarSatellite',
            };
        }

        private readonly keys: ShipType[] = [
            ShipType.lightFighter,
            ShipType.heavyFighter,
            ShipType.cruiser,
            ShipType.battleship,
            ShipType.bomber,
            ShipType.battlecruiser,
            ShipType.destroyer,
            ShipType.reaper,
            ShipType.pathfinder,
            ShipType.smallCargo,
            ShipType.largeCargo,
            ShipType.espionageProbe,
            ShipType.deathStar,
            ShipType.recycler,
            ShipType.colonyShip,
            ShipType.crawler,
            ShipType.solarSatellite,
        ];

        private get colors() {
            return SettingsDataModule.settings.colors.ships;
        }

        private async updateColors(value: Record<ShipType, string>) {
            await SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    ships: value,
                },
            });
        }

        private async resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.ships;

            await SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    ships: defaultColors,
                },
            });
        }
    }
</script>