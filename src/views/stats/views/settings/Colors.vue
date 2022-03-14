<template>
    <div>
        <div style="display: flex; align-items: flex-start; column-gap: 8px">
            <expedition-event-color-settings />
            <expedition-event-size-color-settings />
            <combat-result-color-settings />
            <resource-color-settings />
            <ship-color-settings />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ExpeditionEventColorSettings from '@/views/stats/components/settings/colors/ExpeditionEventColorSettings.vue';
    import ExpeditionEventSizeColorSettings from '@/views/stats/components/settings/colors/ExpeditionEventSizeColorSettings.vue';
    import CombatResultColorSettings from '@/views/stats/components/settings/colors/CombatResultColorSettings.vue';
    import ResourceColorSettings from '@/views/stats/components/settings/colors/ResourceColorSettings.vue';
    import ShipColorSettings from '@/views/stats/components/settings/colors/ShipColorSettings.vue';

    @Component({
        components: {
            ExpeditionEventColorSettings,
            ExpeditionEventSizeColorSettings,
            CombatResultColorSettings,
            ResourceColorSettings,
            ShipColorSettings,
        },
    })
    export default class Colors extends Vue {
    }
</script>