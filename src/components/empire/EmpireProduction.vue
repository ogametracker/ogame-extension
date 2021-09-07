<template>
    <tab-view vertical :items="items" overflow>
        <template #resources>
            resource production overview
        </template>
        <template #mines>
            <empire-production-mine-levels />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import i18n from '@/i18n';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { TabViewItem } from '../common/TabView.vue';
    import EmpireProductionMineLevels from './EmpireProductionMineLevels.vue';

    @Component({
        components: {
            EmpireProductionMineLevels,
        }
    })
    export default class EmpireProduction extends Vue {

        private get items(): TabViewItem[] {
            return [
                {
                    name: 'resources',
                    title: 'LOCA: Recource Production',
                },
                {
                    name: 'mines',
                    title: 'LOCA: Mine Levels',
                },
            ];
        }
    }
</script>