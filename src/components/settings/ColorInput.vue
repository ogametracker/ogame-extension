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