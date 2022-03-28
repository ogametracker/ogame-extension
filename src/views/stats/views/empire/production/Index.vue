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
                    to: { name: 'empire/production/resources' },
                    label: 'LOCA: Resources',
                },
                {
                    to: { name: 'empire/production/mines' },
                    label: 'LOCA: Mines',
                },
            ];
        }
    }
</script>