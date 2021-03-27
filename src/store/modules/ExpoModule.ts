import fakeData from "@/_fakeData.json";

import { Component, Vue } from 'vue-property-decorator';
import ExpoEvent from "@/models/expeditions/ExpoEvent";
import { startOfDay } from "date-fns";
import ExpoEventCollection from "@/models/expeditions/ExpoEventCollection";
import asyncChromeStorage from "@/utils/asyncChromeStorage";

@Component({})
class ExpoModule extends Vue {
    public readonly expos: ExpoEvent[] = [];
    public exposById: ExpoEventCollection = {};

    private async created() {
        this.exposById = await asyncChromeStorage.get(this.storageKey) ?? {};
        this.expos.push(...Object.values(this.exposById));
    }

    public get firstExpo(): ExpoEvent | null {
        return this.expos.reduce(
            (acc, cur) => acc == null || (acc.date > cur.date) ? cur : acc,
            null as ExpoEvent | null);
    }

    public get byDay() {
        return this.expos.reduce(
            (acc, expo) => {
                const day = startOfDay(expo.date).getTime();
                if (acc[day] == null) {
                    acc[day] = [];
                }
                acc[day]!.push(expo);
                return acc;
            },
            {} as { [key: number]: ExpoEvent[] | undefined }
        );
    }

    public add(expo: ExpoEvent) {
        this.exposById[expo.id] = expo;
        this.expos.push(expo);
    }

    public get storageKey(): string {
        const serverMeta = document.querySelector('meta[name="ogame-universe"]') as HTMLMetaElement | null;
        const playerIdMeta = document.querySelector('meta[name="ogame-player-id"]') as HTMLMetaElement | null;
        if(serverMeta == null || playerIdMeta == null)
            throw new Error();

        const server = serverMeta.content.split('.')[0];
        const playerId = playerIdMeta.content;
        return `${server}-${playerId}-expoEvents`;
    }

    public async save() {
        console.log('saving expos', this.exposById);
        await asyncChromeStorage.set(this.storageKey, this.exposById);
    }
}

export default new ExpoModule();