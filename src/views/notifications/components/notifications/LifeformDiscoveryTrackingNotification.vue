<template>
    <notification type="info" :title="title" :timeout="10000" @remove="$emit('remove')">
        <template #message>
            <div v-text="message" />

            <template v-if="notification.newLifeforms.length > 0">
                <hr />
                <div class="result-grid">
                    <template v-for="lifeform in notification.newLifeforms">
                        <o-lifeform :lifeform="lifeform" class="icon" :key="`icon-${lifeform}`" />
                        <span v-text="$i18n.$t.lifeforms[lifeform]" :key="`name-${lifeform}`" />
                    </template>
                </div>
            </template>

            <template v-if="foundExperience">
                <hr />
                <div class="result-grid xp-grid">
                    <template v-for="lifeform in LifeformTypes">
                        <template v-if="notification.lifeformExperience[lifeform] > 0">
                            <o-lifeform :lifeform="lifeform" class="icon" :key="`icon-${lifeform}`" />
                            <span v-text="`+${$i18n.$n(notification.lifeformExperience[lifeform])} XP`" :key="`amount-${lifeform}`" />
                        </template>
                    </template>
                </div>
            </template>

            <hr />
            <div class="result-grid" v-if="showSimplified">
                <template v-if="notification.events.lostShip > 0">
                    <span class="mdi mdi-skull-crossbones-outline" :style="{ color: colors.lostShip }" />
                    <span v-text="$i18n.$n(notification.events.lostShip)" />
                </template>
                <template v-if="lifeformFindingCount > 0">
                    <span class="mdi mdi-star-shooting" :style="{ color: colors.knownLifeformFound }" />
                    <span v-text="$i18n.$n(lifeformFindingCount)" />
                </template>
                <template v-if="notification.events.nothing > 0">
                    <span class="mdi mdi-close" :style="{ color: colors.nothing }" />
                    <span v-text="$i18n.$n(notification.events.nothing)" />
                </template>
            </div>
            <div v-else class="text-grid">
                <template v-if="notification.events.lostShip > 0">
                    <span v-text="$i18n.$t.lifeformDiscoveries.eventTypes.lostShip" />
                    <span v-text="$i18n.$n(notification.events.lostShip)" />
                </template>
                <template v-if="lifeformFindingCount > 0">
                    <span v-text="$i18n.$t.lifeformDiscoveries.lifeformFound" />
                    <span v-text="$i18n.$n(lifeformFindingCount)" />
                </template>
                <template v-if="notification.events.nothing > 0">
                    <span v-text="$i18n.$t.lifeformDiscoveries.eventTypes.nothing" />
                    <span v-text="$i18n.$n(notification.events.nothing)" />
                </template>
            </div>
        </template>
    </notification>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Notification from '../Notification.vue';
    import { SettingsDataModule } from '@/views/stats/data/SettingsDataModule';
    import { LifeformDiscoveryTrackingNotificationMessageData } from '@/shared/messages/notifications';
    import { ValidLifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    @Component({
        components: {
            Notification,
        }
    })
    export default class LifeformDiscoveryTrackingNotification extends Vue {
        @Prop({ required: true, type: Object })
        private notification!: LifeformDiscoveryTrackingNotificationMessageData;

        private get showSimplified() {
            return SettingsDataModule.settings.messageTracking.showSimplifiedResults;
        }

        private get colors() {
            return SettingsDataModule.settings.colors.lifeformDiscoveries;
        }

        private readonly LifeformTypes = ValidLifeformTypes;

        private get count() {
            return Object.values(this.notification.events)
                .reduce((acc, cur) => acc + cur, 0);
        }

        private get lifeformFindingCount() {
            return this.notification.events.newLifeformFound + this.notification.events.knownLifeformFound;
        }

        private get foundExperience() {
            return Object.values(this.notification.lifeformExperience).some(xp => xp > 0);
        }

        private get title() {
            return this.$i18n.$t.notifications.lifeformDiscoveryTracking.title(this.$i18n.$n(this.count));
        }

        private get message() {
            return this.$i18n.$t.notifications.lifeformDiscoveryTracking.message(this.$i18n.$n(this.count));
        }
    }
</script>
<style lang="scss" scoped>
    .result-grid {
        &.xp-grid {
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