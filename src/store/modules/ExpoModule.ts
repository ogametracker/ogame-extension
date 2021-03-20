import fakeData from "@/_fakeData.json";
import ExpoEventCollection from '@/models/expeditions/ExpoEventCollection';
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
}

export default new ExpoModule();