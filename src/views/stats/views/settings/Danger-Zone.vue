<template>
    <div class="danger-zone-content">
        <div class="delete-messages">
            <button class="delete-button" @click="clearExpeditions()">
                <span class="ogti ogti-expedition" />
                <span
                    v-text="
                        $i18n.$t.extension.settings.dangerZone.deleteExpeditions.button(
                            accountAndServer
                        )
                    "
                />
            </button>

            <button class="delete-button" @click="clearCombats()">
                <span class="ogti ogti-attack" />
                <span
                    v-text="
                        $i18n.$t.extension.settings.dangerZone.deleteCombats.button(
                            accountAndServer
                        )
                    "
                />
            </button>

            <button class="delete-button" @click="clearDebrisFieldReports()">
                <span class="ogti ogti-debris-field" />
                <span
                    v-text="
                        $i18n.$t.extension.settings.dangerZone.deleteDebrisFieldReports.button(
                            accountAndServer
                        )
                    "
                />
            </button>
        </div>
        <hr />

        <button class="delete-button" @click="deleteAccount()">
            <span class="mdi mdi-account" />
            <span
                v-text="
                    $i18n.$t.extension.settings.dangerZone.deleteAccount.button(
                        accountAndServer
                    )
                "
            />
        </button>
        <hr />

        <button class="delete-button" @click="deleteUniverseHistory()">
            <span class="mdi mdi-update" />
            <span
                v-text="
                    $i18n.$t.extension.settings.dangerZone.deleteUniverseHistory.button(
                        server
                    )
                "
            />
        </button>
        <hr />

        <button class="delete-button" @click="deleteEverything()">
            <span class="mdi mdi-delete" />
            <span
                v-text="$i18n.$t.extension.settings.dangerZone.deleteEverything.button"
            />
        </button>

        <div class="danger-zone-overlay" v-if="isDeleting">
            <loading-spinner />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { CombatReportDataModule } from '../../data/CombatReportDataModule';
    import { DebrisFieldReportDataModule } from '../../data/DebrisFieldReportDataModule';
    import { ExpeditionDataModule } from '../../data/ExpeditionDataModule';
    import { UniverseHistoryDataModule } from '../../data/UniverseHistoryDataModule';
    import { UniversesAndAccountsDataModule } from '../../data/UniversesAndAccountsDataModule';

    @Component({})
    export default class DangerZone extends Vue {

        private isDeleting = false;

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

        private async clearExpeditions() {
            const confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteExpeditions.confirmationText(this.accountAndServer, this.$i18n.$n(ExpeditionDataModule.count))
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );

            if (confirmed) {
                this.isDeleting = true;
                await ExpeditionDataModule.clear();

                window.location.hash = '';
                window.location.reload();
            }
        }

        private async clearCombats() {
            const confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteCombats.confirmationText(this.accountAndServer, this.$i18n.$n(CombatReportDataModule.count))
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );

            if (confirmed) {
                this.isDeleting = true;
                await CombatReportDataModule.clear();

                window.location.hash = '';
                window.location.reload();
            }
        }

        private async clearDebrisFieldReports() {
            const confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteDebrisFieldReports.confirmationText(this.accountAndServer, this.$i18n.$n(DebrisFieldReportDataModule.count))
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );

            if (confirmed) {
                this.isDeleting = true;
                await DebrisFieldReportDataModule.clear();

                window.location.hash = '';
                window.location.reload();
            }
        }

        private async deleteAccount() {
            const confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteAccount.confirmationText(this.accountAndServer)
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );


            if (confirmed) {
                this.isDeleting = true;
                await UniversesAndAccountsDataModule.deleteCurrentAccount();

                window.close();
            }
        }

        private async deleteUniverseHistory() {
            const confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteUniverseHistory.confirmationText(this.accountAndServer)
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );


            if (confirmed) {
                this.isDeleting = true;
                await UniverseHistoryDataModule.deleteCurrentServer();

                window.location.hash = '';
                window.location.reload();
            }
        }

        private async deleteEverything() {
            let confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteEverything.confirmationText1
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );
            if (!confirmed) {
                return;
            }

            confirmed = window.confirm(
                this.$i18n.$t.extension.settings.dangerZone.deleteEverything.confirmationText2
                + '\n\n'
                + this.$i18n.$t.extension.settings.dangerZone.doYouWantToContinue
            );


            if (confirmed) {
                this.isDeleting = true;
                await UniversesAndAccountsDataModule.deleteEverything();

                window.close();
            }
        }
    }
</script>

<style lang="scss" scoped>
    hr {
        width: 100%;
    }

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
        padding: 4px;
        display: grid;
        grid-template-columns: 36px 1fr;
        column-gap: 4px;
        align-items: center;
        max-width: 350px;
        text-align: left;
        line-height: 1.25;

        .ogti {
            font-size: 36px;
        }

        .mdi {
            font-size: 30px;
        }
    }

    .danger-zone-overlay {
        --color: 255, 0, 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgb(black, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    }
</style>