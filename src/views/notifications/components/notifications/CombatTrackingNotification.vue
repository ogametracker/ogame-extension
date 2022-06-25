<template>
    <notification type="info" :title="title" @remove="$emit('remove')" :timeout="10000">
        <template #message>
            <div v-if="notification.count > 0" v-text="message" />
            <div
                v-if="notification.ignoredEspionageCombats > 0"
                v-text="messageIgnored"
            />

            <template v-if="hasLoot">
                <hr />
                <div class="resources-grid">
                    <template v-if="notification.resources.metal > 0">
                        <o-resource resource="metal" />
                        <span
                            :class="{
                                'negative-loot':
                                    notification.resources.metal < 0,
                                    'fade': notification.resources.metal == 0,
                            }"
                            v-text="$i18n.$n(notification.resources.metal)"
                        />
                    </template>
                    <template v-if="notification.resources.crystal > 0">
                        <o-resource resource="crystal" />
                        <span
                            :class="{
                                'negative-loot':
                                    notification.resources.crystal < 0,
                                    'fade': notification.resources.crystal == 0,
                            }"
                            v-text="$i18n.$n(notification.resources.crystal)"
                        />
                    </template>
                    <template v-if="notification.resources.deuterium > 0">
                        <o-resource resource="deuterium" />
                        <span
                            :class="{
                                'negative-loot':
                                    notification.resources.deuterium < 0,
                                    'fade': notification.resources.deuterium == 0,
                            }"
                            v-text="$i18n.$n(notification.resources.deuterium)"
                        />
                    </template>
                </div>
            </template>
        </template>
    </notification>
</template>

<script lang="ts">
    import { CombatTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';

    @Component({
        components: {
            Notification,
        }
    })
    export default class CombatTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: CombatTrackingNotificationMessageData;

        private get title() {
            return `LOCA: ${this.notification.count + this.notification.ignoredEspionageCombats} combats processed.`;
        }

        private get message() {
            return `LOCA: ${this.notification.count} combats were tracked.`;
        }

        private get messageIgnored() {
            return `LOCA: ${this.notification.ignoredEspionageCombats} espionage combats were ignored.`;
        }

        private get hasLoot() {
            return Object.values(this.notification.resources).reduce((acc, cur) => acc + cur, 0) > 0;
        }
    }
</script>
<style lang="scss" scoped>
    .negative-loot {
        color: red;
    }

    .fade {
        color: rgba(white, 0.1);
    }

    .resources-grid {
        display: grid;
        grid-template-columns: repeat(2, 32px 1fr);
        row-gap: 4px;
        column-gap: 8px;
        align-items: center;
    }
</style>