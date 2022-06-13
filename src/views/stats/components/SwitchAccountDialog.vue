<template>
    <custom-dialog
        show-close
        @close="$emit('close')"
        :style="`--color: ${getColorVariable(color)};`"
    >
        <span v-if="!knownAccountsLoaded" v-text="'LOCA: loading...'" />
        <div v-else>
            <div v-text="'LOCA: Look at data of account'" />
            <select @change="gotoAccount()" v-model="selectedAccountIndex">
                <option
                    v-for="(account, i) in knownAccounts"
                    :key="account.key"
                    :value="i"
                >
                    {{ account.name || account.id }} ({{
                        account.universeName || account.universeId
                    }}
                    {{ account.universeLanguage.toUpperCase() }})
                </option>
            </select>
        </div>
    </custom-dialog>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { UniversesAndAccountsDataModule } from '../data/UniversesAndAccountsDataModule';
    import { getRGBString } from '../utils/getRGBString';

    interface KnownAccount {
        key: string;

        id: number;
        universeId: number;
        universeLanguage: string;

        name: string;
        universeName: string;
    }

    @Component({})
    export default class SwitchAccountDialog extends Vue {

        @Prop({ required: true, type: String })
        private color!: string;

        private knownAccounts: KnownAccount[] = [];
        private knownAccountsLoaded = false;
        private selectedAccountIndex = -1;


        private getColorVariable(hexColor: string | null): string | null {
            return getRGBString(hexColor);
        }

        private async mounted() {
            await this.loadKnownAccounts();
            this.knownAccountsLoaded = true;
        }

        private async loadKnownAccounts(): Promise<void> {
            this.knownAccounts = UniversesAndAccountsDataModule.accounts
                .map<KnownAccount>(acc => ({
                    key: `${acc.serverLanguage}-${acc.serverId}-${acc.id}`,
                    id: acc.id,
                    universeId: acc.serverId,
                    universeLanguage: acc.serverLanguage,
                    name: acc.name,
                    universeName: UniversesAndAccountsDataModule.servers.find(s => s.id == acc.serverId && s.language == acc.serverLanguage)?.name ?? `${acc.serverLanguage.toUpperCase()} ${acc.serverId}`,
                })
                ).sort((a, b) => {
                    const lang = a.universeLanguage.localeCompare(b.universeLanguage);
                    if (lang != 0) {
                        return lang;
                    }

                    if (a.universeName != null && b.universeName == null) {
                        return -1;
                    }
                    if (a.universeName == null && b.universeName != null) {
                        return 1;
                    }

                    const uniId = a.universeId - b.universeId;
                    if (uniId != 0) {
                        return uniId;
                    }

                    if (a.name != null && b.name == null) {
                        return -1;
                    }
                    if (a.name == null && b.name != null) {
                        return 1;
                    }

                    return a.id - b.id;
                });
        }

        private async gotoAccount() {
            const account = this.knownAccounts[this.selectedAccountIndex];
            const url = `/views/stats.html?player=${account.id}&language=${account.universeLanguage}&server=${account.universeId}`;
            window.open(url, '_blank', 'noopener,noreferrer');

            this.$emit('close');

            await this.$nextTick();
            this.selectedAccountIndex = -1;
        }
    }
</script>