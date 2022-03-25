<template>
    <floating-menu v-model="show" left>
        <template #activator>
            <button @click="show = !show">
                <span class="mdi mdi-plus" />
            </button>
        </template>

        TODO: add debris field manually
    </floating-menu>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component({})
    export default class ManuallyAddDebrisFieldMenu extends Vue {
        private show = false;
    }
</script>