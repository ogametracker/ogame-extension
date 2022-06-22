<template>
    <div class="common-settings">
        <msu-conversion-rate-settings />
        <extension-language-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import MsuConversionRateSettings from '@stats/components/settings/MsuConversionRateSettings.vue';
    import ExtensionLanguageSettings from '@stats/components/settings/ExtensionLanguageSettings.vue';

    @Component({
        components: {
            MsuConversionRateSettings,
            ExtensionLanguageSettings,
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