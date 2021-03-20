<template>
    <div id="ogame-tracker-dialog">
        <test :items="testItems" >
            <template #first>
                First tab content
            </template>
            <template #look>
                <b-button>Look Mum, no hands!</b-button>
            </template>
        </test>
        <stats-dialog v-model="visible" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import StatsDialog from "./components/StatsDialog.vue";

    import Test, { TabItem } from '@/components/common/Test.vue';

    @Component({
        components: { StatsDialog, Test },
    })
    export default class App extends Vue {
        private visible = false;

        private testItems: TabItem[] = [
            {
                name: 'first',
                title: 'First Tab',
            },
            {
                name: 'look',
                title: 'Hey i am pretty cool',
            }
        ];

        private async mounted() {
            (window as any).ogameTracker = this;
        }
    }
</script>