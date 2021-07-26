<template>
    <tab-view :items="items" vertical>
        <template #amortisation>
            <empire-amortisation />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import i18n from "@/i18n";
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "@/components/common/TabView.vue";
    import EmpireAmortisation from './EmpireAmortisation.vue';

    @Component({
        components: {
            TabView,
            EmpireAmortisation,
        },
    })
    export default class EmpireOverview extends Vue {
        private get items(): TabViewItem[] {
            return [
                {
                    name: 'production_buildings',
                    title: 'LOCA: Production + Buildings',
                },
                {
                    name: 'amortisation',
                    title: 'LOCA: Amortisation',
                },
            ];
        }
    }
</script>