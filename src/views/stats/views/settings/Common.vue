<template>
    <div class="common-settings">
        <extension-language-settings />
        <msu-conversion-rate-settings />
        <show-msu-cells-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExtensionLanguageSettings from '@stats/components/settings/ExtensionLanguageSettings.vue';
    import ShowMsuCellsSettings from '@stats/components/settings/ShowMsuCellsSettings.vue';

    @Component({
        components: {
            MsuConversionRateSettings,
            ExtensionLanguageSettings,
            ShowMsuCellsSettings,
        },
    })
    export default class Misc extends Vue {
    }
</script>
<style lang="scss" scoped>
    .common-settings {
        display: grid;
        row-gap: 16px;
    }
</style>