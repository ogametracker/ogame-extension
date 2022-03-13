<template>
    <tab-view :tabs="tabs" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'empire/amortization/resource-production' },
                    label: 'LOCA: Resource Production',
                },
                {
                    to: { name: 'empire/amortization/energy-production' },
                    label: 'LOCA: Energy Production',
                },
            ];
        }
    }
</script>