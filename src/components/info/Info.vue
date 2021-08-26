<template>
    <table style="width: max-content;">
        <tbody>
            <tr v-for="(row, i) in rows" :key="i" :class="row.class">
                <td style="width: 300px;">{{ row.title }}</td>
                <td>{{ row.text }}</td>
            </tr>
        </tbody>
    </table>
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