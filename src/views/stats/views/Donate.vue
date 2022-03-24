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

        <div class="fake-table kofi-table">
            <div class="fake-table-header">
                <span v-text="'LOCA: Donate using PayPal or debit/credit card'" />
            </div>
            <div class="fake-table-body">
                <a
                    href="https://ko-fi.com/ogametracker"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="donate-button"
                >
                    <img src="/img/extern/kofi-logo.svg" />
                    LOCA: Donate on Ko-Fi
                </a>
                <small
                    v-text="
                        'LOCA: You don\'t need an account on Ko-Fi to support the development of this extension.'
                    "
                />
            </div>
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
        width: 450px;
        border: 1px solid rgba(var(--color), 0.5);
        border-radius: 4px;
        display: grid;
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

    .kofi-table {
        .fake-table-body {
            display: grid;
        }
        .donate-button {
            display: inline-flex;
            column-gap: 8px;
            padding: 8px 16px;
            background: linear-gradient(176deg, #409eff, #0e45e1 150%);
            width: fit-content;
            border-radius: 16px;
            box-shadow: 0 0 4px 0 rgba(black, 0.2);
            margin-bottom: 8px;
            text-decoration: none;

            img {
                width: 32px;
            }

            &:hover {
                background: #409eff;
                box-shadow: 0 0 4px 0 rgba(black, 0.3), 0 0 8px 0 rgba(black, 0.2);
            }
        }
    }
</style>