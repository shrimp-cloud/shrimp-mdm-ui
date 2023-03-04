<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
         <el-form-item prop="configKey">
            <el-input v-model="queryParams.sysKey" placeholder="参数键名" clearable style="width: 160px" @keyup.enter="handleQuery"/>
         </el-form-item>
         <el-form-item prop="userDefine">
            <el-select v-model="queryParams.userDefine" placeholder="自定义" clearable style='width: 100px'>
               <el-option v-for="dict in BOOLEAN" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :height="tableHeight" :data="dataList">
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="参数键名" align="left" prop="sysKey" min-width="200" :show-overflow-tooltip="true" />
        <el-table-column label="参数键值" align="left" prop="sysValue" min-width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="用户定义" align="center" prop="userDefine" width="80">
          <template #default="scope"><dict-tag :options="BOOLEAN" :value="scope.row.userDefine"/></template>
        </el-table-column>
        <el-table-column label="备注" align="left" prop="remark" min-width="320" :show-overflow-tooltip="true" />
        <el-table-column label="修改人" align="left" prop="updateByName" width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="160">
          <template #default="scope"><span>{{ parseTime(scope.row.updateTime) }}</span></template>
        </el-table-column>
        <el-table-column label="创建人" align="left" prop="createByName" width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template #default="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed='right' width="160" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="text" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

     <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.current"
         v-model:limit="queryParams.size"
         @pagination="getList"
     />

     <edit ref="editRef" @change="getList"/>
   </div>
</template>

<script setup name="SysConfig">
import {consoleSysConfigPage, consoleSysConfigRemove} from "@/api/sysConfig";
import Edit from "./components/edit"

const tableHeight = computed(() => window.innerHeight - 216);
const { proxy } = getCurrentInstance();
const { BOOLEAN } = proxy.useDict("BOOLEAN");

const dataList = ref([]);
const open = ref(false);
const loading = ref(false);
const total = ref(0);
const title = ref("");

const queryParams = ref({
  current: 1,
  size: 20,
  sysKey: undefined,
  userDefine: undefined
});


/** 查询参数列表 */
function getList() {
  loading.value = true;
  consoleSysConfigPage(queryParams.value).then(res => {
    const data = res.data;
    dataList.value = data.rows;
    total.value = data.total;
  }).finally(() => {
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.current = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function handleAdd() {
  proxy.$refs["editRef"].handleEdit();
}
function handleUpdate(row) {
  proxy.$refs["editRef"].handleEdit(row);
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除:"' + row.sysKey + '"？').then(() => {
    consoleSysConfigRemove({id: row.id}).then(res => {
      if (res.code === 1) {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      } else {
        proxy.$modal.msgError('删除失败: ' + res.msg);
      }
    })
  }).catch(() => {});
}

getList();
</script>
