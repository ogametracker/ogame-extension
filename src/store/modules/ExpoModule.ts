import fakeData from "@/_fakeData.json";

import { Component, Vue } from 'vue-property-decorator';
import ExpoEvent from "@/models/expeditions/ExpoEvent";

@Component({})
class ExpoModule extends Vue {
    public readonly expos: ExpoEvent[] = [];

    private async created() {
        this.expos.splice(0);

        const expos = await new Promise<ExpoEvent[]>(resolve => {
            //TODO: load from chrome storage
            resolve(Object.values(fakeData) as ExpoEvent[]);
        });
        this.expos.push(...expos);
    }

    public get firstExpo(): ExpoEvent | null {
        return this.expos.reduce(
            (acc, cur) => acc == null || (acc.date > cur.date) ? cur : acc,
            null as ExpoEvent | null);
    }
}

export default new ExpoModule();