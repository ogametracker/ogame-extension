<template>
    <div class="nav-list">
        <router-link
            v-for="(item, i) in items"
            :key="i"
            class="nav-list-item"
            :to="item.to"
            v-text="item.label"
            active-class="nav-list-item-active"
        />
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { RawLocation } from 'vue-router';

    export interface ListNavItem {
        label: string;
        to: RawLocation;
    }

    @Component({})
    export default class ListNav extends Vue {
        @Prop({ required: true, type: Array as PropType<ListNavItem[]> })
        private items!: ListNavItem[];
    }
</script>
<style lang="scss" scoped>
    .nav-list {
        display: flex;
        flex-direction: column;
    }

    .nav-list-item {
        padding: 12px;
        border-radius: 4px;
        text-decoration: none;
        
        background: linear-gradient(
            to right,
            rgba(var(--color), 0.1) 30%,
            rgba(var(--color), 0.05)
        );

        &:hover {
            background: linear-gradient(
                to right,
                rgba(var(--color), 0.3) 30%,
                rgba(var(--color), 0.15)
            );
        }

        + .nav-list-item {
            margin-top: 2px;
        }
    }

    .nav-list-item-active,
    .nav-list-item-active:hover {
        background: linear-gradient(
            to right,
            rgba(var(--color), 0.7) 30%,
            rgba(var(--color), 0.4)
        );
    }
</style>