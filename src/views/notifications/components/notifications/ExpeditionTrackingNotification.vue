<template>
    <notification type="info" :title="'LOCA: New expeditions tracked'">
        <template #message>
            <span v-text="`${newExpeditions} new expeditions tracked`" />

            <div class="result-grid" v-if="foundResources">
                <template v-if="notification.resources.metal > 0">
                    <span v-text="'TODO: Metal icon'" />
                    <span v-text="notification.resources.metal" />
                </template>
                <template v-if="notification.resources.crystal > 0">
                    <span v-text="'TODO: Crystal icon'" />
                    <span v-text="notification.resources.crystal" />
                </template>
                <template v-if="notification.resources.deuterium > 0">
                    <span v-text="'TODO: Deuterium icon'" />
                    <span v-text="notification.resources.deuterium" />
                </template>
            </div>

            <div class="result-grid" v-if="notification.darkMatter > 0">
                <template>
                    <span v-text="'TODO: Dark Matter icon'" />
                    <span v-text="notification.darkMatter" />
                </template>
            </div>

            <div class="result-grid" v-if="foundShips">
                <span v-text="'TODO: Ship icons'" />
                <span v-text="'TODO: count'" />
            </div>

            <div class="result-grid" v-if="hasOtherEvents">
                <span v-text="'TODO: Event icons'" />
                <span v-text="'TODO: count'" />
            </div>
        </template>
    </notification>
</template>

<script lang="ts">
    import { ExpeditionTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ExpeditionEventType } from '@/shared/models/expeditions/ExpeditionEventType';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';

    @Component({
        components: {
            Notification,
        }
    })
    export default class ExpeditionTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: ExpeditionTrackingNotificationMessageData;

        private get foundResources() {
            return Object.values(this.notification.resources).some(r => r > 0);
        }
        private get foundShips() {
            return Object.values(this.notification.ships).some(r => r > 0);
        }
        private get hasOtherEvents() {
            const keys = [
                ExpeditionEventType.nothing,
                ExpeditionEventType.delay,
                ExpeditionEventType.early,
                ExpeditionEventType.pirates,
                ExpeditionEventType.aliens,
                ExpeditionEventType.item,
                ExpeditionEventType.trader,
                ExpeditionEventType.lostFleet,
            ];
            return keys.some(k => this.notification.events[k] > 0);
        }

        private get newExpeditions() {
            return Object.values(this.notification.events)
                .reduce((acc, cur) => acc + cur, 0);
        }
    }
</script>
<style lang="scss" scoped>
    .result-grid {
        display: grid;
        grid-template-columns: 32px 1fr;

        + .result-grid {
            margin-top: 8px;
        }
    }
</style>