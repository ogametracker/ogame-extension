<template>
    <b-tabs
        class="min-max-h-100 flex-nowrap"
        vertical
        pills
        content-class="min-max-h-100 flex-grow-1"
        active-tab-class="min-max-w-100 min-max-h-100 d-flex"
        nav-class="h-100"
        nav-wrapper-class="pr-0"
    >
        <b-tab title="Übersicht">
            <expedition-overview />
        </b-tab>
        <b-tab title="Rohstofffunde"> <expedition-resources /> </b-tab>
        <b-tab title="Flottenfunde"> Flottenfunde </b-tab>
        <b-tab title="DM-Funde"> DM-Funde </b-tab>
        <b-tab title="Itemfunde"> Itemfunde </b-tab>
        <b-tab title="Verteilung in %"> Prozentuale Verteilung </b-tab>
    </b-tabs>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import ExpeditionOverview from "./overview/ExpeditionOverview.vue";
    import ExpeditionResources from "./resources/ExpeditionResources.vue";

    @Component({
        components: {
            ExpeditionOverview,
            ExpeditionResources,
        },
    })
    export default class ExpeditionStats extends Vue { }
</script>