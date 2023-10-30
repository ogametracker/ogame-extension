<template>
    <span class="checkbox" @click="onClick($event)" :class="{disabled: disabled}">
        <span class="checkmark">
            <span class="mdi" :style="{ color: color }" :class="checked ? 'mdi-checkbox-blank' : 'mdi-checkbox-blank-outline'" />
            <span class="check-icon mdi mdi-check" v-if="checked" :style="{ color: checkColor }"/>
        </span>

        <span v-if="$slots.label != null">
            <slot name="label" />
        </span>
        <span v-else-if="label != null" v-text="label" />
    </span>
</template>

<script lang="ts">
    import { Component, Prop, Vue, VModel } from 'vue-property-decorator';

    @Component({})
    export default class Checkbox extends Vue {

        @VModel({ required: true, type: Boolean })
        private checked!: boolean;

        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: String, default: () => null })
        private color!: string | null;

        @Prop({ required: false, type: String, default: () => null })
        private checkColor!: string | null;

        @Prop({ required: false, type: String, default: () => null })
        private label!: string | null;

        private onClick(event: MouseEvent) {
            this.checked = !this.checked;

            this.$emit('input-extended', {
                value: this.checked,
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                alt: event.altKey,
            });
        }
    }
</script>
<style lang="scss" scoped>
    .checkbox {
        display: inline-flex;
        cursor: pointer;
        column-gap: 2px;
        align-items: center;

        .checkmark {
            color: rgb(var(--color));
            font-size: 20px;
            position: relative;

            > .check-icon {
                color: white;
                transform: scale(0.75);
                display: inline-block;
                position: absolute;
                left: 0;
                top: 0;
            }
        }

        &.disabled {
            pointer-events: none;
            cursor: default;
            --color: 80, 80, 80;
            color: #888888;
        }
    }
</style>