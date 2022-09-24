<template>
    <tab-view :tabs="tabs" root-route-name="combats/overview/against-players" />
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
                    to: { name: 'combats/overview/against-players/chart' },
                },
                {
                    label: this.$i18n.$t.extension.common.table,
                    to: { name: 'combats/overview/against-players/table' },
                },
            ];
        }
    }
</script>