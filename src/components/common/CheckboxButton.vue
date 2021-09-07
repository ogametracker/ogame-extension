<template>
    <label
        class="checkbox-button"
        :class="{
            off: !checked,
            simple: label != null || simple,
            light: light,
        }"
        :style="{
            '--button-color': !autoColor ? color : 'rgb(var(--color))',
            height: size == null ? null : `${size}px`,
        }"
        @click="checked = !checked"
    >
        <span v-if="label != null">
            {{ label }}
        </span>
        <slot v-else />
    </label>
</template>

<script lang="ts">
    import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

    @Component({})
    export default class CheckboxButton extends Vue {
        @VModel({ required: true, type: Boolean })
        private checked!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private simple!: boolean;

        @Prop({ required: false, type: Boolean, default: false })
        private light!: boolean;

        @Prop({ required: false, type: String })
        private label!: string | null;

        @Prop({ required: false, type: Number })
        private size!: number | null;

        @Prop({ required: false, type: String, default: 'rgba(255, 255, 255, 0.3)' })
        private color!: string | null;

        @Prop({ required: false, type: Boolean, default: false })
        private autoColor!: boolean;
    }
</script>
<style lang="scss" scoped>
    .checkbox-button {
        margin: 0px 4px;
        border-radius: 3px;
        cursor: pointer;
        display: inline-block;

        color: white;
        &.light {
            color: black;
        }

        &.simple {
            position: relative;
            padding: 8px;
            background-color: var(--button-color);

            &::before {
                content: "";
                border-radius: 3px;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background-color: rgba(black, 0.1);
            }

            &:hover::before {
                background-color: var(--button-color);
                opacity: 0.5;
            }

            &.off {
                box-shadow: inset 0 0 0 2px var(--button-color);
                color: var(--button-color);
                background-color: unset;
            }
        }
    }
</style>