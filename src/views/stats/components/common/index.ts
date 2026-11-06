import type { App } from 'vue';
import DecimalNumber from './DecimalNumber.vue';
import LoadingSpinner from './LoadingSpinner.vue';

import Checkbox from './Checkbox.vue';
import CheckboxButton from './CheckboxButton.vue';
import CustomDialog from './CustomDialog.vue';
import FloatingMenu from './FloatingMenu.vue';
import GridTable from './GridTable.vue';
import ListNav from './ListNav.vue';
import Page from './Page.vue';
import ScrollableChart from './scrollable-chart/ScrollableChart.vue';
import TabView from './TabView.vue';
import Tabs from './Tabs.vue';

export function registerCommonComponents(app: App) {
    app.component('decimal-number', DecimalNumber);
    app.component('loading-spinner', LoadingSpinner);
    app.component('checkbox', Checkbox);
    app.component('checkbox-button', CheckboxButton);
    app.component('custom-dialog', CustomDialog);
    app.component('floating-menu', FloatingMenu);
    app.component('grid-table', GridTable);
    app.component('list-nav', ListNav);
    app.component('page', Page);
    app.component('scrollable-chart', ScrollableChart);
    app.component('tab-view', TabView);
    app.component('tabs', Tabs);
}
