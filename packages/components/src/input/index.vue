<script lang="ts" setup>
import { ElInput } from 'element-plus';

import { TmpInput } from './type';

defineProps<{
  config: TmpInput;
}>();
</script>

<template>
  <ElInput />
  <input />
</template>
