import i18n from "@/i18n";
import BattleReport from "@/models/battles/BattleReport";
import BattleResult from "@/models/battles/BattleResult";
import OgameBattleReport from "@/models/battles/OgameBattleReport";
import Fleet from "@/models/Fleet";
import OgameMetaData from "@/models/ogame/OgameMetaData";
import Resource from "@/models/Resource";
import Ship from "@/models/Ship";
import BattleModule from "@/store/modules/BattleModule";
import NotificationModule from "@/store/modules/NotificationModule";
import getNumericEnumValues from "@/utils/getNumericEnumValues";

const tabIdBattleMessages = '21';

const errorBattleReports: number[] = [];
const emptyBattleReports: number[] = [];

export default async function readBattles() {
    //TODO:
    const messagePage = document.querySelector('div[id^="ui-id-"][aria-hidden="false"] > #fleetsgenericpage');
    const parent = messagePage?.parentElement;
    if (messagePage == null || parent == null)
        return;

    const labelId = parent.getAttribute('aria-labelledby');
    if (labelId == null)
        return;

    const tabId = document.getElementById(labelId)?.parentElement?.getAttribute('data-tabid');
    if (tabId != tabIdBattleMessages)
        return;

    const knownBattleReports = BattleModule.reportsById;
    let newMessageCount = 0;
    let newErrorCount = 0;

    const messageContainers = messagePage.querySelectorAll('.msg[data-msg-id]');
    for (const messageContainer of messageContainers) {
        const msgId = parseInt(messageContainer.getAttribute('data-msg-id')!);

        if (knownBattleReports[msgId] != null || errorBattleReports.includes(msgId) || emptyBattleReports.includes(msgId)) {
            continue;
        }

        try {
            const messageUrl = (messageContainer.querySelector('.msg_action_link')! as HTMLAnchorElement)?.href;
            if(messageUrl == null) {
                emptyBattleReports.push(msgId);
                continue;
            }

            const battleReport = await readBattleReport(msgId, messageUrl);
            BattleModule.add(battleReport);

            newMessageCount++;
        } catch (e) {
            console.error(e, msgId);
            newErrorCount++;

            errorBattleReports.push(msgId);
        }
    }

    if (newMessageCount > 0) {
        //TODO: localization
        NotificationModule.addNotification({
            type: 'info',
            title: 'Neue Kampfberichte',
            text: `Es wurden ${newMessageCount} neue Kampfberichte eingelesen.`,
            timeout: 5000,
        });

        await BattleModule.save();
    }

    if(newErrorCount > 0) {
        //TODO: localization
        NotificationModule.addNotification({
            type: 'error',
            title: 'Fehler',
            text: `Es wurden ${newErrorCount} Kampfberichte nicht eingelesen.`,
            timeout: 5000,
        });
    }
}

