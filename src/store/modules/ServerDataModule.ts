import OgameMetaData from "@/models/ogame/OgameMetaData";
import { ServerData } from "@/models/ogame/ServerData";
import asyncChromeStorage from "@/utils/asyncChromeStorage";
import _throw from "@/utils/throw";
import waitForDocumentLoad from "@/utils/waitForDocumentLoad";
import Vue from "vue";
import Component from "vue-class-component";

interface ServerDataStorage {
    lastUpdate: number;
    serverData: ServerData;
}

@Component({})
class ServerDataModule extends Vue {

    private data: ServerDataStorage = null!;
    public get serverData(): ServerData {
        return this.data.serverData;
    }

    private async created() {
        await waitForDocumentLoad;

        const oneDay = 24 * 60 * 60 * 1000;
        const data = await asyncChromeStorage.get<ServerDataStorage>(this.storageKey);
        if (data == null || (Date.now() - data.lastUpdate) > oneDay) {
            this.data = await this.loadServerData();
        } else {
            this.data = data ?? await this.loadServerData();
        }
    }

    private async loadServerData(): Promise<ServerDataStorage> {
        const response = await fetch(location.origin + '/api/serverData.xml');
        const xml = await response.text();
        const doc = document.createElement('div');
        doc.innerHTML = xml;

        const data: ServerDataStorage = {
            lastUpdate: Date.now(),
            serverData: this.parseServerData(doc),
        };
        await asyncChromeStorage.set(this.storageKey, data);

        return data;
    }

    parseServerData(doc: HTMLElement): ServerData {
        const getNumber = (selector: string) => {
            const text = doc.querySelector(selector)?.textContent;
            if (text == null) {
                throw new Error(`did not find element '${selector}'`);
            }

            return parseFloat(text);
        };
        const getBool = (selector: string) => {
            const text = doc.querySelector(selector)?.textContent;
            if (text == null) {
                throw new Error(`did not find element '${selector}'`);
            }

            return text == '1';
        };

        return {
            economySpeed: getNumber('speed'),
            fleetSpeed: {
                peaceful: getNumber('speedFleetPeaceful'),
                war: getNumber('speedFleetWar'),
                holding: getNumber('speedFleetHolding'),
            },
            galaxies: getNumber('galaxies'),
            systems: getNumber('systems'),
            isDonutGalaxy: getBool('donutGalaxy'),
            isDonutSystem: getBool('donutSystem'),
            bonusFields: getNumber('bonusFields'),
            isAllianceCombatSystemEnabled: getBool('acs'),
            isRapidfireEnabled: getBool('rapidFire'),

            debrisFieldsFactor: {
                defense: getNumber('debrisFactorDef'),
                fleet: getNumber('debrisFactor'),
            },
            defenseRepairFactor: getNumber('repairFactor'),
            darkMatterBonus: getNumber('darkMatterNewAcount'),
            cargoHyperspaceFactor: getNumber('cargoHyperspaceTechMultiplier') / 100,
            deuteriumConsumptionFactor: getNumber('globalDeuteriumSaveFactor'),
            researchSpeed: getNumber('researchDurationDivisor'),
            isProbeCargoEnabled: getBool('probeCargo'),
            wreckfield: {
                isEnabled: getBool('wfEnabled'),
                minimumLoss: getNumber('wfMinimumLossPercentage') / 100,
                minimumRessLost: getNumber('wfMinimumRessLost'),
                repairableBase: getNumber('wfBasicPercentageRepairable') / 100,
            }
        };
    }


    private get storageKey(): string {
        return `${OgameMetaData.storageKeyPrefix}-serverSettings`;
    }
}

export default new ServerDataModule();