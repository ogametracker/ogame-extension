<template>
    <size-table :resource="ResourceType.deuterium" />
</template>

<script setup lang="ts">
import { ResourceType } from '@ogame-tracker/shared/models/ogame/resources/ResourceType';
import SizeTable from '@stats/components/expeditions/resources/sizes-by-resource/Table.vue';
</script>
