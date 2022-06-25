<template>
    <notification
        type="info"
        :title="`LOCA: ${count} new expeditions tracked`"
        :timeout="10000"
        @remove="$emit('remove')"
    >
        <template #message>
            <div class="result-grid resources-grid" v-if="foundResources">
                <template v-if="notification.resources.metal > 0">
                    <o-resource resource="metal" />
                    <span v-text="$i18n.$n(notification.resources.metal)" />
                </template>
                <template v-if="notification.resources.crystal > 0">
                    <o-resource resource="crystal" />
                    <span v-text="$i18n.$n(notification.resources.crystal)" />
                </template>
                <template v-if="notification.resources.deuterium > 0">
                    <o-resource resource="deuterium" />
                    <span v-text="$i18n.$n(notification.resources.deuterium)" />
                </template>
            </div>

            <div class="result-grid" v-if="notification.darkMatter > 0">
                <template>
                    <o-resource resource="dark-matter" />
                    <span v-text="$i18n.$n(notification.darkMatter)" />
                </template>
            </div>

            <div class="result-grid" v-if="foundShips">
                <template v-for="ship in ships">
                    <template v-if="notification.ships[ship] > 0">
                        <o-ship
                            :ship="shipTypes[ship]"
                            :key="`ship-icon-${ship}`"
                        />
                        <span
                            v-text="$i18n.$n(notification.ships[ship])"
                            :key="`ship-count-${ship}`"
                        />
                    </template>
                </template>
            </div>

            <hr
                v-if="
                    foundResources || notification.darkMatter > 0 || foundShips
                "
            />
            <h4 v-text="'LOCA Ereignisse'" />
            <div class="result-grid">
                <template v-for="event in expeditionEvents">
                    <template v-if="notification.events[event] > 0">
                        <span
                            v-if="event == 'nothing'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-close"
                            :style="{ color: eventColors.nothing }"
                        />
                        <expedition-event-resources-icon
                            v-else-if="event == 'resources'"
                            :key="`event-icon-${event}`"
                            size="24px"
                        />
                        <o-ship
                            v-else-if="event == 'fleet'"
                            :key="`event-icon-${event}`"
                            ship="battleship"
                            size="24px"
                        />
                        <span
                            v-else-if="event == 'delay'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-clock-outline"
                            :style="{ color: eventColors.delay }"
                        />
                        <span
                            v-else-if="event == 'early'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-clock-outline"
                            :style="{ color: eventColors.early }"
                        />
                        <o-resource
                            v-else-if="event == 'darkMatter'"
                            :key="`event-icon-${event}`"
                            resource="dark-matter"
                            size="24px"
                        />
                        <span
                            v-else-if="event == 'pirates'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-pirate"
                            :style="{ color: eventColors.pirates }"
                        />
                        <span
                            v-else-if="event == 'aliens'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-alien"
                            :style="{ color: eventColors.aliens }"
                        />
                        <o-item
                            v-else-if="event == 'item'"
                            :key="`event-icon-${event}`"
                            :item="detroidItem"
                            size="24px"
                        />
                        <span
                            v-else-if="event == 'trader'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-swap-horizontal-bold"
                            :style="{ color: eventColors.trader }"
                        />
                        <span
                            v-else-if="event == 'lostFleet'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-cross"
                            :style="{ color: eventColors.lostFleet }"
                        />

                        <span
                            v-text="$i18n.$n(notification.events[event])"
                            :key="`event-count-${event}`"
                        />
                    </template>
                </template>
            </div>
        </template>
    </notification>
</template>

<script lang="ts">
    import { ExpeditionTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ExpeditionFindableShipType } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { OShipType } from '@/views/_shared/components/ogame/OShip.vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';

    @Component({
        components: {
            Notification,
            ExpeditionEventResourcesIcon,
        }
    })
    export default class ExpeditionTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: ExpeditionTrackingNotificationMessageData;

        private readonly expeditionEvents = [
            ExpeditionEventType.lostFleet,
            ExpeditionEventType.resources,
            ExpeditionEventType.darkMatter,
            ExpeditionEventType.fleet,
            ExpeditionEventType.delay,
            ExpeditionEventType.early,
            ExpeditionEventType.pirates,
            ExpeditionEventType.aliens,
            ExpeditionEventType.item,
            ExpeditionEventType.trader,
            ExpeditionEventType.nothing,
        ];

        private readonly ships = [
            ExpeditionFindableShipType.smallCargo,
            ExpeditionFindableShipType.largeCargo,
            ExpeditionFindableShipType.lightFighter,
            ExpeditionFindableShipType.heavyFighter,
            ExpeditionFindableShipType.cruiser,
            ExpeditionFindableShipType.battleship,
            ExpeditionFindableShipType.bomber,
            ExpeditionFindableShipType.battlecruiser,
            ExpeditionFindableShipType.destroyer,
            ExpeditionFindableShipType.reaper,
            ExpeditionFindableShipType.pathfinder,
            ExpeditionFindableShipType.espionageProbe,
        ].sort((a, b) => a - b);

        private readonly shipTypes: Record<ExpeditionFindableShipType, OShipType> = {
            [ExpeditionFindableShipType.lightFighter]: OShipType['light-fighter'],
            [ExpeditionFindableShipType.heavyFighter]: OShipType['heavy-fighter'],
            [ExpeditionFindableShipType.cruiser]: OShipType.cruiser,
            [ExpeditionFindableShipType.battleship]: OShipType.battleship,
            [ExpeditionFindableShipType.bomber]: OShipType.bomber,
            [ExpeditionFindableShipType.battlecruiser]: OShipType.battlecruiser,
            [ExpeditionFindableShipType.destroyer]: OShipType.destroyer,
            [ExpeditionFindableShipType.reaper]: OShipType.reaper,
            [ExpeditionFindableShipType.pathfinder]: OShipType.pathfinder,
            [ExpeditionFindableShipType.smallCargo]: OShipType['small-cargo'],
            [ExpeditionFindableShipType.largeCargo]: OShipType['large-cargo'],
            [ExpeditionFindableShipType.espionageProbe]: OShipType['espionage-probe'],
        };

        private get foundResources() {
            return Object.values(this.notification.resources).some(r => r > 0);
        }
        private get foundShips() {
            return Object.values(this.notification.ships).some(r => r > 0);
        }

        private get count() {
            return Object.values(this.notification.events)
                .reduce((acc, cur) => acc + cur, 0);
        }

        private get eventColors() {
            return SettingsDataModule.settings.colors.expeditions.events;
        }
    }
</script>
<style lang="scss" scoped>
    .result-grid {
        &.resources-grid {
            grid-template-columns: repeat(2, 32px 1fr);
        }

        display: grid;
        grid-template-columns: repeat(3, 32px 1fr);
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;

        + .result-grid {
            margin-top: 8px;
        }

        .mdi {
            transform: scale(1.5);
            width: 24px;
            text-align: center;
            height: 20px;
        }
    }
</style>