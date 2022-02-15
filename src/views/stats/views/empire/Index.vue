<template>
    <div>
       Empire: {{ empireData }}
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { EmpireDataModule } from '../../data/EmpireDataModule';

    @Component({})
    export default class Index extends Vue {
        private get empireData() {
            return EmpireDataModule.empire;
        }
    }
</script>