<template>
    <span
        :class="`icon-${name}`"
        v-bind="{ ...$attrs, ...$props }"
        v-on="$listeners"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class Icon extends Vue {
        @Prop({ required: true, type: String })
        private name!: string;
    }
</script>