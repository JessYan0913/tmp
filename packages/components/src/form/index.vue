<script setup lang="ts">
import { ref, watch } from 'vue';
import { VForm } from 'vuetify/components/VForm';
import { TmpFormElement, TmpFormModel } from '@tmp/h5-schema';

import TmpUiComponent from '../Component.vue';
import { useApp } from '../hooks/useApp';

const props = defineProps<{
  config: TmpFormElement;
}>();

const { triggerEvent, provideMethod } = useApp(props);

const value = ref<TmpFormModel>({});

watch(
  () => value.value,
  () => triggerEvent('change', { value: value.value }),
  { deep: true }
);

provideMethod('submit', () => {
  triggerEvent('submit', { value: value.value });
});

defineExpose({
  value,
});
</script>

<template>
  <VForm :model="value">
    <TmpUiComponent
      v-for="itemElement in config.children"
      :key="itemElement.id"
      v-model="value[itemElement.id ?? '']"
      :config="itemElement"
      :model="value"
    >
    </TmpUiComponent>
  </VForm>
</template>
