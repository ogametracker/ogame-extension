<template>
    <div class="notification-center">
        <div
            class="notification"
            v-for="noti in notifications"
            :key="noti.id"
            @click="notificationModule.remove(noti)"
            :class="{
                hidden: noti.hidden,
            }"
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
        padding: 8px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
    }

    .notification {
        width: 200px;
        min-height: 80px;
        background: blue;
        border-radius: 4px;
        margin-bottom: 8px;
        border: 1px solid white;
        cursor: pointer;
        transition: opacity 1s;
        opacity: 1;

        &.hidden {
            opacity: 0;
        }

        .title {
            text-align: center;
            border-bottom: 1px solid white;
            padding: 8px;
        }

        .body {
            text-align: left;
            padding: 8px;
        }
    }
</style>