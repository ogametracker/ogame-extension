<template>
    <div
        class="o-alliance-class"
        :class="{
            'o-alliance-class--disabled': disabled,
            'o-alliance-class--fade': fade,
        }"
        :style="{
            'background-image': `url(/img/ogame/alliance-classes/${image}.png)`,
            'font-size': size,
        }"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { AllianceClass, AllianceClasses } from '@ogame-tracker/shared/models/ogame/classes/AllianceClass';

const props = defineProps({
    allianceClass: { required: true, type: String as PropType<AllianceClass>, validator: (value: string) => (AllianceClasses as string[]).includes(value) },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean },
    fade: { required: false, type: Boolean },
});

const image = computed(() => imageMap[props.allianceClass]);

const imageMap: Record<AllianceClass, string> = {
    [AllianceClass.none]: 'none',
    [AllianceClass.researcher]: 'researcher',
    [AllianceClass.trader]: 'trader',
    [AllianceClass.warrior]: 'warrior',
};
</script>

<style lang="scss" scoped>
    .o-alliance-class {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
        &--fade {
            opacity: 0.3;
        }
    }
</style>
