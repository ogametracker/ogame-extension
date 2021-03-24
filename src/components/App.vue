<template>
    <div id="ogame-tracker-dialog" class="ogame-tracker-dialog">
        <stats-dialog v-model="visible" />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import StatsDialog from "./StatsDialog.vue";

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

<style lang="scss">
    @import '@/styles/colors';

    .ogame-tracker-dialog {
        input, select {
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
            background: #545454;
        }
    }
</style>