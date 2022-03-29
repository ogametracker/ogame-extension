<template>
    <tab-view :tabs="tabs" root-route-name="expeditions/dark-matter/sizes" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'expeditions/dark-matter/sizes/chart' },
                    label: 'LOCA: Chart',
                },
                {
                    to: { name: 'expeditions/dark-matter/sizes/table' },
                    label: 'LOCA: Table',
                },
            ];
        }
    }
</script>