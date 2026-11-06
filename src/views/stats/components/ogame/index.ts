import type { App } from 'vue';
import OAllianceClass from './OAllianceClass.vue';
import OBuilding from './OBuilding.vue';
import ODefense from './ODefense.vue';
import OItem from '@ogame-tracker/view-shared/components/ogame/OItem.vue';
import OOfficer from './OOfficer.vue';
import OPlayerClass from './OPlayerClass.vue';
import OResearch from './OResearch.vue';
import OResource from '@ogame-tracker/view-shared/components/ogame/OResource.vue';
import OShip from '@ogame-tracker/view-shared/components/ogame/OShip.vue';
import OLifeform from '@ogame-tracker/view-shared/components/ogame/OLifeform.vue';
import OLifeformBuilding from './OLifeformBuilding.vue';
import OLifeformTechnology from './OLifeformTechnology.vue';

export function registerOgameComponents(app: App) {
    app.component('o-alliance-class', OAllianceClass);
    app.component('o-building', OBuilding);
    app.component('o-defense', ODefense);
    app.component('o-item', OItem);
    app.component('o-lifeform', OLifeform);
    app.component('o-lifeform-building', OLifeformBuilding);
    app.component('o-lifeform-technology', OLifeformTechnology);
    app.component('o-officer', OOfficer);
    app.component('o-player-class', OPlayerClass);
    app.component('o-research', OResearch);
    app.component('o-resource', OResource);
    app.component('o-ship', OShip);
}
