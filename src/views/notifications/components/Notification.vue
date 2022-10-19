<template>
    <div
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
            v-if="timeout != 0"
            class="timer"
            :class="{ 'timer-running': timeoutId != null, 'timer-paused': timeoutId == null, 'hide-timer': remove }"
            :style="`--time-ms: ${timeout}; --time-left-ms: ${timeLeft}`"
        />
    </div>
</template>

<script lang="ts">
    import { delay } from '@/shared/utils/delay';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Notification extends Vue {
        @Prop({ required: true, type: String })
        private type!: string;

        @Prop({ required: false, type: String, default: null })
        private title!: string | null;

        @Prop({ required: false, type: String, default: null })
        private message!: string | null;

        @Prop({ required: false, type: Number, default: 0 })
        private saturate!: number;

        @Prop({ required: false, type: Number, default: null })
        private timeout!: number | null;

        private isNew = true;
        private remove = false;
        private height = 0;

        private timeLeft = 0;
        private timeoutStart = 0;
        private timeoutId: number | null = null;
        private readonly timeoutRemoveBuffer = 100;

        private async mounted() {
            await delay(0);
            this.height = this.$el.clientHeight;
            this.isNew = false;

            if (this.timeout != null) {
                this.timeLeft = this.timeout;
                await delay(100);

                window.addEventListener('ogame-tracker.pause-notifications', () => this.pauseRemove());
                window.addEventListener('ogame-tracker.resume-notifications', () => this.playRemove());

                this.playRemove();
            }
        }

        private pauseRemove() {
            if (this.timeLeft <= 0) {
                return;
            }

            clearTimeout(this.timeoutId ?? undefined);
            this.timeoutId = null;
            this.timeLeft = Math.max(0, this.timeLeft - (Date.now() - this.timeoutStart));
        }

        private playRemove() {
            if (this.timeLeft <= 0) {
                return;
            }

            this.timeoutStart = Date.now();
            this.timeoutId = setTimeout(async () => {
                await this.animateRemove();
            }, this.timeLeft + this.timeoutRemoveBuffer);
        }

        private async animateRemove() {
            this.remove = true;
            await delay(200); // timeout must be greater than the transition time

            this.$emit('remove');
        }

        private pauseTimer() {
            window.dispatchEvent(new Event('ogame-tracker.pause-notifications'));
        }

        private resumeTimer() {
            window.dispatchEvent(new Event('ogame-tracker.resume-notifications'));
        }
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