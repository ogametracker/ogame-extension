<template>
    <div>
        <detailed-resource-balance-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import DetailedResourceBalanceSettings from '@stats/components/settings/DetailedResourceBalanceSettings.vue';

    @Component({
        components: {
            DetailedResourceBalanceSettings,
        },
    })
    export default class ResourceBalance extends Vue {


    }
</script>