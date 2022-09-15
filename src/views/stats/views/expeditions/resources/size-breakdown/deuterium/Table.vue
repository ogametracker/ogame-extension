<template>
    <size-table resource="deuterium" />
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SizeTable from '@stats/components/expeditions/resources/sizes-by-resource/Table.vue';

    @Component({
        components: {
            SizeTable,
        },
    })
    export default class Table extends Vue {
    }
</script>