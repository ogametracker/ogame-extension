<template>
    <div class="common-settings">
        <extension-language-settings />
        <conversion-rate-settings />
        <show-converted-resources-in-cells-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ConversionRateSettings from '@/views/stats/components/settings/ConversionRateSettings.vue';
    import ExtensionLanguageSettings from '@stats/components/settings/ExtensionLanguageSettings.vue';
    import ShowConvertedResourcesInCellsSettings from '@stats/components/settings/ShowConvertedResourcesInCellsSettings.vue';

    @Component({
        components: {
            ConversionRateSettings,
            ExtensionLanguageSettings,
            ShowConvertedResourcesInCellsSettings,
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