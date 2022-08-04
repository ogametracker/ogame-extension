<template>
    <notification type="info" :title="title" :timeout="10000" @remove="$emit('remove')">
        <template #message>
            <template v-if="hasSummary">
                <h4 v-text="$i18n.$t.notifications.expeditionTracking.result.summary" />

                <template v-if="showSimplified">
                    <div class="result-grid resources-grid" v-if="foundResources">
                        <template v-if="notification.resources.metal > 0">
                            <o-resource resource="metal" class="icon" />
                            <span v-text="$i18n.$n(notification.resources.metal)" />
                        </template>
                        <template v-if="notification.resources.crystal > 0">
                            <o-resource resource="crystal" class="icon" />
                            <span v-text="$i18n.$n(notification.resources.crystal)" />
                        </template>
                        <template v-if="notification.resources.deuterium > 0">
                            <o-resource resource="deuterium" class="icon" />
                            <span v-text="$i18n.$n(notification.resources.deuterium)" />
                        </template>

                        <span class="mdi mdi-sigma icon" />
                        <span v-text="$i18n.$n(resourceSum)" />
                    </div>

                    <div class="result-grid" v-if="notification.darkMatter > 0">
                        <o-resource resource="dark-matter" class="icon" />
                        <span v-text="$i18n.$n(notification.darkMatter)" />
                    </div>

                    <div class="result-flex" v-if="notification.items.length > 0">
                        <o-item v-for="(item, i) in notification.items" :key="i" :item="item" />
                    </div>

                    <div class="result-grid" v-if="foundShips">
                        <template v-for="ship in ships">
                            <template v-if="notification.ships[ship] > 0">
                                <o-ship :ship="ship" :key="`ship-icon-${ship}`" class="icon" />
                                <span v-text="$i18n.$n(notification.ships[ship])" :key="`ship-count-${ship}`" />
                            </template>
                        </template>
                    </div>
                </template>

                <template v-else>
                    <div class="text-grid" v-if="foundResources">
                        <template v-if="notification.resources.metal > 0">
                            <span v-text="$i18n.$t.resources[ResourceType.metal]" />
                            <span v-text="$i18n.$n(notification.resources.metal)" />
                        </template>
                        <template v-if="notification.resources.crystal > 0">
                            <span v-text="$i18n.$t.resources[ResourceType.crystal]" />
                            <span v-text="$i18n.$n(notification.resources.crystal)" />
                        </template>
                        <template v-if="notification.resources.deuterium > 0">
                            <span v-text="$i18n.$t.resources[ResourceType.deuterium]" />
                            <span v-text="$i18n.$n(notification.resources.deuterium)" />
                        </template>

                        <span v-text="$i18n.$t.common.sum" />
                        <span v-text="$i18n.$n(resourceSum)" />
                    </div>

                    <div class="text-grid" v-if="notification.darkMatter > 0">
                        <span v-text="$i18n.$t.premium.darkMatter" />
                        <span v-text="$i18n.$n(notification.darkMatter)" />
                    </div>

                    <hr v-if="notification.darkMatter > 0 && notification.items.length > 0" />

                    <div class="result-flex" v-if="notification.items.length > 0">
                        <span v-text="`${notification.items.length} Items`" />
                    </div>

                    <hr v-if="notification.items.length > 0 && foundShips" />

                    <div class="text-grid" v-if="foundShips">
                        <template v-for="ship in ships">
                            <template v-if="notification.ships[ship] > 0">
                                <span v-text="$i18n.$t.ships[ship]" :key="`ship-name-${ship}`" />
                                <span v-text="$i18n.$n(notification.ships[ship])" :key="`ship-count-${ship}`" />
                            </template>
                        </template>
                    </div>
                </template>

                <hr />
            </template>

            <h4 v-text="$i18n.$t.notifications.expeditionTracking.result.events" />
            <div class="result-grid" v-if="showSimplified">
                <template v-for="event in expeditionEvents">
                    <template v-if="notification.events[event] > 0">
                        <span v-if="event == 'nothing'" :key="`event-icon-${event}`" class="mdi mdi-close icon" :style="{ color: eventColors.nothing }" />
                        <expedition-event-resources-icon v-else-if="event == 'resources'" :key="`event-icon-${event}`" size="24px" class="icon" />
                        <o-ship v-else-if="event == 'fleet'" :key="`event-icon-${event}`" :ship="ShipType.battleship" size="24px" class="icon" />
                        <span
                            v-else-if="event == 'delay'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-clock-outline icon"
                            :style="{ color: eventColors.delay }"
                        />
                        <span
                            v-else-if="event == 'early'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-clock-outline icon"
                            :style="{ color: eventColors.early }"
                        />
                        <o-resource v-else-if="event == 'darkMatter'" :key="`event-icon-${event}`" resource="dark-matter" size="24px" class="icon" />
                        <span v-else-if="event == 'pirates'" :key="`event-icon-${event}`" class="mdi mdi-pirate icon" :style="{ color: eventColors.pirates }" />
                        <span v-else-if="event == 'aliens'" :key="`event-icon-${event}`" class="mdi mdi-alien icon" :style="{ color: eventColors.aliens }" />
                        <o-item v-else-if="event == 'item'" :key="`event-icon-${event}`" :item="detroidItem" size="24px" class="icon" />
                        <span
                            v-else-if="event == 'trader'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-swap-horizontal-bold icon"
                            :style="{ color: eventColors.trader }"
                        />
                        <span
                            v-else-if="event == 'lostFleet'"
                            :key="`event-icon-${event}`"
                            class="mdi mdi-cross icon"
                            :style="{ color: eventColors.lostFleet }"
                        />

                        <span v-text="$i18n.$n(notification.events[event])" :key="`event-count-${event}`" />
                    </template>
                </template>
            </div>
            <div v-else class="text-grid events">
                <template v-for="event in expeditionEvents">
                    <template v-if="notification.events[event] > 0">
                        <span v-text="$i18n.$t.expeditions.expeditionEvents[event]" :key="`event-name-${event}`" />
                        <span v-text="$i18n.$n(notification.events[event])" :key="`event-count-${event}`" />
                    </template>
                </template>
            </div>

            <template v-if="hasDepletion">
                <hr />
                <h4 v-text="$i18n.$t.expeditions.depletion" />
                <div class="result-grid" v-if="showSimplified">
                    <template v-for="level in DepletionLevels">
                        <template v-if="notification.depletion[level] > 0">
                            <span
                                :key="`icon-${level}`"
                                class="icon mdi"
                                :class="
                                    {
                                        unknown: 'mdi-help',
                                        none: 'mdi-signal-cellular-outline',
                                        low: 'mdi-signal-cellular-1',
                                        medium: 'mdi-signal-cellular-2',
                                        high: 'mdi-signal-cellular-3',
                                    }[level]
                                "
                                :style="{ color: depletionColors[level] }"
                            />
                            <span :key="`amount-${level}`" v-text="$i18n.$n(notification.depletion[level])" />
                        </template>
                    </template>
                </div>
                <div v-else class="text-grid events">
                    <template v-for="level in DepletionLevels">
                        <template v-if="notification.depletion[level] > 0">
                            <span v-text="$i18n.$t.expeditions.depletionLevels[level]" :key="`depletion-name-${level}`" />
                            <span v-text="$i18n.$n(notification.depletion[level])" :key="`depletion-count-${level}`" />
                        </template>
                    </template>
                </div>
            </template>
        </template>
    </notification>
