<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CircleCloseFilled, Upload } from '@element-plus/icons-vue';
import { useSelectFileUpload } from '@tmp/basic';
import { ElButton, ElFormItem, ElIcon } from 'element-plus';

import { TmpFile, TmpUpload } from './type';

const props = defineProps<{
  config: TmpUpload;
}>();

const files = ref<TmpFile[]>([]);

const listType = computed<string>(() => props.config.listType ?? 'list');

const { execute: executeUpload } = useSelectFileUpload((sysFiles: File[]) => {
  for (const file of sysFiles) {
    files.value.push(file);
  }
});

const handleClickUpload = () => {
  executeUpload([props.config.accept ?? '*'], props.config.multiple);
};

const handleClickDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};
</script>

<template>
  <ElFormItem :label="config.label" :prop="config.name">
    <div class="upload-wrapper">
      <ElButton class="upload-btn" type="primary" @click="handleClickUpload">
        文件上传<ElIcon class="el-icon--right"><Upload /></ElIcon>
      </ElButton>
      <div v-if="listType === 'list'">
        <div v-for="(file, index) in files" :key="index" class="file-list__item">
          <span class="name">{{ file.name }}</span>
          <ElIcon @click="handleClickDeleteFile(index)"><CircleCloseFilled /></ElIcon>
        </div>
      </div>
    </div>
  </ElFormItem>
</template>

<style lang="scss" scoped>
.upload-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.upload-btn {
  width: 100px;
}
.file-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  cursor: pointer;
  .name {
    max-width: 80%;
  }
  & > i {
    visibility: hidden;
  }
  &:hover {
    & > i {
      visibility: visible;
    }
  }
}
</style>
