<template>
    <div
        role="grid"
        class="grid-table"
        :class="{
            'grid-table--sticky-header': sticky != null,
            'grid-table--sticky-footer': stickyFooter,
            'grid-table--inline': inline,
            'grid-table--has-row-borders': rowBorders,
        }"
        :style="{
            'grid-template-columns': gridColumns,
            '--grid-table--sticky-height': sticky ?? undefined,
        }"
        @scroll="onScroll()"
        ref="element"
    >
        <div v-if="!noHeader" role="row" class="grid-table-head">
            <div
                v-for="(column, i) in columns"
                :key="column.key"
                role="columnheader"
                class="grid-table-cell"
                :class="[
                    column.headerClass,
                    {
                        first: i == 0,
                        last: i == columns.length - 1,
                    },
                ]"
                :style="column.style"
            >
                <template v-if="getMatchingSlotNames(`header-${column.key}`).length > 0">
                    <slot
                        v-for="result in getMatchingSlotNames(`header-${column.key}`)"
                        :name="result.name"
                        :match="result.match"
                        :label="column.label"
                    />
                </template>
                <span v-else v-text="column.label" />
            </div>
        </div>
        <div role="rowgroup" class="grid-table-body">
            <div role="row" class="grid-table-row" v-for="(item, i) in items" :key="i" v-show="!hideRow(item)">
                <div
                    v-for="column in columns"
                    :key="column.key"
                    role="gridcell"
                    class="grid-table-cell"
                    :class="[
                        cellClassProvider(item[column.key], item),
                        column.class,
                        {
                            first: footerItems.length == 0 && i == 0,
                            last: footerItems.length == 0 && i == columns.length - 1,
                        },
                    ]"
                    :style="column.style"
                >
                    <template v-if="getMatchingSlotNames(`cell-${column.key}`).length > 0">
                        <slot
                            v-for="result in getMatchingSlotNames(`cell-${column.key}`)"
                            :name="result.name"
                            :match="result.match"
                            :value="item[column.key]"
                            :item="item"
                            :index="i"
                        />
                    </template>
                    <span v-else-if="column.formatter != null" v-text="column.formatter(item[column.key])" />
                    <span v-else v-text="item[column.key]" />
                </div>
            </div>
        </div>
        <div role="rowgroup" class="grid-table-foot">
            <div role="row" class="grid-table-row" v-for="(item, i) in footerItems" :key="i">
                <div
                    v-for="(column, c) in columns"
                    :key="column.key"
                    role="gridcell"
                    class="grid-table-cell"
                    :class="[
                        column.footerClass,
                        {
                            first: c == 0,
                            last: c == columns.length - 1,
                        },
                    ]"
                    :style="column.style"
                >
                    <template v-if="getMatchingSlotNames(`footer-${column.key}`).length > 0">
                        <slot
                            v-for="result in getMatchingSlotNames(`footer-${column.key}`)"
                            :name="result.name"
                            :match="result.match"
                            :value="item[column.key]"
                            :item="item"
                            :index="i"
                        />
                    </template>
                    <span v-else-if="column.formatter != null" v-text="column.formatter(item[column.key])" />
                    <span v-else v-text="item[column.key]" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export interface GridTableColumn<TKey = string> {
    key: TKey;
    label?: string;
    size?: string;
    class?: string;
    footerClass?: string;
    headerClass?: string;
    style?: string | Record<string, any>;
    formatter?: (value: any) => string;
}

export interface GridTableScrollEvent {
    x: {
        current: number;
        max: number;
    };
    y: {
        current: number;
        max: number;
    };
}
</script>

<script setup lang="ts" generic="TKey extends string | number = string">
import { computed, useSlots, useTemplateRef } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
    columns: { required: true, type: Array as PropType<GridTableColumn<TKey>[]> },
    items: { required: true, type: Array as PropType<Record<string | number, any>[]> },
    noHeader: { required: false, type: Boolean },
    inline: { required: false, type: Boolean },
    footerItems: { required: false, type: Array as PropType<Record<string | number, any>[]>, default: () => [] },
    cellClassProvider: { required: false, type: Function as PropType<(value: any, item: any) => string>, default: () => '' },
    sticky: { required: false, type: String as PropType<string | null>, default: null },
    stickyFooter: { required: false, type: Boolean, default: false },
    hideRow: { required: false, type: Function as PropType<(item: any) => boolean>, default: () => false },
    rowBorders: { required: false, type: Boolean },
});

const emit = defineEmits<{ scroll: [event: GridTableScrollEvent] }>();

const slots = useSlots();

const gridColumns = computed<string>(() => {
    return props.columns
        .map(col => col.size ?? 'auto')
        .join(' ');
});

const tableElement = useTemplateRef<Element>('element');

function onScroll() {
    const elem = tableElement.value!;
    const scrollData: GridTableScrollEvent = {
        x: {
            max: elem.scrollWidth - elem.clientWidth,
            current: elem.scrollLeft,
        },
        y: {
            max: elem.scrollHeight - elem.clientHeight,
            current: elem.scrollTop,
        },
    };
    emit('scroll', scrollData);
}

function getMatchingSlotNames(columnKey: string): { name: string, match: RegExpMatchArray }[] {
    return Object.keys(slots).map(name => ({
        name,
        match: columnKey.match(`^${name}$`),
    })).filter(r => r.match != null) as { name: string, match: RegExpMatchArray }[];
}
</script>

<style lang="scss" scoped>
    .grid-table {
        --border-radius: 4px;
        display: grid;
        border: 1px solid rgba(var(--color), 0.5);

        border-radius: var(--border-radius);

        z-index: 0;

        &--inline {
            display: inline-grid;
        }

        &-head,
        &-body,
        &-foot,
        &-row {
            display: contents;
        }

        &-head .grid-table-cell {
            z-index: 1;
            background-color: black;
            background-image: linear-gradient(0deg, rgba(var(--color), 0.5), rgba(var(--color), 0.7));
        }

        &-body {
            .grid-table-row:nth-of-type(odd) .grid-table-cell {
                background: rgba(var(--color), 0.05);
            }

            .grid-table-row:hover .grid-table-cell {
                background: rgba(var(--color), 0.15);
            }
        }

        &-foot .grid-table-row {
            &:first-of-type .grid-table-cell {
                border-top: 3px double rgba(var(--color), 0.5);
            }

            .grid-table-cell {
                background: black linear-gradient(0deg, rgba(var(--color), 0.2), rgba(var(--color), 0.2)) !important;
            }
        }

        &-cell {
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            text-align: right;
        }

        &--sticky-header > &-head > &-cell {
            position: sticky;
            top: 0;
        }
        &--sticky-header {
            max-height: var(--grid-table--sticky-height);
            overflow: auto;
        }

        &--sticky-footer > &-foot &-cell {
            position: sticky;
            bottom: 0;
        }

        &--has-row-borders {
            .grid-table-row + .grid-table-row > .grid-table-cell {
                border-top: 1px solid rgba(var(--color), 0.3333);
            }
        }
    }
    .grid-table-head {
        > .grid-table-cell.first {
            border-top-left-radius: calc(var(--border-radius) - 2px);
        }
        > .grid-table-cell.last {
            border-top-right-radius: calc(var(--border-radius) - 2px);
        }
    }
    .grid-table-foot .grid-table-row:last-of-type {
        > .grid-table-cell.first {
            border-bottom-left-radius: calc(var(--border-radius) - 2px);
        }
        > .grid-table-cell.last {
            border-bottom-right-radius: calc(var(--border-radius) - 2px);
        }
    }
</style>
