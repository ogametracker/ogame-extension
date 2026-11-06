<template>
    <Notification type="info" :title="title" :timeout="10000" @remove="emit('remove')">
        <template #message>
            <template v-if="hasSummary">
                <h4 v-text="translate(t => t.extension.notifications.expeditionTracking.result.summary)" />

                <template v-if="showSimplified">
                    <div class="result-grid resources-grid" v-if="foundResources">
                        <template v-if="notification.resources.metal > 0">
                            <OResource :resource="ResourceType.metal" class="icon" />
                            <span v-text="formatNumber(notification.resources.metal)" />
                        </template>
                        <template v-if="notification.resources.crystal > 0">
                            <OResource :resource="ResourceType.crystal" class="icon" />
                            <span v-text="formatNumber(notification.resources.crystal)" />
                        </template>
                        <template v-if="notification.resources.deuterium > 0">
                            <OResource :resource="ResourceType.deuterium" class="icon" />
                            <span v-text="formatNumber(notification.resources.deuterium)" />
                        </template>

                        <span class="mdi mdi-sigma icon" />
                        <span v-text="formatNumber(resourceSum)" />
                    </div>

                    <div class="result-grid" v-if="notification.darkMatter > 0">
                        <OResource resource="dark-matter" class="icon" />
                        <span v-text="formatNumber(notification.darkMatter)" />
                    </div>

                    <div class="result-flex" v-if="notification.items.length > 0">
                        <OItem v-for="(item, i) in notification.items" :key="i" :item="item" />
                    </div>

                    <div class="result-grid" v-if="foundShips">
                        <template v-for="ship in ships" :key="ship">
                            <template v-if="notification.ships[ship] > 0">
                                <OShip :ship="ship" class="icon" />
                                <span v-text="formatNumber(notification.ships[ship])" />
                            </template>
                        </template>
                    </div>
                </template>

                <template v-else>
                    <div class="text-grid" v-if="foundResources">
                        <template v-if="notification.resources.metal > 0">
                            <span v-text="translate(t => t.extension.resources[ResourceType.metal])" />
                            <span v-text="formatNumber(notification.resources.metal)" />
                        </template>
                        <template v-if="notification.resources.crystal > 0">
                            <span v-text="translate(t => t.extension.resources[ResourceType.crystal])" />
                            <span v-text="formatNumber(notification.resources.crystal)" />
                        </template>
                        <template v-if="notification.resources.deuterium > 0">
                            <span v-text="translate(t => t.extension.resources[ResourceType.deuterium])" />
                            <span v-text="formatNumber(notification.resources.deuterium)" />
                        </template>

                        <span v-text="translate(t => t.extension.common.sum)" />
                        <span v-text="formatNumber(resourceSum)" />
                    </div>

                    <div class="text-grid" v-if="notification.darkMatter > 0">
                        <span v-text="translate(t => t.ogame.premium.darkMatter)" />
                        <span v-text="formatNumber(notification.darkMatter)" />
                    </div>

                    <hr v-if="notification.darkMatter > 0 && notification.items.length > 0" />

                    <div class="result-flex" v-if="notification.items.length > 0">
                        <span v-text="`${notification.items.length} Items`" />
                    </div>

                    <hr v-if="notification.items.length > 0 && foundShips" />

                    <div class="text-grid" v-if="foundShips">
                        <template v-for="ship in ships" :key="ship">
                            <template v-if="notification.ships[ship] > 0">
                                <span v-text="translate(t => t.ogame.ships[ship])" />
                                <span v-text="formatNumber(notification.ships[ship])" />
                            </template>
                        </template>
                    </div>
                </template>

                <hr />
            </template>

            <h4 v-text="translate(t => t.extension.notifications.expeditionTracking.result.events)" />
            <div class="result-grid" v-if="showSimplified">
                <template v-for="event in expeditionEvents" :key="event">
                    <template v-if="notification.events[event] > 0">
                        <span
                            v-if="event == 'nothing'"
                            class="mdi mdi-close icon"
                            :style="{ color: eventColors?.nothing }"
                        />
                        <ExpeditionEventResourcesIcon v-else-if="event == 'resources'" size="24px" class="icon" />
                        <OShip v-else-if="event == 'fleet'" :ship="ShipType.battleship" size="24px" class="icon" />
                        <span
                            v-else-if="event == 'delay'"
                            class="mdi mdi-clock-outline icon"
                            :style="{ color: eventColors?.delay }"
                        />
                        <span
                            v-else-if="event == 'early'"
                            class="mdi mdi-clock-outline icon"
                            :style="{ color: eventColors?.early }"
                        />
                        <OResource v-else-if="event == 'darkMatter'" resource="dark-matter" size="24px" class="icon" />
                        <span
                            v-else-if="event == 'combat'"
                            class="mdi mdi-sword-cross icon"
                            :style="{ color: eventColors?.combat }"
                        />
                        <OItem v-else-if="event == 'item'" :item="detroidItem" size="24px" class="icon" />
                        <span
                            v-else-if="event == 'trader'"
                            class="mdi mdi-swap-horizontal-bold icon"
                            :style="{ color: eventColors?.trader }"
                        />
                        <span
                            v-else-if="event == 'lostFleet'"
                            class="mdi mdi-cross icon"
                            :style="{ color: eventColors?.lostFleet }"
                        />

                        <span v-text="formatNumber(notification.events[event])" />
                    </template>
                </template>
            </div>
            <div v-else class="text-grid events">
                <template v-for="event in expeditionEvents" :key="event">
                    <template v-if="notification.events[event] > 0">
                        <span v-text="translate(t => t.extension.expeditions.expeditionEvents[event])" />
                        <span v-text="formatNumber(notification.events[event])" />
                    </template>
                </template>
            </div>

            <template v-if="hasDepletion">
                <hr />
                <h4 v-text="translate(t => t.extension.expeditions.depletion)" />
                <div class="result-grid" v-if="showSimplified">
                    <template v-for="level in depletionLevels" :key="level">
                        <template v-if="notification.depletion[level] > 0">
                            <span
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
                                :style="{ color: depletionColors?.[level] }"
                            />
                            <span v-text="formatNumber(notification.depletion[level])" />
                        </template>
                    </template>
                </div>
                <div v-else class="text-grid events">
                    <template v-for="level in depletionLevels" :key="level">
                        <template v-if="notification.depletion[level] > 0">
                            <span v-text="translate(t => t.extension.expeditions.depletionLevels[level])" />
                            <span v-text="formatNumber(notification.depletion[level])" />
                        </template>
                    </template>
                </div>
            </template>
        </template>
    </Notification>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ExpeditionTrackingNotificationMessageData } from '@ogame-tracker/shared/messages/notifications';
