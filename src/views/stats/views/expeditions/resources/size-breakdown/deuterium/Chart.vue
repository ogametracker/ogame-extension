<template>
    <size-chart resource="deuterium" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SizeChart from '@stats/components/expeditions/resources/sizes-by-resource/Chart.vue';

    @Component({
        components: {
            SizeChart,
        },
    })
    export default class Chart extends Vue {
    }
</script>