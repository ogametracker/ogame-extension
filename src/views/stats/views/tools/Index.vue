<template>
    <div>
        TODO: Tools
        <!-- <input type="text" v-model="text" />
        {{ text }}
        <hr />
        <input type="number" v-model.number="number" :step="0.1" :min="0" :max="10.1" />
        {{ number }} -->
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';

    @Component({})
    export default class Index extends Vue {
        // private text = 'Text';
        // private number = 5.55;

        // @Watch('number')
        // private onNumberChanged(newValue: string | number) {
        //     if(isNaN(this.number) || newValue == '') {
        //         this.number = 0;
        //     }
        // }
    }
</script>