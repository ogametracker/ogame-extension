<template>
    <tab-view :tabs="tabs" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@/views/stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    label: 'LOCA: Chart',
                    to: { name: 'combats/overview/on-expeditions/chart' },
                },
                {
                    label: 'LOCA: Table',
                    to: { name: 'combats/overview/on-expeditions/table' },
                },
            ];
        }
    }
</script>