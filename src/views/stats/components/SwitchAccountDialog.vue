<template>
    <custom-dialog show-close @close="$emit('close')" :style="`--color: ${getColorVariable(color)};`">
        <loading-spinner v-if="!knownAccountsLoaded" />
        <div v-else>
            <div v-text="$i18n.$t.extension.switchAccounts.title" />
            <select @change="gotoAccount()" v-model="selectedAccountKey">
                <optgroup v-for="accountGroup in knownAccountGroups" :key="accountGroup.serverName" :label="accountGroup.serverName">
                    <option v-for="account in accountGroup.accounts" :key="account.key" :value="account.key" v-text="account.name" />
                </optgroup>
            </select>
        </div>
    </custom-dialog>
</template>

<script lang="ts">
    import { DbAccount } from '@/shared/db/schema/global';
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

        private knownAccountGroups: { serverName: string; accounts: KnownAccount[] }[] = [];
        private knownAccountsLoaded = false;
        private selectedAccountKey: string | null = null;


        private getColorVariable(hexColor: string | null): string | null {
            return getRGBString(hexColor);
        }

        private async mounted() {
            await this.loadKnownAccounts();
            this.knownAccountsLoaded = true;
        }

        private mapAccount(acc: DbAccount): KnownAccount {
            const server = UniversesAndAccountsDataModule.servers.find(s => s.id == acc.serverId && s.language == acc.serverLanguage);
            let serverName = `${acc.serverLanguage.toUpperCase()} ${acc.serverId}`;
            if (server != null) {
                let name = server.name;
                let prefix = `${server.language.toUpperCase()} `;
                if (name.startsWith(prefix)) {
                    serverName = name;
                }
                else {
                    serverName = prefix + name;
                }
            }

            return {
                key: `${acc.serverLanguage}-${acc.serverId}-${acc.id}`,
                id: acc.id,
                universeId: acc.serverId,
                universeLanguage: acc.serverLanguage,
                name: acc.name,
                universeName: serverName,
            };
        }

        private async loadKnownAccounts(): Promise<void> {
            const accounts = UniversesAndAccountsDataModule.accounts
                .map<KnownAccount>(acc => this.mapAccount(acc))
                .sort((a, b) => {
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

            const groups: Record<string, KnownAccount[]> = {};
            accounts.forEach(acc => {
                const serverKey = `${acc.universeLanguage}-${acc.universeId}`;
                (groups[serverKey] ??= []).push(acc);
            });

            const result = Object.keys(groups).sort().map(key => ({
                serverName: groups[key][0].universeName,
                accounts: groups[key],
            }));
            this.knownAccountGroups = result;
        }

        private async gotoAccount() {
            const accs = this.knownAccountGroups.flatMap(gr => gr.accounts);
            const account = accs.find(acc => acc.key == this.selectedAccountKey);
            if (account == null) {
                return;
            }

            const url = `/views/stats.html?player=${account.id}&language=${account.universeLanguage}&server=${account.universeId}`;
            window.open(url, '_blank', 'noopener,noreferrer');

            this.$emit('close');

            await this.$nextTick();
            this.selectedAccountKey = null;
        }
    }
</script>
<style lang="scss" scoped>
    select {
        width: 100%;
    }
</style>