<template>
    <div
        id="app"
        :style="{
            '--color': '255, 0, 0',
        }"
    >
        <nav>
            <div
                v-for="tab in tabs"
                :key="tab.key"
                :style="[
                    {
                        '--color': getColorVariable(tab.color),
                    },
                    tab.style,
                ]"
            >
                <span v-if="tab.icon != null" v-text="tab.icon" />

                <router-link v-if="tab.to != null" :to="tab.to">
                    <span v-if="tab.label != null" v-text="tab.label" />
                </router-link>
                <span v-else-if="tab.label != null" v-text="tab.label" />
            </div>
        </nav>
        <main>
            Content (Router-View)
            <router-view />
        </main>
    </div>
</template>

<script lang="ts">
    // import { Message } from "@/shared/messages/Message";
    // import { AllExpeditionsMessage } from "@/shared/messages/tracking/expeditions";
    import { Component, Prop, Vue } from "vue-property-decorator";
    // import { MessageType } from '@/shared/messages/MessageType'
    // import { ExpeditionEvent } from "@/shared/models/v1/expeditions/ExpeditionEvents";
    import { RawLocation } from "vue-router";

    type Tab = {
        key: string;
    } & ({
        to?: RawLocation;
        icon?: string;
        label?: string;
        style?: string | Record<string, string>;
        color?: string;
    });

    @Component
    export default class App extends Vue {
        // private expoEvents: ExpeditionEvent[] = [];
        private readonly port = chrome.runtime.connect();

        private get tabs(): Tab[] {
            return [
                {
                    key: 'expeditions',
                    to: { name: 'expeditions' },
                    icon: 'ogti-expedition',
                    label: 'LOCA: Expeditionen',
                    color: '#0066ff',
                },
                {
                    key: 'combats',
                    to: { name: 'combat' },
                    icon: 'ogti-attack',
                    label: 'LOCA: Kämpfe',
                    color: '#c51b00',
                },
                {
                    key: 'debris-fields',
                    to: { name: 'debris-fields' },
                    icon: 'ogti-debris-field',
                    label: 'LOCA: Trümmerfelder',
                    color: '#00a031',
                },
                {
                    key: 'resource-balance',
                    to: { name: 'resource-balance' },
                    icon: 'ogti-economy',
                    label: 'LOCA: Rohstoffbilanz',
                    color: '#a9460c',
                },
                {
                    key: 'empire',
                    to: { name: 'empire' },
                    icon: 'ogti-planet-moon',
                    label: 'LOCA: Imperium',
                    color: '#5000d0',
                },
                {
                    key: 'tools',
                    to: { name: 'tools' },
                    icon: 'mdi-tools', //TODO: fix
                    label: 'LOCA: Tools',
                    color: '#008c85',
                },
                {
                    key: 'space',
                },
                //TODO: remove, move settings to be inline with the usage(s)
                {
                    key: 'settings',
                    to: { name: 'settings' },
                    icon: 'mdi-cog',
                    label: 'LOCA: Einstellungen',
                    color: '#888888',
                },
                {
                    key: 'excel-export',
                    to: { name: 'excel-export' },
                    icon: 'mdi-microsoft-excel',
                    color: '#21a366',
                },
                {
                    key: 'info',
                    to: { name: 'info' },
                    icon: 'mdi-info',
                    color: '#8c8ce0',
                },
                {
                    key: 'discord',
                    to: 'https://example.com',
                    icon: 'ogti-discord',
                    color: '#5865f2',
                },
            ];
        }

        private getColorVariable(hexColor?: string): string | null {
            if (hexColor == null) {
                return null;
            }

            hexColor = hexColor.substring(1); // remove # at start
            const r = parseInt(hexColor.substring(0, 2), 16);
            const g = parseInt(hexColor.substring(2, 4), 16);
            const b = parseInt(hexColor.substring(4, 6), 16);

            return `${r}, ${g}, ${b}`;
        }


        // mounted() {
        //     this.port.onMessage.addListener(message => this.onMessage(message));

        //     const subscribeMessage = {
        //         type: MessageType.Subscribe,
        //         ogameMeta: {
        //             serverId: 146,
        //             language: 'de',
        //             playerId: 117848,
        //         },
        //         data: MessageType.AllExpeditions,
        //     };
        //     this.port.postMessage(subscribeMessage);

        //     this.requestData();
        // }

        // requestData() {
        //     const message = {
        //         type: MessageType.RequestExpeditionEvents,
        //         ogameMeta: {
        //             serverId: 146,
        //             language: 'de',
        //             playerId: 117838,
        //         },
        //         data: undefined,
        //     };
        //     this.port.postMessage(message);
        // }

        // onMessage(msg: Message) {
        //     const { type } = msg;

        //     switch (type) {
        //         case MessageType.AllExpeditions: {
        //             const { data } = msg as AllExpeditionsMessage;
        //             this.expoEvents = data;
        //             break;
        //         }
        //     }
        // }
    }
</script>

<style lang="scss">
    nav {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        border-bottom: 2px solid rgb(var(--color));
    }
</style>