async function readBattleReport(id: number, messageUrl: string): Promise<BattleReport> {
    const playerId = OgameMetaData.playerId;
    const ogameBattleReport = await loadOgameBattleReport(messageUrl);

    const attackingFleets = Object.values(ogameBattleReport.attacker);
    // lootFactor if player is one of the attackers = 1
    // if player a defending fleet but not the owner of the planet = 0
    // else if player lost and is owner of the planet = -1
    let lootFactor = 0;
    if(!ogameBattleReport.isExpedition) {
        if(attackingFleets.some(fleet => fleet.ownerID == playerId)) {
            lootFactor = 1;
        } else if(ogameBattleReport.defender[0].ownerID == playerId) {
            lootFactor = -1;
        }
    }
    lootFactor *= (ogameBattleReport.result == 'attacker' ? 1 : 0);


    const expeditionAttackType = ogameBattleReport.isExpedition
        ? ogameBattleReport.attacker[0].ownerName == i18n.messages.ogame.factions.pirates
            ? 'pirates'
            : 'aliens'
        : null;

    const loot = {
        [Resource.metal]: ogameBattleReport.loot.metal * lootFactor,
        [Resource.crystal]: ogameBattleReport.loot.crystal * lootFactor,
        [Resource.deuterium]: ogameBattleReport.loot.deuterium * lootFactor,
    };
    const debrisField = {
        [Resource.metal]: ogameBattleReport.debris.metal,
        [Resource.crystal]: ogameBattleReport.debris.crystal,
    };

    // attacker and defender losses
    const attackerLosses: Fleet = {
        [Ship.battlecruiser]: 0,
        [Ship.battleship]: 0,
        [Ship.bomber]: 0,
        [Ship.colonyShip]: 0,
        [Ship.crawler]: 0,
        [Ship.cruiser]: 0,
        [Ship.deathStar]: 0,
        [Ship.destroyer]: 0,
        [Ship.espionageProbe]: 0,
        [Ship.heavyFighter]: 0,
        [Ship.largeCargo]: 0,
        [Ship.lightFighter]: 0,
        [Ship.pathfinder]: 0,
        [Ship.reaper]: 0,
        [Ship.recycler]: 0,
        [Ship.smallCargo]: 0,
        [Ship.solarSatellite]: 0,
    };
    const defenderLosses: Fleet = {
        [Ship.battlecruiser]: 0,
        [Ship.battleship]: 0,
        [Ship.bomber]: 0,
        [Ship.colonyShip]: 0,
        [Ship.crawler]: 0,
        [Ship.cruiser]: 0,
        [Ship.deathStar]: 0,
        [Ship.destroyer]: 0,
        [Ship.espionageProbe]: 0,
        [Ship.heavyFighter]: 0,
        [Ship.largeCargo]: 0,
        [Ship.lightFighter]: 0,
        [Ship.pathfinder]: 0,
        [Ship.reaper]: 0,
        [Ship.recycler]: 0,
        [Ship.smallCargo]: 0,
        [Ship.solarSatellite]: 0,
    };

    const ships = getNumericEnumValues<Ship>(Ship);
    const lastRound = ogameBattleReport.combatRounds[ogameBattleReport.combatRounds.length - 1];
    Object.values(lastRound.attackerLosses ?? {}).forEach(loss => {
        ships.forEach(ship => {
            const countStr = loss![ship];
            if (countStr == null)
                return;

            const count = parseInt(countStr);
            attackerLosses[ship] += count;
        });
    });
    Object.values(lastRound.defenderLosses ?? {}).forEach(loss => {
        ships.forEach(ship => {
            const countStr = loss![ship];
            if (countStr == null)
                return;

            const count = parseInt(countStr);
            defenderLosses[ship] += count;
        });
    });


    const report: BattleReport = {
        id,
        date: new Date(ogameBattleReport.event_time).getTime(),
        coordinates: {
            galaxy: ogameBattleReport.coordinates.galaxy,
            system: ogameBattleReport.coordinates.system,
            position: ogameBattleReport.coordinates.position,
            type: ogameBattleReport.coordinates.planetType,
        },
        result: ogameBattleReport.result,
        isExpedition: ogameBattleReport.isExpedition,
        expeditionAttackType: expeditionAttackType,
        loot: loot,
        debrisField: debrisField,
        attackerLosses: attackerLosses,
        defenderLosses: defenderLosses,
    };
    return report;
}

async function loadOgameBattleReport(messageUrl: string) {
    const response = await fetch(messageUrl, { method: 'GET' });
    const html = await response.text();

    // find the script with the 'combatData' variable that includes the combat JSON
    const fakeDoc = document.createElement('div');
    fakeDoc.innerHTML = html;
    const scripts = fakeDoc.querySelectorAll('script');
    const combatScript = Array.from(scripts).find(script => script.textContent!.includes('var combatData'))!;

    const combatJsonRegex = /var combatData = jQuery.parseJSON\('([^']+)'\);/;
    const combatJsonMatch = combatScript.textContent!.match(combatJsonRegex)!;
    const combatJson = combatJsonMatch[1];

    return JSON.parse(combatJson) as OgameBattleReport;
}

