<template>
    <tab-view :tabs="tabs" root-route-name="combats/resources" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@/views/stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    label: this.$i18n.$t.common.chart,
                    to: { name: 'combats/resources/chart' },
                },
                {
                    label: this.$i18n.$t.common.table,
                    to: { name: 'combats/resources/table' },
                },
            ];
        }
    }
</script>