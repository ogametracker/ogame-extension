<template>
    <div class="grid-table-row">
        <slot />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class GridCell extends Vue {
    }
</script>