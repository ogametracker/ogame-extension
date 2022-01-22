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
        <div class="grid-table-foot"></div>
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


        private get gridColumns(): string {
            return this.columns
                .map(col => col.size ?? 'auto')
                .join(' ');
        }
    }
</script>
<style lang="scss" scoped>
    $border-radius: 4px;

    .grid-table {
        display: grid;
        border: 1px solid rgba(var(--color), 0.5);

        border-radius: $border-radius;
        &-head {
            > &-cell.first {
                border-top-left-radius: $border-radius;
            }
            > &-cell.last {
                border-top-right-radius: $border-radius;
            }
        }

        &-head,
        &-body,
        &-foot,
        &-row {
            display: contents;
        }

        &-head &-cell {
            background-color: black;
            background-image: linear-gradient(
                0deg,
                rgba(var(--color), 0.5),
                rgba(var(--color), 0.5)
            );
        }

        &-body {
            &-row:nth-of-type(odd) &-cell {
                background: rgba(var(--color), 0.05);
            }

            &-row:hover &-cell {
                background: rgba(var(--color), 0.15);
            }
        }

        &-foot &-cell {
            border-top: 3px double rgba(var(--color), 0.5);
            background: rgba(var(--color), 0.2) !important;
        }

        &-cell {
            padding: 8px;
        }
    }
</style>