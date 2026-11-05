<template>
    <span
        class="decimal-number"
        :class="{
            'fade-value': value == 0,
            'fade-decimals': fadeDecimals,
            'small-fraction': smallFraction,
        }"
    >
        <span v-if="prefix != ''" v-text="prefix" />

        <span v-text="$i18n.$n(integerValue, format)" />
        <span v-if="digits > 0" class="fraction" v-text="$i18n.$n(decimalValue, fractionNumberFormat).substring(1)" />

        <span v-if="suffix != ''" v-text="suffix" />
    </span>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class DecimalNumber extends Vue {
        @Prop({ required: true, type: Number, validator: (n: number) => !isNaN(n) })
        private value!: number;

        @Prop({ required: false, type: Number, default: 2, validator: (n: number) => n >= 0 })
        private digits!: number;

        @Prop({ required: false, type: Boolean, default: true })
        private fadeDecimals!: boolean;

        @Prop({ required: false, type: String, default: () => '' })
        private prefix!: string;

        @Prop({ required: false, type: String, default: () => '' })
        private suffix!: string;

        @Prop({ required: false, type: Boolean, default: true })
        private smallFraction!: boolean;


        private readonly format: Intl.NumberFormatOptions = {
            maximumFractionDigits: 0,
        };
        private get fractionNumberFormat(): Intl.NumberFormatOptions {
            return {
                minimumFractionDigits: this.digits,
                maximumFractionDigits: this.digits,
            };
        }

        private get decimalValue() {
            return Math.abs(this.value) % 1;
        }
        private get integerValue() {
            const dec = this.decimalValue;
            const value = Math.trunc(this.value);

            if(dec > 0.9995 && dec < 1) {
                return value + 1;
            }
            return value;
        }
    }
</script>
<style lang="scss" scoped>
    .decimal-number {
        --small-fraction-size: 0.65em;

        &.fade-value {
            color: rgba(white, 0.1);

            .fraction {
                color: rgba(white, 0.1);
            }
        }

        &.small-fraction .fraction {
            font-size: var(--small-fraction-size);
        }

        &.fade-decimals .fraction {
            color: rgba(white, 0.333);
        }
    }
</style>