<template>
    <div class="danger-zone-content">
        <div class="delete-messages">
            <button class="delete-button" @click="clearExpeditions()">
                <span class="ogti ogti-expedition" />
                <span
                    v-text="
                        translations().extension.settings.dangerZone.deleteExpeditions.button(
                            accountAndServer
                        )
                    "
                />
            </button>

            <button class="delete-button" @click="clearCombats()">
                <span class="ogti ogti-attack" />
                <span
                    v-text="
                        translations().extension.settings.dangerZone.deleteCombats.button(
                            accountAndServer
                        )
                    "
                />
            </button>

            <button class="delete-button" @click="clearDebrisFieldReports()">
                <span class="ogti ogti-debris-field" />
                <span
                    v-text="
                        translations().extension.settings.dangerZone.deleteDebrisFieldReports.button(
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
                    translations().extension.settings.dangerZone.deleteAccount.button(
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
                    translations().extension.settings.dangerZone.deleteUniverseHistory.button(
                        server
                    )
                "
            />
        </button>
        <hr />

        <button class="delete-button" @click="deleteEverything()">
            <span class="mdi mdi-delete" />
            <span
                v-text="translations().extension.settings.dangerZone.deleteEverything.button"
            />
        </button>

        <div class="danger-zone-overlay" v-if="isDeleting">
            <loading-spinner />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { translations, formatNumber } from '@stats/i18n';
import { useCombatReportStore } from '../../data/CombatReportDataModule';
import { useDebrisFieldReportStore } from '../../data/DebrisFieldReportDataModule';
import { useExpeditionStore } from '../../data/ExpeditionDataModule';
import { useUniverseHistoryStore } from '../../data/UniverseHistoryDataModule';
import { useUniversesAndAccountsStore } from '../../data/UniversesAndAccountsDataModule';

const expeditionStore = useExpeditionStore();

const combatReportStore = useCombatReportStore();

const debrisFieldReportStore = useDebrisFieldReportStore();

const universesAndAccountsStore = useUniversesAndAccountsStore();

const universeHistoryStore = useUniverseHistoryStore();

const isDeleting = ref(false);

const server = computed(() => {
    const localServer = universesAndAccountsStore.currentServer;
    return `${localServer.language.toUpperCase()} ${localServer.name}`;
});

const accountAndServer = computed(() => {
    const account = universesAndAccountsStore.currentAccount;
    return `${account.name} - ${server.value}`;
});

async function clearExpeditions() {
    const confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteExpeditions.confirmationText(accountAndServer.value, formatNumber(expeditionStore.count))
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );

    if (confirmed) {
        isDeleting.value = true;
        await expeditionStore.clear();

        window.location.hash = '';
        window.location.reload();
    }
}

async function clearCombats() {
    const confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteCombats.confirmationText(accountAndServer.value, formatNumber(combatReportStore.count))
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );

    if (confirmed) {
        isDeleting.value = true;
        await combatReportStore.clear();

        window.location.hash = '';
        window.location.reload();
    }
}

async function clearDebrisFieldReports() {
    const confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteDebrisFieldReports.confirmationText(accountAndServer.value, formatNumber(debrisFieldReportStore.count))
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );

    if (confirmed) {
        isDeleting.value = true;
        await debrisFieldReportStore.clear();

        window.location.hash = '';
        window.location.reload();
    }
}

async function deleteAccount() {
    const confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteAccount.confirmationText(accountAndServer.value)
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );

    if (confirmed) {
        isDeleting.value = true;
        await universesAndAccountsStore.deleteCurrentAccount();

        window.close();
    }
}

async function deleteUniverseHistory() {
    const confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteUniverseHistory.confirmationText(accountAndServer.value)
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );

    if (confirmed) {
        isDeleting.value = true;
        await universeHistoryStore.deleteCurrentServer();

        window.location.hash = '';
        window.location.reload();
    }
}

async function deleteEverything() {
    let confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteEverything.confirmationText1
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );
    if (!confirmed) {
        return;
    }

    confirmed = window.confirm(
        translations().extension.settings.dangerZone.deleteEverything.confirmationText2
        + '\n\n'
        + translations().extension.settings.dangerZone.doYouWantToContinue
    );

    if (confirmed) {
        isDeleting.value = true;
        await universesAndAccountsStore.deleteEverything();

        window.close();
    }
}

onMounted(async () => {
    await expeditionStore.ready;
    await combatReportStore.ready;
    await debrisFieldReportStore.ready;

    await universesAndAccountsStore.ready;
});
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
