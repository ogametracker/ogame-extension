<template>
    <div>
        <router-link :to="{ name: 'expeditions/dark-matter/count/chart' }">
            <span class="mdi mdi-chart-areaspline" />
        </router-link>
        <router-link :to="{ name: 'expeditions/dark-matter/count/table' }">
            <span class="mdi mdi-table" />
        </router-link>

        <router-view />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Index extends Vue {
    }
</script>