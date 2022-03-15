import Vue from 'vue';
import ListNav from './ListNav.vue';
import Page from './Page.vue';
import ScrollableChart from './ScrollableChart.vue';
import GridTable from './GridTable.vue';
import TabView from './TabView.vue';
import CustomDialog from './CustomDialog.vue';
import Checkbox from './Checkbox.vue';

Vue.component('checkbox', Checkbox);
Vue.component('custom-dialog', CustomDialog);
Vue.component('grid-table', GridTable);
Vue.component('list-nav', ListNav);
Vue.component('page', Page);
Vue.component('scrollable-chart', ScrollableChart);
Vue.component('tab-view', TabView);

import './ogame';