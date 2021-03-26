import i18n from "@/i18n";
import WreckfieldReport from "@/models/wreckfields/WreckfieldReport";
import NotificationModule from "@/store/modules/NotificationModule";
import WreckfieldModule from "@/store/modules/WreckfieldModule";
import { parse } from "date-fns";

const tabIdMiscMessages = '24';
const noWreckfieldReport: number[] = [];

export default async function readWreckfields() {
    const messagePage = document.querySelector('div[id^="ui-id-"][aria-hidden="false"] > #fleetsgenericpage');
    const parent = messagePage?.parentElement;
    if (messagePage == null || parent == null)
        return;

    const labelId = parent.getAttribute('aria-labelledby');
    if (labelId == null)
        return;

    const tabId = document.getElementById(labelId)?.parentElement?.getAttribute('data-tabid');
    if (tabId != tabIdMiscMessages)
        return;

    const knownWreckfieldReports = WreckfieldModule.reportsById;
    let newMessageCount = 0;

    const messageContainers = messagePage.querySelectorAll('.msg[data-msg-id]');
    for (const messageContainer of messageContainers) {
        const msgId = parseInt(messageContainer.getAttribute('data-msg-id')!);

        if (knownWreckfieldReports[msgId] != null
            || noWreckfieldReport.includes(msgId)) {

            continue;
        }

        try {
            const message = messageContainer.querySelector('.msg_content')!.textContent!
                .trim()
                .replace(/\s+/g, ' ');

            const wreckfieldReport = getWreckfieldReport(msgId, message, messageContainer);
            if (wreckfieldReport == null) {
                noWreckfieldReport.push(msgId);
                continue;
            }

            WreckfieldModule.add(wreckfieldReport);
            newMessageCount++;
        } catch (e) {
            console.error(e);

            //TODO: localization
            NotificationModule.addNotification({
                type: 'error',
                text: 'Es ist ein Fehler aufgetreten.',
                title: 'Fehler',
                timeout: 5000,
            });
        }
    }

    if (newMessageCount > 0) {
        //TODO: localization
        NotificationModule.addNotification({
            type: 'info',
            title: 'Neue TF-Nachrichten',
            text: `Es wurden ${newMessageCount} neue TF-Nachrichten eingelesen.`,
            timeout: 5000,
        });

        await WreckfieldModule.save();
    }
}

function getWreckfieldReport(id: number, message: string, messageContainer: Element): WreckfieldReport | null {
    const dateText = messageContainer.querySelector('.msg_head .msg_date.fright')!.textContent!;
    const date = parse(dateText, i18n.dateTimeFormats.long, new Date()).getTime();

    const regex = i18n.messages.ogame.wreckfieldMessages.regex as RegExp;
    const match = message.match(regex);
    if (match == null)
        return null;

    const metal = parseInt(match[1].replace(/[^\d]/g, ''));
    const crystal = parseInt(match[2].replace(/[^\d]/g, ''));
    const report: WreckfieldReport = {
        date,
        id,
        metal,
        crystal,
    };
    return report;
}