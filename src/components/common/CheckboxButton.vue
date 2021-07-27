<template>
    <label
        class="checkbox-button"
        :class="{ off: !checked }"
        :style="{
            '--button-color': color,
        }"
        @click="checked = !checked"
    >
        {{ label }}
    </label>
</template>

<script lang="ts">
    import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

    @Component({})
    export default class CheckboxButton extends Vue {
        @VModel({ required: true, type: Boolean })
        private checked!: boolean;

        @Prop({ required: true, type: String })
        private label!: string;

        @Prop({ required: false, type: String, default: 'rgba(255, 255, 255, 0.3)' })
        private color!: string | null;
    }
</script>
<style lang="scss" scoped>
    .checkbox-button {
        padding: 8px;
        border-radius: 3px;
        position: relative;
        margin: 0px 4px;
        cursor: pointer;
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
            color: var(--button-color);
            box-shadow: inset 0 0 0 2px var(--button-color);
            background-color: unset;
        }
    }
</style>