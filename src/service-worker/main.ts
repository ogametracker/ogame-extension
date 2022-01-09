import { PortNames } from "../shared/ports/constants";

type PortCollection = Partial<Record<PortNames, chrome.runtime.Port[] | undefined>>;

const $ports: PortCollection = {};

chrome.runtime.onConnect.addListener(port => {
    const portName = port.name as PortNames;
    const ports = ($ports[portName] ??= []);
    ports.push(port);

    port.onMessage.addListener((message, port) => console.log('message from port', message, port));
});
