<template>
    <div
        class="grid-table"
        :style="{
            'grid-template-columns': gridColumns,
        }"
    >
        <div class="grid-table-head">
            <div
                v-for="(column, i) in columns"
                :key="column.key"
                class="grid-table-cell"
                :class="{
                    first: i == 0,
                    last: i == columns.length - 1,
                }"
            >
                <slot
                    v-if="$scopedSlots[`header-${column.key}`] != null"
                    :name="`header-${column.key}`"
                />
                <span v-else v-text="column.label" />
            </div>
        </div>
        <div class="grid-table-body">
            <div class="grid-table-row" v-for="(item, i) in items" :key="i">
                <div
                    v-for="column in columns"
                    :key="column.key"
                    class="grid-table-cell"
                    :class="[
                        cellClassProvider(item[column.key]),
                        {
                            first: footerItems.length == 0 && i == 0,
                            last:
                                footerItems.length == 0 &&
                                i == columns.length - 1,
                        },
                    ]"
                >
                    <slot
                        v-if="$scopedSlots[`cell-${column.key}`] != null"
                        :name="`cell-${column.key}`"
                        :value="item"
                    />
                    <span
                        v-else-if="column.formatter != null"
                        v-text="column.formatter(item[column.key])"
                    />
                    <span v-else v-text="item[column.key]" />
                </div>
            </div>
        </div>
        <div class="grid-table-foot">
            <div
                class="grid-table-row"
                v-for="(item, i) in footerItems"
                :key="i"
            >
                <div
                    v-for="(column, c) in columns"
                    :key="column.key"
                    class="grid-table-cell"
                    :class="{
                        first: c == 0,
                        last: c == columns.length - 1,
                    }"
                >
                    <slot
                        v-if="$scopedSlots[`footer-${column.key}`] != null"
                        :name="`footer-${column.key}`"
                        :value="item"
                    />
                    <span
                        v-else-if="column.formatter != null"
                        v-text="column.formatter(item[column.key])"
                    />
                    <span v-else v-text="item[column.key]" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    export interface GridTableColumn {
        key: string;
        label: string;
        size?: string;
        class?: string;
        style?: string | Record<string, any>;
        formatter?: (value: any) => string;
    }

    @Component({})
    export default class GridTable extends Vue {
        @Prop({ required: true, type: Array as PropType<GridTableColumn[]> })
        private columns!: GridTableColumn[];

        @Prop({ required: true, type: Array as PropType<Record<string, any>[]> })
        private items!: Record<string, any>[];

        @Prop({ required: false, type: Array as PropType<Record<string, any>[]>, default: () => [] })
        private footerItems!: Record<string, any>[];

        @Prop({ required: false, type: Function as PropType<(value: any) => string>, default: (value: any) => '' })
        private cellClassProvider!: (value: any) => string;


        private get gridColumns(): string {
            return this.columns
                .map(col => col.size ?? 'auto')
                .join(' ');
        }
    }
</script>
<style lang="scss" scoped>
    .grid-table {
        --border-radius: 4px;
        display: grid;
        border: 1px solid rgba(var(--color), 0.5);

        border-radius: var(--border-radius);

        &-head,
        &-body,
        &-foot,
        &-row {
            display: contents;
        }

        &-head .grid-table-cell {
            background-color: black;
            background-image: linear-gradient(
                0deg,
                rgba(var(--color), 0.5),
                rgba(var(--color), 0.5)
            );
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
                background: rgba(var(--color), 0.2) !important;
            }
        }

        &-cell {
            padding: 8px;
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