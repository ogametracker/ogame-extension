<template>
    <span class="tri-resource">
        <o-resource resource="metal" :size="size" />
        <o-resource resource="crystal" :size="size" />
        <o-resource resource="deuterium" :size="size" />
    </span>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ExpeditionEventResourcesIcon extends Vue {
        @Prop({ required: false, type: String, default: '32px' })
        private size!: string;
    }
</script>
<style lang="scss" scoped>
    .tri-resource {
        position: relative;
        display: flex;

        > .o-resource:not(:last-of-type) {
            position: absolute;
            top: 0;
            left: 0;
        }

        > .o-resource[resource="metal"] {
            clip-path: polygon(0 0, 100% 0, 100% 25%, 50% 60%, 0 25%);
        }

        > .o-resource[resource="crystal"] {
            clip-path: polygon(0 25%, 50% 60%, 50% 100%, 0 100%);
        }

        > .o-resource[resource="deuterium"] {
            clip-path: polygon(100% 25%, 100% 100%, 50% 100%, 50% 60%);
        }
    }
</style>