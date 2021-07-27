<template>
    <div class="grid-table-head">
        <slot />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class GridHead extends Vue {
    }
</script>