<template>
    <div class="colors">
        <expedition-event-color-settings />
        <expedition-event-size-color-settings />
        <expedition-depletion-color-settings />
        <combat-result-color-settings />
        <resource-color-settings />
        <ship-color-settings />
        <lifeform-discovery-color-settings />
        <lifeform-color-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionEventColorSettings from '@/views/stats/components/settings/colors/ExpeditionEventColorSettings.vue';
    import ExpeditionEventSizeColorSettings from '@/views/stats/components/settings/colors/ExpeditionEventSizeColorSettings.vue';
    import ExpeditionDepletionColorSettings from '@/views/stats/components/settings/colors/ExpeditionDepletionColorSettings.vue';
    import CombatResultColorSettings from '@/views/stats/components/settings/colors/CombatResultColorSettings.vue';
    import ResourceColorSettings from '@/views/stats/components/settings/colors/ResourceColorSettings.vue';
    import ShipColorSettings from '@/views/stats/components/settings/colors/ShipColorSettings.vue';
    import LifeformColorSettings from '@/views/stats/components/settings/colors/LifeformColorSettings.vue';
    import LifeformDiscoveryColorSettings from '@/views/stats/components/settings/colors/LifeformDiscoveryColorSettings.vue';

    @Component({
        components: {
            ExpeditionEventColorSettings,
            ExpeditionEventSizeColorSettings,
            ExpeditionDepletionColorSettings,
            CombatResultColorSettings,
            ResourceColorSettings,
            ShipColorSettings,
            LifeformColorSettings,
            LifeformDiscoveryColorSettings,
        },
    })
    export default class Colors extends Vue {
    }
</script>
<style lang="scss" scoped>
    .colors {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        flex-wrap: wrap;
    }
</style>