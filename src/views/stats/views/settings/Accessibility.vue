<template>
    <div class="accessibility-settings">
        <show-simplified-results-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import ShowSimplifiedResultsSettings from '@stats/components/settings/accessibility/ShowSimplifiedResultsSettings.vue';

    @Component({
        components: {
            ShowSimplifiedResultsSettings,
        },
    })
    export default class Accessibility extends Vue {
        
    }
</script>