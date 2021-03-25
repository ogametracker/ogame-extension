<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <wreckfield-overview />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "../common/TabView.vue";
    import WreckfieldOverview from './WreckfieldOverview.vue';


    @Component({
        components: {
            TabView,
            WreckfieldOverview,
        },
    })
    export default class WreckfieldStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: this.$t('extension.wreckfieldMenu.overview') as string,
            },
        ];
    }
</script>