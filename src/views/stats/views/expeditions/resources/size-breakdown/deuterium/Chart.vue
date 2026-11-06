<template>
    <SizeChart :resource="ResourceType.deuterium" />
</template>

<script setup lang="ts">
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import SizeChart from '@stats/components/expeditions/resources/sizes-by-resource/Chart.vue';
</script>
