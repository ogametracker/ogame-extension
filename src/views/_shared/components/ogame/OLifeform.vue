<template>
    <div
        class="o-lifeform"
        :class="[
            {
                'o-lifeform--disabled': disabled,
                'o-lifeform--fade': fade,
            },
            `o-lifeform--${lifeform}`,
        ]"
        :style="{
            'background-image': `url(/img/ogame/lifeforms/${image}.png)`,
            'font-size': size,
        }"
        v-on="legacyListeners"
        v-bind="$props"
    />
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue';
    import type { PropType } from 'vue';
    import { useLegacyComponentListeners } from './useLegacyComponentListeners';
    import { LifeformType, LifeformTypes } from '@/shared/models/ogame/lifeforms/LifeformType';

    const imageMap: Record<LifeformType, string> = {
        [LifeformType.humans]: 'humans',
        [LifeformType.rocktal]: 'rocktal',
        [LifeformType.mechas]: 'mechas',
        [LifeformType.kaelesh]: 'kaelesh',
        [LifeformType.none]: 'none',
    };

    export default defineComponent({
        props: {
            lifeform: {
                required: true,
                type: String as PropType<LifeformType>,
                validator: (value: string) => (LifeformTypes as string[]).includes(value)
            },
            size: { required: false, type: String, default: '32px' },
            disabled: { required: false, type: Boolean },
            fade: { required: false, type: Boolean },
        },
        setup(props) {
            const legacyListeners = useLegacyComponentListeners();
            const image = computed(() => imageMap[props.lifeform]);
            return { legacyListeners, image };
        },
    });
</script>
<style lang="scss" scoped>
    .o-lifeform {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;
        border: 1px solid;

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
        &--fade {
            opacity: 0.3;
        }

        &--humans {
            border-color: #7ec000;
        }
        &--rocktal {
            border-color: #df6642;
        }
        &--mechas {
            border-color: #4b91e7;
        }
        &--kaelesh {
            border-color: #9863e9;
        }
    }
</style>