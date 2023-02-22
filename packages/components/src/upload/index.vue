<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CircleCloseFilled, Upload } from '@element-plus/icons-vue';
import { useSelectFileUpload } from '@tmp/basic';
import { Request } from '@tmp/utils';
import { ElButton, ElFormItem, ElIcon } from 'element-plus';

import { TmpFile, TmpPicture, TmpUpload } from './type';

const props = defineProps<{
  config: TmpUpload;
}>();

const files = ref<TmpFile[]>([]);

const listType = computed<string>(() => props.config.listType ?? 'list');

const pictures = ref<TmpPicture[]>([]);

const { execute: executeUpload } = useSelectFileUpload((sysFiles: File[]) => {
  for (const sysFile of sysFiles) {
    const file: TmpFile = {
      name: sysFile.name,
      type: sysFile.type,
      size: sysFile.size,
      lastModified: sysFile.lastModified,
      webkitRelativePath: sysFile.webkitRelativePath,
      loading: true,
    };

    files.value.push(file);
    fetchUploadFile(sysFile)
      .then((resourceId) => {
        file.resourceId = resourceId;
      })
      .finally(() => (file.loading = false));
  }
});

const handleClickUpload = () => {
  executeUpload([props.config.accept ?? '*'], props.config.multiple);
};

const handleClickDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

async function fetchUploadFile(file: File): Promise<any> {
  const data = Object.entries(props.config.parameters ?? {}).reduce((formData, [key, value]) => {
    if (value === '${file}') {
      value = file;
    } else if (value === '${file.name}') {
      value = file.name;
    }
    formData.set(key, value);
    return formData;
  }, new FormData());
  const request = new Request({});
  await request.request({
    headers: props.config.headers,
    url: props.config.action,
    method: props.config.method,
    data,
  });
}
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
      <div v-if="listType === 'picture'">
        <div v-for="(picture, index) in pictures" :key="index" class="file-picture__item">
          <img />
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
