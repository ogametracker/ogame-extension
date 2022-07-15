<template>
    <div
        class="grid-table"
        :class="{
            'grid-table--sticky-header': sticky != null,
            'grid-table--sticky-footer': stickyFooter,
            'grid-table--inline': inline,
        }"
        :style="{
            'grid-template-columns': gridColumns,
            '--grid-table--sticky-height': sticky,
        }"
        @scroll="onScroll($event)"
        ref="element"
    >
        <div class="grid-table-head" v-if="!noHeader">
            <div
                v-for="(column, i) in columns"
                :key="column.key"
                class="grid-table-cell"
                :class="[
                    column.headerClass,
                    {
                        first: i == 0,
                        last: i == columns.length - 1,
                    },
                ]"
            >
                <slot v-if="$scopedSlots[`header-${column.key}`] != null" :name="`header-${column.key}`" :label="column.label" />
                <span v-else v-text="column.label" />
            </div>
        </div>
        <div class="grid-table-body">
            <div class="grid-table-row" v-for="(item, i) in items" :key="i" v-show="!hideRow(item)">
                <div
                    v-for="column in columns"
                    :key="column.key"
                    class="grid-table-cell"
                    :class="[
                        cellClassProvider(item[column.key], item),
                        column.class,
                        {
                            first: footerItems.length == 0 && i == 0,
                            last: footerItems.length == 0 && i == columns.length - 1,
                        },
                    ]"
                >
                    <slot v-if="$scopedSlots[`cell-${column.key}`] != null" :name="`cell-${column.key}`" :value="item[column.key]" :item="item" :index="i" />
                    <span v-else-if="column.formatter != null" v-text="column.formatter(item[column.key])" />
                    <span v-else v-text="item[column.key]" />
                </div>
            </div>
        </div>
        <div class="grid-table-foot">
            <div class="grid-table-row" v-for="(item, i) in footerItems" :key="i">
                <div
                    v-for="(column, c) in columns"
                    :key="column.key"
                    class="grid-table-cell"
                    :class="[
                        column.footerClass,
                        {
                            first: c == 0,
                            last: c == columns.length - 1,
                        },
                    ]"
                >
                    <slot v-if="$scopedSlots[`footer-${column.key}`] != null" :name="`footer-${column.key}`" :value="item[column.key]" :item="item" />
                    <span v-else-if="column.formatter != null" v-text="column.formatter(item[column.key])" />
                    <span v-else v-text="item[column.key]" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

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

    @Component({})
    export default class GridTable<TKey = string> extends Vue {
        @Prop({ required: true, type: Array as PropType<GridTableColumn<TKey>[]> })
        private columns!: GridTableColumn<TKey>[];

        @Prop({ required: true, type: Array as PropType<Record<string, any>[]> })
        private items!: Record<string, any>[];

        @Prop({ required: false, type: Boolean })
        private noHeader!: boolean;

        @Prop({ required: false, type: Boolean })
        private inline!: boolean;

        @Prop({ required: false, type: Array as PropType<Record<string, any>[]>, default: () => [] })
        private footerItems!: Record<string, any>[];

        @Prop({ required: false, type: Function as PropType<(value: any, item: any) => string>, default: () => '' })
        private cellClassProvider!: (value: any, item: any) => string;

        @Prop({ required: false, type: String, default: null })
        private sticky!: string | null;

        @Prop({ required: false, type: Boolean, default: false })
        private stickyFooter!: boolean;

        @Prop({ required: false, type: Function as PropType<(item: any) => boolean>, default: () => false })
        private hideRow!: (item: any) => boolean;


        private get gridColumns(): string {
            return this.columns
                .map(col => col.size ?? 'auto')
                .join(' ');
        }

        @Ref('element')
        private tableElement!: Element;

        private onScroll(event: Event) {
            const elem = this.tableElement;
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
            this.$emit('scroll', scrollData);
        }
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