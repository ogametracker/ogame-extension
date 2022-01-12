<template>
    <div></div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class $TM_FILENAME_BASE extends Vue {
        @Prop({ required: true, type: String })
        private prop!: string;

        
    }
</script>