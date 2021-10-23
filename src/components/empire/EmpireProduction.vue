<template>
    <tab-view vertical :items="items" overflow>
        <template #resources>
            <empire-production-resources />
        </template>
        <template #mines>
            <empire-production-mine-levels />
        </template>
    </tab-view>
</template>

<script lang="ts">
    
    import { Component, Vue } from 'vue-property-decorator';
    import { TabViewItem } from '../common/TabView.vue';
    import EmpireProductionMineLevels from './EmpireProductionMineLevels.vue';
    import EmpireProductionResources from './EmpireProductionResources.vue';

    @Component({
        components: {
            EmpireProductionMineLevels,
            EmpireProductionResources,
        }
    })
    export default class EmpireProduction extends Vue {

        private get items(): TabViewItem[] {
            return [
                {
                    name: 'resources',
                    title: this.$i18n.$t.empire.productionOverview.subMenu.resources,
                },
                {
                    name: 'mines',
                    title: this.$i18n.$t.empire.productionOverview.subMenu.mines,
                },
            ];
        }
    }
</script>