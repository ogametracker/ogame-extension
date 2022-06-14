<template>
    <button class="reset-button" @click="$emit('reset')" :title="$i18n.$t.settings.reset">
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
        background: rgba(var(--color), 0.25) !important;
        font-size: 14px;
        display: inline-flex;
        align-items: baseline;
        cursor: pointer;
        margin-left: 8px;
        background: none;
        padding: 0 4px;

        &:hover {
            background: rgba(var(--color), 0.5) !important;
        }

        > .mdi {
            transform: scale(1.3);
        }
    }
</style>