<script lang="ts" setup>
import { useTheme } from '@/hooks/useTheme';

const { theme } = useTheme();

const handleChangeTheme = (event: Event) => {
  if (event.target) {
    theme.value = (event.target as HTMLSelectElement).value;
  }
};
</script>

<template>
  <div>
    <select :value="theme" @change="handleChangeTheme">
      <option value="light">明亮</option>
      <option value="dark">暗色</option>
    </select>
  </div>
</template>
