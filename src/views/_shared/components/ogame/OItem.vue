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
    />
</template>

<script lang="ts">
import type { ItemImageServer } from '@ogame-tracker/shared/models/ogame/items/getItemImageUrl';
import { parseIntSafe } from '@ogame-tracker/shared/utils/parseNumbers';

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
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { getItem } from '@ogame-tracker/shared/models/ogame/items/ItemLookup';
import { ItemGrade } from '@ogame-tracker/shared/models/ogame/items/ItemGrade';
import { Items } from '@ogame-tracker/shared/models/ogame/items/Items.generated';
import { getItemImageUrl } from '@ogame-tracker/shared/models/ogame/items/getItemImageUrl';

const props = defineProps({
    item: {
        required: true,
        type: String,
    },
    hideItemGrade: { required: false, type: Boolean, default: false },
    size: { required: false, type: String, default: '32px' },
    disabled: { required: false, type: Boolean, default: false },
    fade: { required: false, type: Boolean, default: false },
    showTooltip: { required: false, type: Boolean, default: false },
});

const fullItem = computed(() => getItem(props.item) ?? { ...Items.detroid_30minutes, grade: ItemGrade.none });
const imageUrl = computed(() => getItemImageUrl(fullItem.value, server));
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
