<template>
    <div>
        <h2 v-text="'LOCA: DONATE'" />

        <div class="fake-table crypto-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: Donate using crypto'" />
            </div>
            <div class="fake-table-body">
                <span class="mdi mdi-bitcoin" />
                <span class="crypto-name" v-text="'Bitcoin'" />
                <span v-text="'3MrZ8FhWE7Ue8nqgkZTGd7fxUzCBNPKVwk'" />

                <span class="mdi mdi-ethereum" />
                <span class="crypto-name" v-text="'Ethereum'" />
                <span v-text="'0x65fd2a29fc6ee5434b2587cf0fb515fa14cb1ff0'" />
            </div>
        </div>

        <div class="fake-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: Donate using PayPal'" />
            </div>
            <div class="fake-table-body">TODO:</div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Donate extends Vue {

    }
</script>
<style lang="scss" scoped>
    .fake-table {
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
        width: fit-content;
        overflow: hidden;
        box-shadow: 0 0 6px 0 rgba(black, 0.333);

        &-header {
            background: rgba(white, 0.4);
            justify-content: center;
            font-weight: bold;
        }

        &-body {
            background: rgba(white, 0.2);
        }

        &-header,
        &-body {
            padding: 8px 16px;
            display: flex;
            align-items: center;
        }
    }

    .crypto-table {
        margin-bottom: 16px;

        .fake-table-body {
            display: grid;
            grid-template-columns: auto auto 1fr;
            gap: 8px;

            .mdi {
                transform: scale(1.5);
            }

            .crypto-name {
                padding-right: 8px;
            }
        }
    }
</style>