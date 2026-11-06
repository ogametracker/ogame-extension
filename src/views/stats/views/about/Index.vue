<template>
    <Page :nav-items="navItems" />
</template>

<script setup lang="ts">
import Page from '@stats/components/common/Page.vue';
import { computed } from 'vue';
import { translations } from '@stats/i18n';
import type { ListNavItem } from '../../components/common/ListNav.vue';

const navItems = computed<ListNavItem[]>(() => {
    return [
        {
            label: translations().extension.about.info.header,
            to: { name: 'about/info' },
        },
        {
            label: translations().extension.about.faqHelp.header,
            to: { name: 'about/help' },
        },
    ];
});
</script>
