<template>
    <span class="tri-resource">
        <o-resource :resource="ResourceType.metal" :size="size" />
        <o-resource :resource="ResourceType.crystal" :size="size" />
        <o-resource :resource="ResourceType.deuterium" :size="size" />
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
    import OResource from './ogame/OResource.vue';

    export default defineComponent({
        components: { OResource },
        props: { size: { type: String, default: '32px' } },
        setup: () => ({ ResourceType }),
    });
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