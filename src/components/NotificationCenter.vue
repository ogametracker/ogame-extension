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