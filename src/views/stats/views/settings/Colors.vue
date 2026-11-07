<template>
    <div class="colors">
        <ExpeditionEventColorSettings />
        <ExpeditionEventSizeColorSettings />
        <ExpeditionDepletionColorSettings />
        <CombatResultColorSettings />
        <ResourceColorSettings />
        <ShipColorSettings />
        <LifeformDiscoveryColorSettings />
        <LifeformColorSettings />
    </div>
</template>

<script setup lang="ts">
import ExpeditionEventColorSettings from '@stats/components/settings/colors/ExpeditionEventColorSettings.vue';
import ExpeditionEventSizeColorSettings from '@stats/components/settings/colors/ExpeditionEventSizeColorSettings.vue';
import ExpeditionDepletionColorSettings from '@stats/components/settings/colors/ExpeditionDepletionColorSettings.vue';
import CombatResultColorSettings from '@stats/components/settings/colors/CombatResultColorSettings.vue';
import ResourceColorSettings from '@stats/components/settings/colors/ResourceColorSettings.vue';
import ShipColorSettings from '@stats/components/settings/colors/ShipColorSettings.vue';
import LifeformColorSettings from '@stats/components/settings/colors/LifeformColorSettings.vue';
import LifeformDiscoveryColorSettings from '@stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';
</script>

<style lang="scss" scoped>
.colors {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex-wrap: wrap;
}
</style>
