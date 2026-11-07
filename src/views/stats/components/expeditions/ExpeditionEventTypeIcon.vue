<template>
    <span v-if="type == ExpeditionEventType.nothing" class="mdi mdi-close" :style="{ color: colors.nothing }" />
    <ExpeditionEventResourcesIcon v-else-if="type == ExpeditionEventType.resources" size="24px" />
    <OShip v-else-if="type == ExpeditionEventType.fleet" :ship="ShipType.battleship" size="24px" />
    <span
        v-else-if="type == ExpeditionEventType.delay"
        class="mdi mdi-clock-outline"
        :style="{ color: colors.delay }"
    />
    <span
        v-else-if="type == ExpeditionEventType.early"
        class="mdi mdi-clock-outline"
        :style="{ color: colors.early }"
    />
    <OResource v-else-if="type == ExpeditionEventType.darkMatter" resource="dark-matter" size="24px" />
    <span v-else-if="type == ExpeditionEventType.pirates" class="mdi mdi-pirate" :style="{ color: colors.pirates }" />
    <span v-else-if="type == ExpeditionEventType.aliens" class="mdi mdi-alien" :style="{ color: colors.aliens }" />
    <span
        v-else-if="type == ExpeditionEventType.combat"
        class="mdi mdi-sword-cross"
        :style="{ color: colors.combat }"
    />
    <OItem v-else-if="type == ExpeditionEventType.item" :item="detroidItem" size="24px" />
    <span
        v-else-if="type == ExpeditionEventType.trader"
        class="mdi mdi-swap-horizontal-bold"
        :style="{ color: colors.trader }"
    />
    <span
        v-else-if="type == ExpeditionEventType.lostFleet"
        class="mdi mdi-cross"
        :style="{ color: colors.lostFleet }"
    />
</template>

<script setup lang="ts">
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import OShip from '@ogame-tracker/view-shared/components/ogame/OShip.vue';
import { computed } from 'vue';
import type { PropType } from 'vue';
import {
    ExpeditionEventType,
    ExpeditionEventTypes,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import { useSettingsStore } from '../../data/SettingsDataModule';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import ExpeditionEventResourcesIcon from '@ogame-tracker/view-shared/components/ExpeditionEventResourcesIcon.vue';

defineProps({
    type: {
        required: true,
        type: String as PropType<ExpeditionEventType>,
        validator: (value: ExpeditionEventType) => ExpeditionEventTypes.includes(value),
    },
});

const settingsStore = useSettingsStore();

const detroidItem = 'detroid_30minutes';

const colors = computed(() => settingsStore.settings.colors.expeditions.events);
</script>
