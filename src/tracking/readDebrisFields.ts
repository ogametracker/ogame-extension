import i18n from "@/i18n";
import DebrisFieldReport from "@/models/debrisFields/DebrisFieldReport";
import NotificationModule from "@/store/modules/NotificationModule";
import DebrisFieldModule from "@/store/modules/DebrisFieldModule";
import { parse } from "date-fns";

const tabIdMiscMessages = '24';
const noDebrisFieldReport: number[] = [];
const errorReports: number[] = [];

export default async function readDebrisFields() {
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

    const knownDebrisFieldReports = DebrisFieldModule.reportsById;
    let newMessageCount = 0;
    let newErrorCount = 0;

    const messageContainers = messagePage.querySelectorAll('.msg[data-msg-id]');
    for (const messageContainer of messageContainers) {
        const msgId = parseInt(messageContainer.getAttribute('data-msg-id')!);

        if(knownDebrisFieldReports[msgId] != null) {
            messageContainer.classList.add('msg-extension-read');
            continue;
        }

        if (errorReports.includes(msgId) || noDebrisFieldReport.includes(msgId)) {
            continue;
        }

        try {
            const message = messageContainer.querySelector('.msg_content')!.textContent!
                .trim()
                .replace(/\s+/g, ' ');

            const debrisFieldReport = getDebrisFieldReport(msgId, message, messageContainer);
            if (debrisFieldReport == null) {
                noDebrisFieldReport.push(msgId);
                continue;
            }

            DebrisFieldModule.add(debrisFieldReport);
            newMessageCount++;

            messageContainer.classList.add('msg-extension-read');
        } catch (e) {
            messageContainer.classList.add('msg-error');
            newErrorCount++;

            errorReports.push(msgId);
            console.error(e, msgId);
        }
    }

    if (newMessageCount > 0) {
        NotificationModule.addNotification({
            type: 'info',
            title: this.$extension.$t.notifications.debrisFields.success.title,
            text: this.$extension.$t.notifications.debrisFields.success.text(newMessageCount),
            timeout: 5000,
        });

        await DebrisFieldModule.save();
    }

    if (newErrorCount > 0) {
        NotificationModule.addNotification({
            type: 'error',
            title: this.$extension.$t.notifications.debrisFields.error.title,
            text: this.$extension.$t.notifications.debrisFields.error.text(newErrorCount),
            timeout: 5000,
        });
    }
}

function getDebrisFieldReport(id: number, message: string, messageContainer: Element): DebrisFieldReport | null {
    const dateText = messageContainer.querySelector('.msg_head .msg_date.fright')!.textContent!;
    const date = parse(dateText, i18n.dateTimeFormats.long, new Date()).getTime();

    const regex = this.$ogame.$t.debrisFieldMessages.regex as RegExp;
    const match = message.match(regex);
    if (match == null)
        return null;

    const metal = parseInt(match[1].replace(/[^\d]/g, ''));
    const crystal = parseInt(match[2].replace(/[^\d]/g, ''));
    const report: DebrisFieldReport = {
        date,
        id,
        metal,
        crystal,
    };
    return report;
}