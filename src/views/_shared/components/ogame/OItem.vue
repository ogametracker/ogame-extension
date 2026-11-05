<template>
    <div
        class="o-item"
        :class="{
            [`o-item--grade-${fullItem.grade}`]: !hideItemGrade,
            'o-item--disabled': disabled,
            'o-item--fade': fade,
            'o-item--hide-grade': hideItemGrade,
        }"
        :style="{
            'background-image': `url(${imageUrl})`,
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
    import { ItemHash, ItemHashes } from '@/shared/models/ogame/items/ItemHash';
    import { Items } from '@/shared/models/ogame/items/Items';
    import type { Item } from '@/shared/models/ogame/items/Item';
    import { getItemImageUrl, type ItemImageServer } from '@/shared/models/ogame/items/getItemImageUrl';
    import { parseIntSafe } from '@/shared/utils/parseNumbers';

    // the extension pages showing items are opened for one account and carry its server in the url
    function getServerFromLocation(): ItemImageServer | undefined {
        const params = new URLSearchParams(location.search);
        const serverId = params.get('server');
        const language = params.get('language');
        if (serverId == null || language == null) {
            return undefined;
        }

        return { serverId: parseIntSafe(serverId, 10), language };
    }
    const server = getServerFromLocation();

    export default defineComponent({
        props: {
            item: {
                required: true,
                type: String as PropType<ItemHash>,
                validator: (value: string) => (ItemHashes as string[]).includes(value)
            },
            hideItemGrade: { required: false, type: Boolean, default: false },
            size: { required: false, type: String, default: '32px' },
            disabled: { required: false, type: Boolean, default: false },
            fade: { required: false, type: Boolean, default: false },
            showTooltip: { required: false, type: Boolean, default: false },
        },
        setup(props) {
            const legacyListeners = useLegacyComponentListeners();
            const fullItem = computed<Item>(() => Items[props.item]);
            const imageUrl = computed(() => getItemImageUrl(fullItem.value, server));
            return { legacyListeners, fullItem, imageUrl };
        },
    });
</script>
<style lang="scss" scoped>
    $ogame-item-grades: (
        none: #2374ba,
        bronze: #834b2d,
        silver: #8d939c,
        gold: #ffb84a,
        platinum: #7e3d8e,
    );

    .o-item {
        width: 1em;
        height: 1em;
        display: inline-block;
        background-size: cover;
        background-position: center;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: -moz-crisp-edges;
        border-radius: 4px;

        border: 2px solid transparent;

        &--hide-grade {
            border: none;
        }

        &--disabled {
            filter: grayscale(1) brightness(0.7) contrast(1.2);
        }
        &--fade {
            opacity: 0.3;
        }
    }

    @each $grade, $color in $ogame-item-grades {
        .o-item--grade-#{$grade} {
            border-color: $color;
        }
    }
</style>