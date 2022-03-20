<template>
    <div class="misc-settings">
        <msu-conversion-rate-settings />
        <expedition-ship-resource-units-factor-settings />
        <lost-ship-resource-units-factor-settings />
        <detailed-resource-balance-settings />
        <extension-language-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import DetailedResourceBalanceSettings from '@stats/components/settings/DetailedResourceBalanceSettings.vue';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';
    import ExtensionLanguageSettings from '@stats/components/settings/ExtensionLanguageSettings.vue';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';

    @Component({
        components: {
            DetailedResourceBalanceSettings,
            MsuConversionRateSettings,
            ExpeditionShipResourceUnitsFactorSettings,
            LostShipResourceUnitsFactorSettings,
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
</style>