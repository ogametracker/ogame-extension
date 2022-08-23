<template>
    <tab-view :tabs="tabs" root-route-name="empire/lifeforms/discoveries/overview" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'empire/lifeforms/discoveries/overview/chart' },
                    label: this.$i18n.$t.common.chart,
                },
                {
                    to: { name: 'empire/lifeforms/discoveries/overview/table' },
                    label: this.$i18n.$t.common.table,
                },
            ];
        }
    }
</script>