<template>
    <span :class="`icon-${name}`"/>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Icon extends Vue {
        @Prop({ required: true, type: String })
        private name!: string;
    }
</script>