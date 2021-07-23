<template>
    <div class="color-input" @click="input.click()">
        <input
            type="color"
            :value="value"
            @input="debounceInput()"
            ref="input"
        />

        <div class="color" :style="{ background: value }" />
        <span>{{ label }}</span>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ColorInput extends Vue {
        @Prop({ required: true, type: String })
        private value!: string;

        @Prop({ required: false, type: String, default: '' })
        private label!: string;

        @Ref('input')
        private input!: HTMLInputElement;

        private timeout_input: number | null = null;
        private debounceInput() {
            if (this.timeout_input != null) {
                clearTimeout(this.timeout_input);
            }

            this.timeout_input = setTimeout(() => {
                this.$emit('input', this.input.value);
            }, 200);
        }
    }
</script>