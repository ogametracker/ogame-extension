<template>
    <div id="ogame-tracker-dialog" class="ogame-tracker-dialog">
        <stats-dialog v-model="visible" />
        <notification-center />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import StatsDialog from "./StatsDialog.vue";
    import NotificationCenter from './NotificationCenter.vue';

    @Component({
        components: {
            StatsDialog,
            NotificationCenter,
        },
    })
    export default class App extends Vue {
        public visible = false;

        private async mounted() {
            (window as any).ogameTracker = this;
        }
    }
</script>