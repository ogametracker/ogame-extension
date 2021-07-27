<template>
    <tab-view :items="items" vertical>
        <template #overview>
            <debris-field-overview />
        </template>
    </tab-view>
</template>

<script lang="ts">
    import i18n from "@/i18n";
    import { Component, Vue } from "vue-property-decorator";
    import { TabViewItem } from "../common/TabView.vue";
    import DebrisFieldOverview from './DebrisFieldOverview.vue';


    @Component({
        components: {
            DebrisFieldOverview,
        },
    })
    export default class DebrisFieldStats extends Vue {
        private readonly items: TabViewItem[] = [
            {
                name: 'overview',
                title: i18n.messages.extension.debrisFieldsMenu.overview,
            },
        ];
    }
</script>