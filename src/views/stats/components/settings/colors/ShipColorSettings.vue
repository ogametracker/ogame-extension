<template>
    <color-settings-table
        :header="$i18n.$t.settings.colors.ships"
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

        private get labels(): Record<ShipType, string> {

            return {
                [ShipType.lightFighter]: this.$i18n.$t.ships[ShipType.lightFighter],
                [ShipType.heavyFighter]: this.$i18n.$t.ships[ShipType.heavyFighter],
                [ShipType.cruiser]: this.$i18n.$t.ships[ShipType.cruiser],
                [ShipType.battleship]: this.$i18n.$t.ships[ShipType.battleship],
                [ShipType.bomber]: this.$i18n.$t.ships[ShipType.bomber],
                [ShipType.battlecruiser]: this.$i18n.$t.ships[ShipType.battlecruiser],
                [ShipType.destroyer]: this.$i18n.$t.ships[ShipType.destroyer],
                [ShipType.reaper]: this.$i18n.$t.ships[ShipType.reaper],
                [ShipType.pathfinder]: this.$i18n.$t.ships[ShipType.pathfinder],
                [ShipType.smallCargo]: this.$i18n.$t.ships[ShipType.smallCargo],
                [ShipType.largeCargo]: this.$i18n.$t.ships[ShipType.largeCargo],
                [ShipType.espionageProbe]: this.$i18n.$t.ships[ShipType.espionageProbe],
                [ShipType.deathStar]: this.$i18n.$t.ships[ShipType.deathStar],
                [ShipType.recycler]: this.$i18n.$t.ships[ShipType.recycler],
                [ShipType.colonyShip]: this.$i18n.$t.ships[ShipType.colonyShip],
                [ShipType.crawler]: this.$i18n.$t.ships[ShipType.crawler],
                [ShipType.solarSatellite]: this.$i18n.$t.ships[ShipType.solarSatellite],
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

        private updateColors(value: Record<ShipType, string>) {
            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    ships: value,
                },
            });
        }

        private resetColors() {
            const defaultColors = getDefaultSettings(LanguageKey.de).colors.ships;

            SettingsDataModule.updateSettings({
                ...SettingsDataModule.settings,
                colors: {
                    ...SettingsDataModule.settings.colors,
                    ships: defaultColors,
                },
            });
        }
    }
</script>