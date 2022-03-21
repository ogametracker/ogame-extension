<template>
    <div>TODO: Alliance histories here: {{ allyIds }}</div>
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
            if (this.allyIds.length == 0) {
                this.$router.replace({
                    name: 'universe-history/alliances',
                    query: {
                        alliances: '0', //TODO: current alliance of current player
                    },
                });
                return;
            }


        }
    }
</script>