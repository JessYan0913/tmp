<script lang="ts" setup name="EditTable">
import { ref } from 'vue';

import EditTable from '@/components/EditTable.vue';
import EditTableColumn from '@/components/EditTableColumn.vue';

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    sex: 'female',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    sex: 'female',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    sex: 'female',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    sex: 'female',
    address: 'No. 189, Grove St, Los Angeles',
  },
];

const addEditTableRef = ref<InstanceType<typeof EditTable>>();
const formEditTableRef = ref<InstanceType<typeof EditTable>>();
const resultTableRef = ref<InstanceType<typeof EditTable>>();

const loadData = async () => [
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
</script>

<template>
  <div class="wrapper">
    <section>
      <h1>另一种数据源配置</h1>
      <EditTable class="edit-table" :request="loadData">
        <EditTableColumn prop="date" label="时间"> </EditTableColumn>
        <EditTableColumn prop="name" label="姓名"> </EditTableColumn>
        <EditTableColumn prop="address" label="地址"> </EditTableColumn>
      </EditTable>
    </section>
    <section>
      <h1>无编辑效果</h1>
      <EditTable class="edit-table" :data-source="tableData">
        <EditTableColumn prop="date" label="时间"> </EditTableColumn>
        <EditTableColumn prop="name" label="姓名"> </EditTableColumn>
        <EditTableColumn prop="address" label="地址"> </EditTableColumn>
      </EditTable>
    </section>
    <section>
      <h1>可编辑效果</h1>
      <EditTable class="edit-table" :data-source="tableData">
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
        <EditTableColumn prop="sex" label="性别">
          <template #default="{ row }">
            {{ row.sex === 'male' ? '男' : '女' }}
          </template>
          <template #edit="{ row }">
            <el-select v-model="row.sex">
              <el-option value="male" label="男"></el-option>
              <el-option value="female" label="女"></el-option>
            </el-select>
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
          </template>
          <template #edit="{ actions, $index }">
            <button @click="actions.saveEditable($index)">保存</button>
            <button @click="actions.cancelEditable($index)">取消</button>
          </template>
        </EditTableColumn>
      </EditTable>
    </section>
    <section>
      <h1>删除效果</h1>
      <EditTable class="edit-table" :data-source="tableData">
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
    </section>
    <section>
      <h1>新增效果</h1>
      <EditTable ref="addEditTableRef" class="edit-table" :data-source="tableData">
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
      <button @click="addEditTableRef?.editActions.addRow()">新增</button>
    </section>
    <section>
      <h1>表单校验效果</h1>
      <EditTable ref="formEditTableRef" class="edit-table" :data-source="tableData">
        <EditTableColumn
          prop="date"
          label="时间"
          :rules="[{ required: true, message: '时间是必填项', trigger: 'blur' }]"
        >
          <template #edit="{ row }">
            <input v-model="row.date" />
          </template>
        </EditTableColumn>
        <EditTableColumn
          prop="name"
          label="姓名"
          :rules="[{ required: true, message: '姓名是必填项', trigger: 'blur' }]"
        >
          <template #edit="{ row }">
            <input v-model="row.name" />
          </template>
        </EditTableColumn>
        <EditTableColumn
          prop="address"
          label="地址"
          :rules="[{ required: true, message: '地址是必填项', trigger: 'blur' }]"
        >
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
      <button @click="formEditTableRef?.editActions.addRow()">新增</button>
    </section>
    <section>
      <h1>获取编辑结果</h1>
      <EditTable ref="resultTableRef" class="edit-table" :data-source="tableData">
        <EditTableColumn
          prop="date"
          label="时间"
          :rules="[{ required: true, message: '时间是必填项', trigger: 'blur' }]"
        >
          <template #edit="{ row }">
            <input v-model="row.date" />
          </template>
        </EditTableColumn>
        <EditTableColumn
          prop="name"
          label="姓名"
          :rules="[{ required: true, message: '姓名是必填项', trigger: 'blur' }]"
        >
          <template #edit="{ row }">
            <input v-model="row.name" />
          </template>
        </EditTableColumn>
        <EditTableColumn
          prop="address"
          label="地址"
          :rules="[{ required: true, message: '地址是必填项', trigger: 'blur' }]"
        >
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
      <button @click="resultTableRef?.editActions.addRow()">新增</button>
      <div class="result-wrapper">获取数据:{{ resultTableRef?.resultData }}</div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  & section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 100px;
  }
}

.edit-table {
  width: 50%;
}

.result-wrapper {
  width: 50%;
}
</style>
