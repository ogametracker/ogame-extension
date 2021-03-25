<template>
    <tab-view :items="items" vertical>
        <template #overview>
            Übersicht
        </template>
    </tab-view>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import TabView, { TabViewItem } from "../common/TabView.vue";


    @Component({
        components: {
            TabView,
        },
    })
    export default class WreckfieldStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: 'Übersicht',
            },
        ];
    }
</script>