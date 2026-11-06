<template>
    <ColorSettingsTable
        :header="translations().extension.settings.colors.ships"
        :labels="labels"
        :keys="keys"
        :model-value="colors"
        @update:model-value="updateColors($event)"
        @reset="resetColors()"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import { LanguageKey } from '@ogame-tracker/shared/i18n/LanguageKey';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { getDefaultSettings } from '@ogame-tracker/shared/models/settings/getDefaultSettings';
import { useSettingsStore } from '@stats/data/SettingsDataModule';
import ColorSettingsTable from './ColorSettingsTable.vue';

const settingsStore = useSettingsStore();

const labels = computed<Record<ShipType, string>>(() => {

    return {
        [ShipType.lightFighter]: translations().ogame.ships[ShipType.lightFighter],
        [ShipType.heavyFighter]: translations().ogame.ships[ShipType.heavyFighter],
        [ShipType.cruiser]: translations().ogame.ships[ShipType.cruiser],
        [ShipType.battleship]: translations().ogame.ships[ShipType.battleship],
        [ShipType.bomber]: translations().ogame.ships[ShipType.bomber],
        [ShipType.battlecruiser]: translations().ogame.ships[ShipType.battlecruiser],
        [ShipType.destroyer]: translations().ogame.ships[ShipType.destroyer],
        [ShipType.reaper]: translations().ogame.ships[ShipType.reaper],
        [ShipType.pathfinder]: translations().ogame.ships[ShipType.pathfinder],
        [ShipType.smallCargo]: translations().ogame.ships[ShipType.smallCargo],
        [ShipType.largeCargo]: translations().ogame.ships[ShipType.largeCargo],
        [ShipType.espionageProbe]: translations().ogame.ships[ShipType.espionageProbe],
        [ShipType.deathStar]: translations().ogame.ships[ShipType.deathStar],
        [ShipType.recycler]: translations().ogame.ships[ShipType.recycler],
        [ShipType.colonyShip]: translations().ogame.ships[ShipType.colonyShip],
        [ShipType.crawler]: translations().ogame.ships[ShipType.crawler],
        [ShipType.solarSatellite]: translations().ogame.ships[ShipType.solarSatellite],
    };
});

const keys: ShipType[] = [
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

const colors = computed(() => settingsStore.settings.colors.ships);

function updateColors(value: Record<ShipType, string>) {
    settingsStore.updateSettings({
        ...settingsStore.settings,
        colors: {
            ...settingsStore.settings.colors,
            ships: value,
        },
    });
}

function resetColors() {
    const defaultColors = getDefaultSettings(LanguageKey.de).colors.ships;
    updateColors(defaultColors);
}
</script>
