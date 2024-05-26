<template>
    <div>
        <h2>{{ $i18n.$t.extension.donate.subHeader }}</h2>

        <div class="fake-table kofi-table">
            <div class="fake-table-header">
                <span v-text="$i18n.$t.extension.donate.kofi.header" />
            </div>
            <div class="fake-table-body" style="justify-items: center">
                 <a
                    :href="kofiLink"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="donate-button"
                >
                    <img src="/img/extern/kofi-logo.svg" />
                    {{ $i18n.$t.extension.donate.kofi.buttonText }} 
                </a>
                <small v-text="$i18n.$t.extension.donate.kofi.message" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { _constants } from '../_constants';

    @Component({})
    export default class Donate extends Vue {
        private readonly kofiLink = _constants.kofiLink;
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
        margin-top: 16px;

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