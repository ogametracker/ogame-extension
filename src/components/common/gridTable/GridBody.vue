<template>
    <div class="grid-table-body">
        <slot />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({})
    export default class GridBody extends Vue {
    }
</script>