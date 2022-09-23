<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/resources/size-breakdown/metal" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'expeditions/resources/size-breakdown/metal/chart' },
                    label: this.$i18n.$t.extension.common.chart,
                },
                {
                    to: { name: 'expeditions/resources/size-breakdown/metal/table' },
                    label: this.$i18n.$t.extension.common.table,
                },
            ];
        }
    }
</script>