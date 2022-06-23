<template>
    <div id="app">
        <div
            v-for="(notification, id) in notifications"
            :key="id"
            class="notification"
        />
    </div>
</template>

<script lang="ts">
    import { ogameTrackerNotificationWindowResizeEventName } from '@/shared/messages/communication';
    import { Message, MessageOgameMeta } from '@/shared/messages/Message';
    import { MessageType } from '@/shared/messages/MessageType';
    import { NotificationMessage } from '@/shared/messages/notifications';
    import { ogameMetasEqual } from '@/shared/ogame-web/ogameMetasEqual';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { _throw } from '@/shared/utils/_throw';
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { v4 } from 'uuid';

    @Component({})
    export default class App extends Vue {
        private readonly notifications: Record<string, any> = {};
        private ogameMeta: MessageOgameMeta = {
            language: '',
            serverId: 0,
            playerId: 0,
        }

        @Watch('notifications', { deep: true })
        private async onNotificationChanged() {
            await this.$nextTick();

            window.parent.postMessage({
                type: ogameTrackerNotificationWindowResizeEventName,
                width: this.$el.clientWidth,
                height: this.$el.clientHeight,
            }, '*');
        }

        private mounted() {
            document.querySelector('#splashscreen')?.remove();

            const params = new URLSearchParams(location.search);
            this.ogameMeta = {
                language: params.get('language') ?? _throw('expected language query parameter'),
                serverId: parseIntSafe(params.get('server') ?? _throw('expected server query parameter'), 10),
                playerId: parseIntSafe(params.get('player') ?? _throw('expected player query parameter'), 10),
            };


            chrome.runtime.onMessage.addListener(async message => await this.onMessage(message));
        }

        private async onMessage(message: Message<MessageType, any>) {
            if (message.type != MessageType.Notification) {
                return;
            }
            if (!ogameMetasEqual(message.ogameMeta, this.ogameMeta)) {
                return;
            }

            const msg = message as NotificationMessage;
            this.$set(this.notifications, msg.data.messageId ?? v4(), {});
        }
    }
</script>

<style lang="scss" scoped>
    #app {
        width: max-content;
    }

    .notification {
        width: 250px;
        height: 100px;
        background: red;
    }
</style>
