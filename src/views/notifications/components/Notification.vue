<template>
    <div
        ref="card"
        class="notification"
        :class="[
            type,
            {
                'notification--right': isNew,
                'notification--remove': remove,
            },
        ]"
        :style="`--saturate: ${saturate}; --self-height: ${height}`"
        @click="animateRemove()"
        @mouseenter="pauseTimer()"
        @mouseleave="resumeTimer()"
    >
        <div class="title">
            <span v-if="title != null" v-text="title" />
            <slot v-else name="title" />
        </div>
        <div class="message">
            <span v-if="message != null" v-text="message" />
            <slot v-else name="message" />
        </div>
        <div
            v-if="timeout > 0"
            class="timer"
            :class="{ 'timer-running': timeoutId != null, 'timer-paused': timeoutId == null, 'hide-timer': remove }"
            :style="`--time-ms: ${timeout}; --time-left-ms: ${timeLeft}`"
        />
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';

    const { timeout = 0, saturate = 0, type, title, message } = defineProps<{
        type: 'info' | 'warning' | 'error';
        title?: string;
        message?: string;
        saturate?: number;
        timeout?: number;
    }>();
    const emit = defineEmits<{ remove: [] }>();

    const card = ref<HTMLElement>();
    const isNew = ref(true);
    const remove = ref(false);
    const height = ref(0);
    const timeLeft = ref(0);
    const timeoutId = ref<number>();

    const pauseEvent = 'ogame-tracker.pause-notifications';
    const resumeEvent = 'ogame-tracker.resume-notifications';
    let paused = false;
    let timerReady = false;
    let timeoutStart = 0;
    let entranceTimer: number | undefined;
    let startTimer: number | undefined;
    let removalTimer: number | undefined;

    onMounted(() => {
        entranceTimer = window.setTimeout(() => {
            height.value = card.value?.clientHeight ?? 0;
            isNew.value = false;
        }, 0);

        if (timeout > 0) {
            timeLeft.value = timeout;
            window.addEventListener(pauseEvent, pauseRemove);
            window.addEventListener(resumeEvent, resumeRemove);
            startTimer = window.setTimeout(() => {
                timerReady = true;
                playRemove();
            }, 100);
        }
    });

    onUnmounted(() => {
        window.removeEventListener(pauseEvent, pauseRemove);
        window.removeEventListener(resumeEvent, resumeRemove);
        window.clearTimeout(entranceTimer);
        window.clearTimeout(startTimer);
        window.clearTimeout(timeoutId.value);
        window.clearTimeout(removalTimer);
    });

    function pauseRemove() {
        paused = true;
        if (timeoutId.value != null) {
            window.clearTimeout(timeoutId.value);
            timeoutId.value = undefined;
            timeLeft.value = Math.max(0, timeLeft.value - (Date.now() - timeoutStart));
        }
    }

    function resumeRemove() {
        paused = false;
        playRemove();
    }

    function playRemove() {
        if (!timerReady || paused || remove.value || timeoutId.value != null) {
            return;
        }

        timeoutStart = Date.now();
        timeoutId.value = window.setTimeout(animateRemove, timeLeft.value + 100);
    }

    function animateRemove() {
        if (remove.value) {
            return;
        }

        window.clearTimeout(timeoutId.value);
        timeoutId.value = undefined;
        remove.value = true;
        removalTimer = window.setTimeout(() => emit('remove'), 200);
    }

    function pauseTimer() {
        window.dispatchEvent(new Event(pauseEvent));
    }

    function resumeTimer() {
        window.dispatchEvent(new Event(resumeEvent));
    }
</script>
<style lang="scss" scoped>
    .notification {
        width: 300px;
        min-height: 100px;
        color: white;
        border: 1px solid rgba(var(--color), calc(0.5 + var(--saturate)));
        border-radius: 4px;
        display: grid;
        grid-template-rows: auto 1fr;
        overflow: hidden;
        background: black;
        user-select: none;
        cursor: pointer;

        will-change: transform, margin-top, margin-bottom;
        transition: transform 100ms cubic-bezier(0.62, 0.18, 0.67, 0.99), margin-top 50ms cubic-bezier(0.62, 0.18, 0.67, 0.99) 100ms,
            margin-bottom 50ms cubic-bezier(0.62, 0.18, 0.67, 0.99) 100ms;

        &.notification--right {
            transform: translateX(150%);
        }
        &.notification--remove {
            transform: translateX(150%);
            margin-bottom: -16px;
            margin-top: calc(-1px * var(--self-height)) !important;
        }

        &:not(.notification--remove:first-of-type) + .notification {
            margin-top: 16px;
        }

        &.info {
            --color: 0, 102, 255;
        }

        &.success {
            --color: 0, 160, 49;
        }

        &.warning {
            --color: 255, 127, 0;
        }

        &.error {
            --color: 197, 27, 0;
        }

        .title {
            padding: 8px;
            background-color: rgba(var(--color), var(--saturate));
            background-image: linear-gradient(-90deg, rgba(var(--color), 0.8), rgba(var(--color), 0.7));
            font-weight: bold;
            text-align: center;
        }

        .message {
            padding: 8px;
            background-color: rgba(var(--color), var(--saturate));
            background-image: linear-gradient(-90deg, rgba(var(--color), 0.5), rgba(var(--color), 0.3));
        }

        .timer {
            margin-top: -2px;
            height: 2px;
            background: rgb(var(--color));
            width: 100%;
            transition: width calc(var(--time-left-ms) * 1ms) linear;

            &.timer-running {
                width: 0;
            }

            &.timer-paused {
                width: calc(100% * var(--time-left-ms) / var(--time-ms));
                transition: none;
            }

            &.hide-timer {
                visibility: hidden;
            }
        }
    }
</style>