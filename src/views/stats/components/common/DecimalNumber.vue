<template>
    <span
        class="decimal-number"
        :class="{
            'fade-value': value == 0,
            'fade-decimals': fadeDecimals,
            'small-fraction': smallFraction,
        }"
    >
        <span v-if="prefix != ''" class="prefix" v-text="prefix" />

        <span class="integer" v-text="formatNumber(integerValue, format)" />
        <span
            v-if="digits > 0"
            class="fraction"
            v-text="formatNumber(decimalValue, fractionNumberFormat).substring(1)"
        />

        <span v-if="suffix != ''" class="suffix" v-text="suffix" />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatNumber } from '@stats/i18n';

const props = defineProps({
    value: { required: true, type: Number, validator: (n: number) => !isNaN(n) },
    digits: { required: false, type: Number, default: 2, validator: (n: number) => n >= 0 },
    fadeDecimals: { required: false, type: Boolean, default: true },
    prefix: { required: false, type: String, default: () => '' },
    suffix: { required: false, type: String, default: () => '' },
    smallFraction: { required: false, type: Boolean, default: true },
});

const format: Intl.NumberFormatOptions = {
    maximumFractionDigits: 0,
};

const fractionNumberFormat = computed<Intl.NumberFormatOptions>(() => {
    return {
        minimumFractionDigits: props.digits,
        maximumFractionDigits: props.digits,
    };
});

const decimalValue = computed(() => Math.abs(props.value) % 1);

const integerValue = computed(() => {
    const dec = decimalValue.value;
    const value = Math.trunc(props.value);

    if (dec > 0.9995 && dec < 1) {
        return value + 1;
    }
    return value;
});
</script>

<style lang="scss" scoped>
.decimal-number {
    --small-fraction-size: 0.65em;

    .prefix,
    .integer,
    .fraction,
    .suffix {
        all: unset;
    }

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
