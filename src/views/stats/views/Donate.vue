<template>
    <!-- TODO: donate page -->
    <div>DONATE</div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Donate extends Vue {
        @Prop({ required: true, type: String })
        private prop!: string;


    }
</script>