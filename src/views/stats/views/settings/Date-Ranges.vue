<template>
    <date-range-settings />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import DateRangeSettings from '@stats/components/settings/DateRangeSettings.vue';

    @Component({
        components: {
            DateRangeSettings,
        },
    })
    export default class DateRanges extends Vue {
    }
</script>