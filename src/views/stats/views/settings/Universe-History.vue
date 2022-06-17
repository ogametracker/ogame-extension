<template>
    <universe-history-tracking-settings />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import UniverseHistoryTrackingSettings from '@stats/components/settings/UniverseHistoryTrackingSettings.vue';

    @Component({
        components: {
            UniverseHistoryTrackingSettings,
        },
    })
    export default class UniverseHistory extends Vue {

    }
</script>