import { ExpeditionEventType } from '@ogame-tracker/shared/models/expeditions/ExpeditionEventType';
import Notification from '../Notification.vue';
import ExpeditionEventResourcesIcon from '@ogame-tracker/view-shared/components/ExpeditionEventResourcesIcon.vue';
import { ShipType } from '@ogame-tracker/shared/models/ogame/ships/ShipType';
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import {
    type ExpeditionDepletionLevel,
    ExpeditionDepletionLevels,
} from '@ogame-tracker/shared/models/expeditions/ExpeditionDepletionLevel';
import { ExpeditionFindableShipTypes } from '@ogame-tracker/shared/models/expeditions/ExpeditionEvents';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import OShip from '@ogame-tracker/view-shared/components/ogame/OShip.vue';
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import { formatNumber, translate } from '../../i18n';
import { useSettingsStore } from '../../stores/settings';

const { notification } = defineProps<{ notification: ExpeditionTrackingNotificationMessageData }>();
const emit = defineEmits<{ remove: [] }>();
const settingsStore = useSettingsStore();

const detroidItem = 'detroid_30minutes';
const expeditionEvents = [
    ExpeditionEventType.lostFleet,
    ExpeditionEventType.resources,
    ExpeditionEventType.darkMatter,
    ExpeditionEventType.fleet,
    ExpeditionEventType.delay,
    ExpeditionEventType.early,
    ExpeditionEventType.combat,
    ExpeditionEventType.item,
    ExpeditionEventType.trader,
    ExpeditionEventType.nothing,
];

const depletionLevels: (ExpeditionDepletionLevel | 'unknown')[] = [...ExpeditionDepletionLevels, 'unknown'];

const ships = [...ExpeditionFindableShipTypes].sort((a, b) => a - b);

const showSimplified = computed(() => settingsStore.settings?.messageTracking.showSimplifiedResults ?? false);

const foundResources = computed(() => Object.values(notification.resources).some(r => r > 0));
const foundShips = computed(() => Object.values(notification.ships).some(r => r > 0));
const count = computed(() => Object.values(notification.events).reduce((acc, cur) => acc + cur, 0));

const hasSummary = computed(() => foundResources.value || notification.darkMatter > 0 || foundShips.value);

const title = computed(() =>
    translate(t => t.extension.notifications.expeditionTracking.result.title(formatNumber(count.value))),
);

const hasDepletion = computed(() => Object.values(notification.depletion).some(c => c > 0));

const eventColors = computed(() => settingsStore.settings?.colors.expeditions.events);

const depletionColors = computed(() => settingsStore.settings?.colors.expeditions.depletion);

const resourceSum = computed(
    () => notification.resources.metal + notification.resources.crystal + notification.resources.deuterium,
);
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
