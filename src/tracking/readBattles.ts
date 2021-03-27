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
    for(const messageContainer of messageContainers) {
        const msgId = parseInt(messageContainer.getAttribute('data-msg-id')!);

        if (knownBattleReports[msgId] != null || errorBattleReports.includes(msgId)) {
            return;
        }

        try {
            const messageUrl = (messageContainer.querySelector('.msg_action_link')! as HTMLAnchorElement).href;

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