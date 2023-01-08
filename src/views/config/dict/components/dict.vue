<template>
   <div style="position: relative">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item prop="dictType">
          <el-input v-model="queryParams.dictType" placeholder="字典项" clearable style="width: 160px" @keyup.enter="handleQuery"/>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
         </el-form-item>
        <el-form-item style="float: right;">
           <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
         </el-form-item>
      </el-form>
       <el-table v-loading="loading" highlight-current-row height="620" @current-change="getDictItems" :data="dataList">
         <el-table-column label="ID" align="center" prop="id" width="80"/>
         <el-table-column label="字典项" align="left" prop="dictType" min-width="200" :show-overflow-tooltip="true" />
         <el-table-column label="描述" align="left" prop="description" min-width="160" :show-overflow-tooltip="true" />
         <el-table-column label="枚举数" align="left" prop="count" width="80" :show-overflow-tooltip="true"/>
         <el-table-column label="操作" align="center" fixed='right' width="80" class-name="small-padding fixed-width">
           <template #default="scope">
             <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"/>
             <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"/>
           </template>
         </el-table-column>
       </el-table>
       <pagination v-show="total > 0" :total="total" v-model:page="queryParams.current" v-model:limit="queryParams.size" @pagination="getList" />

     <dict-edit ref="editRef" @change="getList"/>
   </div>
</template>

<script setup name="SysDictPage">
import {consoleDictPage, consoleDictRemove} from "@/api/dict";
import DictEdit from "./dictEdit"

const emit = defineEmits(['select']);
const { proxy } = getCurrentInstance();
const dataList = ref([]);

const loading = ref(false);
const total = ref(0);

const queryParams = ref({
  current: 1,
  size: 20,
  dictType: undefined,
});

function init() {
  queryParams.value.current = 1;
}

/** 查询参数列表 */
function getList() {
  loading.value = true;
  consoleDictPage(queryParams.value).then(res => {
    const data = res.data;
    dataList.value = data.rows;
    total.value = data.total;
  }).finally(() => {
    loading.value = false;
  });
}

function getDictItems(row) {
  emit("select", row);
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.current = 1;
  getList();
}

function handleAdd() {
  proxy.$refs["editRef"].handleEdit();
}
function handleUpdate(row) {
  proxy.$refs["editRef"].handleEdit(row);
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除参: "' + row.dictType + '"？').then(() => {
    consoleDictRemove({ id: row.id}).then(res => {
      if (res.code === 1) {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      } else {
        proxy.$modal.msgError('删除失败: ' + res.msg);
      }
    })
  }).catch(() => {});
}

init();
getList();
</script>
