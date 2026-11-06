<template>
    <div class="combat-settings">
        <LostShipResourceUnitsFactorSettings />
        <CombatTrackingIgnoreEspionageCombatsSettings />
    </div>
</template>

<script setup lang="ts">
import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';
</script>

<style lang="scss" scoped>
    .combat-settings {
        display: grid;
        row-gap: 16px;
    }
</style>
