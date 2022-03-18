<template>
    <div class="misc-settings">
        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: MSU conversion rates'" />
            </div>
            <div class="fake-table-body">
                <msu-conversion-rate-settings />
            </div>
        </div>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: Detailed resource balance'" />
            </div>
            <div class="fake-table-body">
                <detailed-resource-balance-settings />
            </div>
        </div>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: Extension Language'" />
            </div>
            <div class="fake-table-body">
                <extension-language-settings />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import DetailedResourceBalanceSettings from '@stats/components/settings/DetailedResourceBalanceSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExtensionLanguageSettings from '@stats/components/settings/ExtensionLanguageSettings.vue';

    @Component({
        components: {
            DetailedResourceBalanceSettings,
            MsuConversionRateSettings,
            ExtensionLanguageSettings,
        },
    })
    export default class Misc extends Vue {
    }
</script>
<style lang="scss" scoped>
    .misc-settings {
        display: inline-grid;
        row-gap: 16px;
    }

    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;

        &-header {
            background: black
                linear-gradient(
                    0deg,
                    rgba(var(--color), 0.5),
                    rgba(var(--color), 0.5)
                );
            justify-content: center;
        }

        &-header,
        &-body {
            padding: 8px;
            display: flex;
            align-items: center;
        }
    }
</style>