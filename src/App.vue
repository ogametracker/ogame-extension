<template>
    <div id="ogame-tracker-dialog">
        <stats-dialog v-model="visible" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import StatsDialog from "./components/StatsDialog.vue";

    @Component({
        components: { StatsDialog },
    })
    export default class App extends Vue {
        private visible = false;

        private async mounted() {
            (window as any).ogameTracker = this;
        }
    }
</script>