import Vue from 'vue';
import GridTable from './GridTable.vue';
import GridHead from './GridHead.vue';
import GridBody from './GridBody.vue';
import GridRow from './GridRow.vue';
import GridCell from './GridCell.vue';

Vue.component('grid-table', GridTable);
Vue.component('grid-thead', GridHead);
Vue.component('grid-tbody', GridBody);
Vue.component('grid-tr', GridRow);
Vue.component('grid-cell', GridCell);