<template>
    <div class="combat-settings">
        <lost-ship-resource-units-factor-settings />
        <combat-tracking-ignore-espionage-combats-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import LostShipResourceUnitsFactorSettings from '@stats/components/settings/LostShipResourceUnitsFactorSettings.vue';
    import CombatTrackingIgnoreEspionageCombatsSettings from '@stats/components/settings/CombatTrackingIgnoreEspionageCombatsSettings.vue';

    @Component({
        components: {
            LostShipResourceUnitsFactorSettings,
            CombatTrackingIgnoreEspionageCombatsSettings,
        },
    })
    export default class Combats extends Vue {
    }
</script>
<style lang="scss" scoped>
    .combat-settings {
        display: grid;
        row-gap: 16px;
    }
</style>