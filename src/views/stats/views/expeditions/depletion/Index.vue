<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/depletion" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@/views/stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    label: this.$i18n.$t.extension.common.chart,
                    to: { name: 'expeditions/depletion/chart' },
                },
                {
                    label: this.$i18n.$t.extension.common.table,
                    to: { name: 'expeditions/depletion/table' },
                },
            ];
        }
    }
</script>