</template>

<script lang="ts">
    import { ExpeditionTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ExpeditionFindableShipTypes } from '@/shared/models/expeditions/ExpeditionEvents';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';
    import ExpeditionEventResourcesIcon from '@/views/_shared/components/ExpeditionEventResourcesIcon.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { ItemHash } from '@/shared/models/ogame/items/ItemHash';
    import { ShipType } from '@/shared/models/ogame/ships/ShipType';
    import { ResourceType } from '@/shared/models/ogame/resources/ResourceType';
    import { ExpeditionDepletionLevel, ExpeditionDepletionLevels } from '@/shared/models/expeditions/ExpeditionDepletionLevel';

    @Component({
        components: {
            Notification,
            ExpeditionEventResourcesIcon,
        }
    })
    export default class ExpeditionTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: ExpeditionTrackingNotificationMessageData;

        private readonly detroidItem = ItemHash.detroid_bronze;
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
        private readonly ShipType = ShipType;
        private readonly ResourceType = ResourceType;

        private readonly DepletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

        private readonly ships = [...ExpeditionFindableShipTypes].sort((a, b) => a - b);


        private get showSimplified() {
            return SettingsDataModule.settings.messageTracking.showSimplifiedResults;
        }

        private get hasSummary() {
            return this.foundResources || this.notification.darkMatter > 0 || this.foundShips;
        }

        private get title() {
            return this.$i18n.$t.notifications.expeditionTracking.result.title(this.$i18n.$n(this.count));
        }

        private get hasDepletion() {
            return Object.values(this.notification.depletion).some(c => c > 0);
        }

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

        private get depletionColors() {
            return SettingsDataModule.settings.colors.expeditions.depletion;
        }

        private get resourceSum() {
            return this.notification.resources.metal
                + this.notification.resources.crystal
                + this.notification.resources.deuterium;
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

        + .result-grid,
        + .result-flex {
            margin-top: 8px;
        }

        .mdi {
            transform: scale(1.5);
            width: 24px;
            text-align: center;
            height: 20px;
        }

        .icon {
            justify-self: center;
        }
    }

    .result-flex {
        display: flex;
        flex-direction: row;
        column-gap: 8px;
        row-gap: 4px;

        + .result-grid {
            margin-top: 8px;
        }
    }

    .text-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;

        &.events {
            grid-template-columns: repeat(2, auto 1fr);
        }
    }

    .text-grid,
    .result-flex {
        + .text-grid {
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid rgba(var(--color));
        }
    }
</style>