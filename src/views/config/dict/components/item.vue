<template>
   <div>
     <el-form :inline="true" label-width="68px">
       <el-form-item style="float: right;">
         <el-button type="primary" plain icon="Plus" :disabled="!select.dictType" @click="handleAdd">添加枚举</el-button>
       </el-form-item>
     </el-form>
     <el-table v-loading="loading" height="620" :data="dataList">
       <el-table-column label="字典值" align="left" prop="dictValue" min-width="120" :show-overflow-tooltip="true" />
       <el-table-column label="字典标签" align="left" prop="dictLabel" min-width="120" :show-overflow-tooltip="true"/>
       <el-table-column label="样式" align="left" prop="elType" min-width="120" :show-overflow-tooltip="true">
         <template #default="scope">
           <el-button v-if="scope.row.elType" :type="scope.row.elType" plain>{{scope.row.elType}}</el-button>
         </template>
       </el-table-column>
       <el-table-column label="描述" align="left" prop="description" min-width="120" :show-overflow-tooltip="true"/>
       <el-table-column label="排序" align="left" prop="sort" width="80" :show-overflow-tooltip="true"/>
       <el-table-column label="操作" align="center" fixed='right' width="80" class-name="small-padding fixed-width">
         <template #default="scope">
           <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"/>
           <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"/>
         </template>
       </el-table-column>
     </el-table>

     <item-edit ref="editRef" @change="getList"/>
   </div>
</template>

<script setup name="SysDictItem">
import {consoleDictItemList, consoleDictItemRemove} from "@/api/dict";
import ItemEdit from "./itemEdit"

defineExpose({init})
const { proxy } = getCurrentInstance();

const dataList = ref([]);
const loading = ref(false);
const title = ref("");
const select = ref({});

function init(row) {
  select.value = row;
  getList();
}

function getList() {
  loading.value = true;
  consoleDictItemList({dictType: select.value.dictType}).then(res => {
    dataList.value = res.data;
  }).finally(() => {
    loading.value = false;
  });
}
function handleAdd() {
  const row = {
    dictType: select.value.dictType,
    description: select.value.description
  };
  proxy.$refs["editRef"].handleEdit(row);
}
function handleUpdate(row) {
  proxy.$refs["editRef"].handleEdit(row);
}

function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除： "' + row.dictValue + '"的字典内容项？').then(() => {
    consoleDictItemRemove({id: row.id}).then(res => {
      if (res.code === 1) {
        getSysDictList({dictType: row.dictType});
        proxy.$modal.msgSuccess("删除成功");
      } else {
        proxy.$modal.msgError('删除失败: ' + res.msg);
      }
    })
  }).catch(() => {});
}

</script>
