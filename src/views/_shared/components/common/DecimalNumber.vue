<template>
    <span
        :class="{ 'fade-value': value == 0 }"
        v-text="$i18n.$n(Math.trunc(value), format)"
        :fraction="$i18n.$n(value % 1, fractionNumberFormat).substring(1)"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class DecimalNumber extends Vue {
        @Prop({ required: true, type: Number, validator: (n: number) => !isNaN(n) })
        private value!: number;

        @Prop({ required: false, type: Number, default: 2, validator: (n: number) => n > 0 })
        private digits!: number;


        private readonly format: Intl.NumberFormatOptions = {
            maximumFractionDigits: 0,
        };
        private get fractionNumberFormat(): Intl.NumberFormatOptions {
            return {
                minimumFractionDigits: this.digits,
                maximumFractionDigits: this.digits,
            };
        }
    }
</script>
<style lang="scss" scoped>
    .fade-value {
        color: rgba(white, 0.1);

        &[fraction]::after {
            color: rgba(white, 0.1);
        }
    }

    [fraction]::after {
        content: attr(fraction);
        color: rgba(white, 0.333);
        font-size: 0.65em;
    }
</style>