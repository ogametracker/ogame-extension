<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <router-view />

        <div>
            {{ expoEvents.length }}
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { Message } from "../../../shared/messages/Message";
    import { MessageType } from "../../../shared/messages/MessageType";
    import { SubscriptionMessage } from "../../../shared/messages/subscriptions/types";
    import { AllExpeditionEventsMessage, RequestExpeditionEventsMessage } from "../../../shared/messages/tracking/expeditions";
    import { ExpeditionEvent } from "../../../shared/models/v1/expeditions/ExpeditionEvents";

    @Component
    export default class App extends Vue {
        private expoEvents: ExpeditionEvent[] = [];
        private readonly port = chrome.runtime.connect();

        mounted() {
            this.port.onMessage.addListener(message => this.onMessage(message));

            const subscribeMessage: SubscriptionMessage = {
                type: MessageType.Subscribe,
                ogameMeta: {
                    serverId: 146,
                    language: 'de',
                    playerId: 117848,
                },
                data: MessageType.NewExpeditionEvent,
            };
            this.port.postMessage(subscribeMessage);

            this.requestData();
        }

        requestData() {
            const message: RequestExpeditionEventsMessage = {
                type: MessageType.RequestExpeditionEvents,
                ogameMeta: {
                    serverId: 146,
                    language: 'de',
                    playerId: 117838,
                },
                data: undefined,
            };
            this.port.postMessage(message);
        }

        onMessage(msg: Message) {
            console.log('View', 'got message');
            const { type } = msg;

            switch (type) {
                case MessageType.AllExpeditionEvents: {
                    const { data } = msg as AllExpeditionEventsMessage;
                    this.expoEvents = data;
                    break;
                }

                case MessageType.NewExpeditionEvent: {
                    this.requestData();
                    break;
                }
            }
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
