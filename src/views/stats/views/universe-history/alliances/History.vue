<template>
    <!-- TODO: Alliance history view -->
    <h2>Coming soon&trade;</h2>
</template>

<script lang="ts">
    import { parseIntSafe } from '@/shared/utils/parseNumbers';
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Alliances extends Vue {
        private get allyIds(): number[] {
            return (this.$route.query.alliances as string | null ?? '')
                .split(',')
                .filter(id => id.length > 0)
                .map(aid => parseIntSafe(aid, 10));
        }

        private mounted() {
        }
    }
</script>