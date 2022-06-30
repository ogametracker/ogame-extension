<template>
    <div class="danger-zone-content">
        <div class="delete-messages">
            <button class="delete-button" @click="clearExpeditions()">
                <span class="ogti ogti-expedition" />
                <span
                    v-text="
                        'LOCA: Delete tracked expeditions (current account)'
                    "
                />
            </button>

            <button class="delete-button" @click="clearCombats()">
                <span class="ogti ogti-attack" />
                <span
                    v-text="'LOCA: Delete tracked combats (current account)'"
                />
            </button>

            <button class="delete-button" @click="clearDebrisFieldReports()">
                <span class="ogti ogti-debris-field" />
                <span
                    v-text="
                        'LOCA: Delete tracked debris field harvest reports (current account)'
                    "
                />
            </button>
            TODO: delete tracked combats/expeditions/df reports => confirm
        </div>

        <hr />
        <button class="delete-button" v-text="'LOCA: Delete current account'" />
        TODO: Delete account related data (includes server related data if no
        account for the server would erxist anymore) => confirm
        <hr />
        <button
            class="delete-button"
            v-text="
                'LOCA: Delete all universe history related data for this universe'
            "
        />
        TODO: Delete all universe history related data for this universe =>
        confirm
        <hr />
        <button class="delete-button" v-text="'LOCA: Delete everything'" />
        TODO: delete everything => confirm TWICE
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { UniversesAndAccountsDataModule } from '../../data/UniversesAndAccountsDataModule';

    @Component({})
    export default class DangerZone extends Vue {

        private async mounted() {
            await ExpeditionDataModule.ready;
            await CombatReportDataModule.ready;
            await DebrisFieldReportDataModule.ready;

            await UniversesAndAccountsDataModule.ready;
        }

        private get server() {
            const server = UniversesAndAccountsDataModule.currentServer;
            return `${server.language.toUpperCase()} ${server.name}`;
        }

        private get accountAndServer() {
            const account = UniversesAndAccountsDataModule.currentAccount;
            return `${account.name} - ${this.server}`;
        }

        private clearExpeditions() {
            const confirmed = window.confirm(
                `LOCA: If you confirm, all ${this.$i18n.$n(ExpeditionDataModule.count)} tracked expeditions will be removed for the currently selected account (${this.accountAndServer}).\n`
                + 'ARE YOU SURE YOU WANT TO CONTINUE?');

            if (!confirmed) {
                return;
            }

            //TODO: delete expeditions from account
        }

        private clearCombats() {
            const confirmed = window.confirm(
                `LOCA: If you confirm, all ${this.$i18n.$n(CombatReportDataModule.count)} tracked combats will be removed for the currently selected account (${this.accountAndServer}).\n`
                + 'ARE YOU SURE YOU WANT TO CONTINUE?');

            if (!confirmed) {
                return;
            }

            //TODO: delete combats from account
        }

        private clearDebrisFieldReports() {
            const confirmed = window.confirm(
                `LOCA: If you confirm, all ${this.$i18n.$n(DebrisFieldReportDataModule.count)} tracked debris field reports will be removed for the currently selected account (${this.accountAndServer}).\n`
                + 'ARE YOU SURE YOU WANT TO CONTINUE?');

            if (!confirmed) {
                return;
            }

            //TODO: delete debris field reports from account
        }

    }
</script>

<style lang="scss" scoped>
    .danger-zone-content {
        display: inline-flex;
        flex-direction: column;
    }

    .delete-messages {
        display: inline-flex;
        flex-direction: column;
        row-gap: 8px;
    }

    .delete-button {
        --color: 255, 0, 0;
        padding: 8px;
        display: flex;
        align-items: center;
        max-width: 250px;

        .ogti {
            transform: scale(1.5);
            font-size: 36px;
            margin-right: 0.25em;
        }
    }
</style>