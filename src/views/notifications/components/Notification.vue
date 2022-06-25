<template>
    <div class="notification" :class="type">
        <div class="title">
            <span v-if="title != null" v-text="title" />
            <slot v-else name="title" />
        </div>
        <div class="message">
            <span v-if="message != null" v-text="message" />
            <slot v-else name="message" />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Notification extends Vue {
        @Prop({ required: true, type: String })
        private type!: string;

        @Prop({ required: false, type: String, default: null })
        private title!: string | null;

        @Prop({ required: false, type: String, default: null })
        private message!: string | null;
    }
</script>
<style lang="scss" scoped>
    .notification {
        width: 300px;
        min-height: 100px;
        color: white;
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        grid-template-rows: auto 1fr;
        overflow: hidden;

        &.info {
            --color: 0, 102, 255;
        }

        &.success {
            --color: 0, 160, 49;
        }

        &.warning {
            --color: 255, 165, 0;
        }

        &.error {
            --color: 197, 27, 0;
        }

        .title {
            padding: 8px;
            background: black
                linear-gradient(
                    135deg,
                    rgba(var(--color), 0.6),
                    rgba(var(--color), 0.7)
                );
            font-weight: bold;
        }

        .message {
            padding: 8px;
            background: black
                linear-gradient(
                    135deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.4)
                );
        }
    }
</style>