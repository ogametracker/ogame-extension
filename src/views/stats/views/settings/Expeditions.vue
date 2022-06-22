<template>
    <div>
        <expedition-ship-resource-units-factor-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ExpeditionShipResourceUnitsFactorSettings from '@stats/components/settings/ExpeditionShipResourceUnitsFactorSettings.vue';

    @Component({
        components: {
            ExpeditionShipResourceUnitsFactorSettings,
        },
    })
    export default class Expeditions extends Vue {
        
    }
</script>