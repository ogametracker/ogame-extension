<template>
    <tab-view :tabs="tabs" root-route-name="combats/lost-ships/on-expeditions/resources" />
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
                    to: { name: 'combats/lost-ships/on-expeditions/resources/chart' },
                },
                {
                    label: 'LOCA: Table',
                    to: { name: 'combats/lost-ships/on-expeditions/resources/table' },
                },
            ];
        }
    }
</script>