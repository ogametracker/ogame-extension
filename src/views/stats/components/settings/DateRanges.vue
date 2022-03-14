<template>
    <div></div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class DateRanges extends Vue {
        @Prop({ required: true, type: String })
        private prop!: string;

        
    }
</script>