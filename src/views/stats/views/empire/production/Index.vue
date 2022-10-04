<template>
    <tab-view :tabs="tabs" root-route-name="empire/production" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { Tab } from '@stats/components/common/TabView.vue';

    @Component({})
    export default class Index extends Vue {
        private get tabs(): Tab[] {
            return [
                {
                    to: { name: 'empire/production/resources' },
                    label: this.$i18n.$t.extension.empire.production.subHeaders.resourceProduction,
                },
                {
                    to: { name: 'empire/production/mines' },
                    label: this.$i18n.$t.extension.empire.production.subHeaders.mineOverview,
                },
            ];
        }
    }
</script>