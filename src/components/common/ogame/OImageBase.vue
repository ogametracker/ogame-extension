<template>
    <div
        class="o-image-base"
        :class="{ disabled: disabled }"
        :style="{ 'font-size': size == null ? null : `${size}px` }"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class OImageBase extends Vue {
        @Prop({ required: false, type: Boolean })
        private disabled!: boolean;

        @Prop({ required: false, type: Number })
        private size!: number | null;
    }
</script>

<style lang="scss" scoped>
    .o-image-base {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 4px;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;

        &.disabled {
            filter: grayscale(1);
        }
    }
</style>