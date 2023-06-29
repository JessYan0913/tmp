<script setup lang="ts">
import { ref, watch } from 'vue';
import { VOverlay } from 'vuetify/components/VOverlay';

import TmpUiComponent from '../Component.vue';
import { useApp } from '../hooks/useApp';

import { TmpOverlay } from './types';

const props = defineProps<{
  config: TmpOverlay;
}>();

const { provideMethod, triggerEvent } = useApp(props);

const visibility = ref<boolean>();

watch(
  () => visibility.value,
  () => {
    triggerEvent('changeVisibility', { visibility: visibility.value });
  }
);

provideMethod('setVisibility', ({ newVisibility }) => (visibility.value = newVisibility), ['newVisibility']);

defineExpose({
  visibility,
});
</script>

<template>
  <VOverlay
    v-model="visibility"
    :persistent="config.persistent"
    :scrim="config.scrim"
    :scroll-strategy="config.scrollStrategy"
  >
    <TmpUiComponent v-for="itemElement in config.children" :key="itemElement.id" :config="itemElement">
    </TmpUiComponent>
  </VOverlay>
</template>
