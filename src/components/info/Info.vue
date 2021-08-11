<template>
    <grid-table>
        <grid-tr v-for="(row, i) in rows" :key="i" :class="row.class">
            <grid-cell> {{ row.title }} </grid-cell>
            <grid-cell> {{ row.text }} </grid-cell>
        </grid-tr>
    </grid-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface Row {
        title: string;
        text: string;
        class?: string;
    }

    @Component({})
    export default class Info extends Vue {
        private totalSize = 1_234_567_890;

        private readonly rows: Row[] = [
            {
                title: 'LOCA: Größe der gespeicherten Daten',
                text: `${this.totalSize} Bytes`,
                class: '',
            },
            {
                title: 'LOCA: Getrackte Expedition',
                text: '12.345',
            },
            {
                title: 'LOCA: Getrackte Kämpfe',
                text: '9.999'
            },
            {
                title: 'LOCA: Getrackte TF-Abbauten',
                text: '1.234'
            },
        ];
    }
</script>