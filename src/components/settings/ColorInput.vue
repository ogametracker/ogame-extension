<template>
    <div class="color-input" @click="$refs.input.click()">
        <input
            type="color"
            :value="value"
            @input="$emit('input', $refs.input.value)"
            ref="input"
        />
        
        <div class="color" :style="{ background: value }" />
        <span>{{ label }}</span>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ColorInput extends Vue {
        @Prop({ required: true, type: String })
        private value!: string;

        @Prop({ required: false, type: String, default: '' })
        private label!: string;
    }
</script>

<style lang="scss" scoped>
    .color-input {
        display: inline-flex;
        align-items: center;
        cursor: pointer;

        & > .color {
            height: 24px;
            width: 24px;
            display: inline-block;
            border-radius: 3px;
            margin-right: 4px;
        }

        & > input[type="color"] {
            width: 0;
            height: 0;
            box-sizing: border-box;
            padding: 0;
            border: none;
            transform: scale(0);
            display: inline;
        }
    }
</style>