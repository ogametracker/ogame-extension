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
        private visible = false;

        private async mounted() {
            (window as any).ogameTracker = this; //TODO: global object with global properties
        }
    }
</script>

<style lang="scss">
    @import "@/styles/colors";

    .ogame-tracker-dialog {
        input,
        select {
            color: inherit;

            &:focus {
                outline: none;
            }
        }

        select > option {
            background: #050505;
            color: inherit;
        }

        color: white;
        font-family: Verdana, Arial, SunSans-Regular, sans-serif;
        font-size: 14px;

        *::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background: none;
        }

        *::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background: rgba(var(--color), 0.35);

            &:hover {
            background: rgba(var(--color), 0.75);
            }
        }
    }
</style>