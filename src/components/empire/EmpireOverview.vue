<template>
    <tab-view :items="items" vertical>
        <template #production_buildings>
            <empire-production />
        </template>
        <template #amortisation>
            <empire-amortisation />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { TabViewItem } from "@/components/common/TabView.vue";
    import EmpireAmortisation from './EmpireAmortisation.vue';
    import EmpireProduction from './EmpireProduction.vue';
    

    @Component({
        components: {
            EmpireProduction,
            EmpireAmortisation,
        },
    })
    export default class EmpireOverview extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'production_buildings',
                    title: this.$i18n.$t.empire.productionOverview.menuItem,
                },
                {
                    name: 'amortisation',
                    title: this.$i18n.$t.empire.amortisation.menuItem,
                },
            ];
        }
    }
</script>