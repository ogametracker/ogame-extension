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
                    to: { name: 'expeditions/ships/resources/chart' },
                    label: 'LOCA: Chart',
                },
                {
                    to: { name: 'expeditions/ships/resources/table' },
                    label: 'LOCA: Table',
                },
            ];
        }
    }
</script>