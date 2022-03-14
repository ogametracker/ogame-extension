<template>
    <button class="reset-button" @click="$emit('reset')" title="'LOCA: Reset'">
        <span class="mdi mdi-refresh" />
    </button>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ResetButton extends Vue {
    }
</script>
<style lang="scss" scoped>
    .reset-button {
        font-size: 14px;
        display: inline-flex;
        align-items: baseline;
        cursor: pointer;
        margin-left: 8px;
        background: none;
        padding: 0 4px;

        &:hover {
            background: rgba(var(--color), 0.3);
        }

        > .mdi {
            transform: scale(1.3);
        }
    }
</style>