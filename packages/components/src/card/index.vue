<script setup lang="ts">
import { VCard } from 'vuetify/components/VCard';

import TmpUiComponent from '../Component.vue';

import { TmpCard } from './types';

defineProps<{
  config: TmpCard;
}>();
</script>

<template>
  <VCard>
    <template #title>
      <span v-if="typeof config.title === 'string'">{{ config.title }}</span>
      <TmpUiComponent v-else-if="config.title !== void 0" :config="config.title"></TmpUiComponent>
    </template>
    <template #subtitle>
      <span v-if="typeof config.subtitle === 'string'">{{ config.subtitle }}</span>
      <TmpUiComponent v-else-if="config.subtitle !== void 0" :config="config.subtitle"></TmpUiComponent>
    </template>
    <template #text>
      <span v-if="typeof config.content === 'string'">{{ config.content }}</span>
      <TmpUiComponent v-else-if="config.content !== void 0" :config="config.content"></TmpUiComponent>
    </template>
    <template #actions>
      <TmpUiComponent v-for="actionElement in config.actions" :key="actionElement.id" :config="actionElement">
      </TmpUiComponent>
    </template>
  </VCard>
</template>
