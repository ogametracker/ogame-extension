<template>
    <page :nav-items="navItems" :root-route-name="rootRoute" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '@stats/components/common/ListNav.vue';

const rootRoute = 'tools';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.tools.signatureGenerator.header,
            to: { name: 'tools/signature-generator' },
        },
        {
            label: translations().extension.tools.scrapyardMerchant.header,
            to: { name: 'tools/scrapyard-merchant' },
        },
        /*TODO: tools
        {
            label: 'LOCA: Expedition Calculator',
            to: { name: 'tools/expedition-calculator' },
        },
        {
            label: 'LOCA: Cost Calculator',
            to: { name: 'tools/cost-calculator' },
        },
        {
            label: 'LOCA: Production Calculator',
            to: { name: 'tools/production-calculator' },
        },
        {
            label: 'LOCA: Construction Queue',
            to: { name: 'tools/construction-queue' },
        },
        {
            label: 'LOCA: Resource Conversion',
            to: { name: 'tools/resource-conversion' },
        },
        */
    ];
});
</script>
