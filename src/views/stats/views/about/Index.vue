<template>
    <page :nav-items="navItems"/>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ListNavItem } from '../../components/common/ListNav.vue';

    @Component({})
    export default class Index extends Vue {
        private get navItems(): ListNavItem[] {
            return [
                {
                    label: this.$i18n.$t.about.faqHelp.header,
                    to: { name: 'about/help' },
                },
                {
                    label: this.$i18n.$t.about.info.header,
                    to: { name: 'about/info' },
                },
            ];
        }
    }
</script>