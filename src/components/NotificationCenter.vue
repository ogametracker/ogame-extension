<template>
    <div class="notification-center">
        <div
            v-for="noti in notifications"
            :key="noti.id"
            class="notification"
            :class="[
                {
                    hidden: noti.hidden,
                },
                noti.type,
            ]"
            @click="notificationModule.remove(noti)"
        >
            <div class="title">{{ noti.title }}</div>
            <div class="body">{{ noti.text }}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import NotificationModule from '@/store/modules/NotificationModule';

    @Component({})
    export default class NotificationCenter extends Vue {
        private readonly notificationModule = NotificationModule;

        private get notifications() {
            return NotificationModule.notifications;
        }
    }
</script>
<style lang="scss" scoped>
    .notification-center {
        position: fixed;
        top: 0;
        right: 0;
        margin: 8px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
    }

    .notification {
        width: 250px;
        min-height: 80px;
        border-radius: 4px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: opacity 250ms;
        opacity: 1;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.5);

        &.info {
            background: linear-gradient(225deg, #0a3471, #0a1f3c);
        }
        &.success {
            background: linear-gradient(225deg, #3c9c0b, #06540c);
        }
        &.warning {
            background: linear-gradient(225deg, #d48900, #ab4a05);
        }
        &.error {
            background: linear-gradient(225deg, #bd1111, #6f0b0b);
        }

        &.hidden {
            opacity: 0;
        }

        .title {
            text-align: center;
            padding: 12px;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.5);
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        .body {
            text-align: left;
            padding: 12px;
        }
    }
</style>