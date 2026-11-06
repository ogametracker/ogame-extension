<template>
    <div class="page">
        <ListNav :items="navItems" :root-route-name="rootRouteName" />

        <div class="page-content">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import ListNav from '@stats/components/common/ListNav.vue';
import { RouterView } from 'vue-router';
import type { PropType } from 'vue';
import type { ListNavItem } from './ListNav.vue';

defineProps({
    navItems: { required: true, type: Array as PropType<ListNavItem[]> },
    rootRouteName: { required: false, type: String as PropType<string | null>, default: () => null },
});
</script>

<style lang="scss" scoped>
.page {
    display: grid;
    grid-template-columns: auto 1fr;
    height: 100%;
    column-gap: 16px;
}

.page-content {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
