import BattleReport from "@/models/battles/BattleReport";
import BattleResult from "@/models/battles/BattleResult";
import OgameBattleReport from "@/models/battles/OgameBattleReport";
import Resource from "@/models/Resource";
import BattleModule from "@/store/modules/BattleModule";
import NotificationModule from "@/store/modules/NotificationModule";

const tabIdBattleMessages = '21';

const errorBattleReports: number[] = [];

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

    const messageContainers = messagePage.querySelectorAll('.msg[data-msg-id]');
    for (const messageContainer of messageContainers) {
        const msgId = parseInt(messageContainer.getAttribute('data-msg-id')!);

        if (knownBattleReports[msgId] != null || errorBattleReports.includes(msgId)) {
            return;
        }

        try {
            const messageUrl = (messageContainer.querySelector('.msg_action_link')! as HTMLAnchorElement).href;

            const battleReport = await readBattleReport(msgId, messageUrl);

            newMessageCount++;
        } catch (e) {
            console.error(e);

            errorBattleReports.push(msgId);

            //TODO: localization
            // NotificationModule.addNotification({
            //     type: 'error',
            //     text: 'Es ist ein Fehler aufgetreten.',
            //     title: 'Fehler',
            //     timeout: 5000,
            // });
        }
    }

    if (newMessageCount > 0) {
        //TODO: localization
        // NotificationModule.addNotification({
        //     type: 'info',
        //     title: 'Neue TF-Nachrichten',
        //     text: `Es wurden ${newMessageCount} neue TF-Nachrichten eingelesen.`,
        //     timeout: 5000,
        // });

        //TODO: await BattleModule.save();
    }
}

async function readBattleReport(id: number, messageUrl: string): BattleReport {
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


    const ogameBattleReport = JSON.parse(combatJson) as OgameBattleReport;

    const expeditionAttackType = null; //TODO: pirates/aliens/none
    const loot = { //TODO: loot
        [Resource.metal]: 0,
        [Resource.crystal]: 0,
        [Resource.deuterium]: 0,
    };
    const honorPoints = 0; //TODO: honor points
    const debrisField = {//TODO: debris field
        [Resource.metal]: 0,
        [Resource.crystal]: 0,
    };

    const attackerLosses = {}; //TODO: attacker losses
    const defenderLosses = {}; //TODO: defender losses

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
        honorPoints: honorPoints,
        debrisField: debrisField,
        attackerLosses: attackerLosses,
        defenderLosses: defenderLosses,
    };
    return report;
}

