<template>
    <div class="page">
        <list-nav
            :items="navItems"
            :root-route-name="rootRouteName"
        />

        <div class="page-content">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
    import { PropType } from 'vue';
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ListNavItem } from './ListNav.vue';

    @Component({})
    export default class Page extends Vue {
        @Prop({ required: true, type: Array as PropType<ListNavItem[]> })
        private navItems!: ListNavItem[];

        @Prop({ required: false, type: String, default: () => null })
        private rootRouteName!: string | null;
    }
</script>
<style lang="scss" scoped>
    .page {
        display: grid;
        grid-template-columns: auto 1fr;
        height: 100%;
        column-gap: 16px;
    }

    .page-content {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>