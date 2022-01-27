<template>
    <!-- TODO: excel export page -->
    <div>EXCEL EXPORT</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ExcelExport extends Vue {
        @Prop({ required: true, type: String })
        private prop!: string;


    }
</script>