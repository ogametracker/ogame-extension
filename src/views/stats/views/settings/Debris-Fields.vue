<template>
    <div>
        <separate-expedition-and-normal-debris-field-settings />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import SeparateExpeditionAndNormalDebrisFieldSettings from '@stats/components/settings/debris-fields/SeparateExpeditionAndNormalDebrisFieldSettings.vue';

    @Component({
        components: {
            SeparateExpeditionAndNormalDebrisFieldSettings,
        },
    })
    export default class DebrisFields extends Vue {

    }
</script>