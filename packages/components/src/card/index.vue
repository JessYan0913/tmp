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
    <template v-if="config.title" #title>
      <span v-if="typeof config.title === 'string'">{{ config.title }}</span>
      <TmpUiComponent v-else :config="config.title"></TmpUiComponent>
    </template>
    <template v-if="config.subtitle" #subtitle>
      <span v-if="typeof config.subtitle === 'string'">{{ config.subtitle }}</span>
      <TmpUiComponent v-else :config="config.subtitle"></TmpUiComponent>
    </template>
    <template v-if="config.content" #text>
      <span v-if="typeof config.content === 'string'">{{ config.content }}</span>
      <TmpUiComponent v-else :config="config.content"></TmpUiComponent>
    </template>
  </VCard>
</template>
