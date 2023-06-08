<script lang="ts" setup name="Page-B">
import { ref } from 'vue';
import { TmpPage } from '@tmp/h5-schema';

import EditTable from '@/components/EditTable.vue';
import EditTableColumn from '@/components/EditTableColumn.vue';

const config: TmpPage = {
  id: 'page-1',
  name: 'page1',
  type: 'page',
  layout: '',
  children: [
    {
      id: 'form-1',
      name: 'form1',
      type: 'form',
      items: [
        {
          id: 'input-1',
          name: 'input1',
          type: 'input',
          label: '姓名',
          placeholder: '请输入姓名',
          clearable: true,
        },
        {
          id: 'select-1',
          name: 'select1',
          type: 'select',
          label: '性别',
          placeholder: '请选择性别',
          clearable: true,
          options: [
            {
              label: '男',
              value: 1,
            },
            {
              label: '女',
              value: 2,
            },
          ],
        },
      ],
    },
  ],
};

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];

const editTableRef = ref<InstanceType<typeof EditTable>>();
</script>

<template>
  <div>
    <h1>Page-B</h1>
    <TmpUiPage :config="config"></TmpUiPage>
    <EditTable ref="editTableRef" :data-source="tableData">
      <EditTableColumn prop="date" label="时间">
        <template #edit="{ row }">
          <input v-model="row.date" />
        </template>
      </EditTableColumn>
      <EditTableColumn prop="name" label="姓名">
        <template #edit="{ row }">
          <input v-model="row.name" />
        </template>
      </EditTableColumn>
      <EditTableColumn prop="address" label="地址">
        <template #edit="{ row }">
          <input v-model="row.address" />
        </template>
      </EditTableColumn>
      <EditTableColumn label="操作">
        <template #default="{ actions, $index }">
          <button @click="actions.startEditable($index)">操作</button>
          <button @click="actions.deleteRow($index)">删除</button>
        </template>
        <template #edit="{ actions, $index }">
          <button @click="actions.saveEditable($index)">保存</button>
          <button @click="actions.cancelEditable($index)">取消</button>
          <button @click="actions.deleteRow($index)">删除</button>
        </template>
      </EditTableColumn>
    </EditTable>
    <button @click="editTableRef?.editActions.addRow()">新增</button>
  </div>
</template>
