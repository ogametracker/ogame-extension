<template>
    <span v-if="type == ExpeditionEventType.nothing" class="mdi mdi-close" :style="{ color: colors.nothing }" />
    <expedition-event-resources-icon v-else-if="type == ExpeditionEventType.resources" size="24px" />
    <o-ship v-else-if="type == ExpeditionEventType.fleet" :ship="ShipType.battleship" size="24px" />
    <span v-else-if="type == ExpeditionEventType.delay" class="mdi mdi-clock-outline" :style="{ color: colors.delay }" />
    <span v-else-if="type == ExpeditionEventType.early" class="mdi mdi-clock-outline" :style="{ color: colors.early }" />
    <o-resource v-else-if="type == ExpeditionEventType.darkMatter" resource="dark-matter" size="24px" />
    <span v-else-if="type == ExpeditionEventType.pirates" class="mdi mdi-pirate" :style="{ color: colors.pirates }" />
    <span v-else-if="type == ExpeditionEventType.aliens" class="mdi mdi-alien" :style="{ color: colors.aliens }" />
    <o-item v-else-if="type == ExpeditionEventType.item" :item="detroidItem" size="24px" />
    <span v-else-if="type == ExpeditionEventType.trader" class="mdi mdi-swap-horizontal-bold" :style="{ color: colors.trader }" />
    <span v-else-if="type == ExpeditionEventType.lostFleet" class="mdi mdi-cross" :style="{ color: colors.lostFleet }" />
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { ExpeditionEventType, ExpeditionEventTypes } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { SettingsDataModule } from '../../data/SettingsDataModule';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';

    @Component({
        components: {
            ExpeditionEventResourcesIcon,
        },
    })
    export default class ExpeditionEventTypeIcon extends Vue {
        @Prop({
            required: true,
            type: String as PropType<ExpeditionEventType>,
            validator: (value: ExpeditionEventType) => ExpeditionEventTypes.includes(value)
        })
        private type!: ExpeditionEventType;

        private readonly ExpeditionEventType = ExpeditionEventType;
        private readonly ShipType = ShipType;
        private readonly detroidItem = ItemHash.detroid_bronze;

        private get colors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }
    }
</script>