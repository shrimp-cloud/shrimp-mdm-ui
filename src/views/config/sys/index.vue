<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
         <el-form-item prop="configKey">
            <el-input v-model="queryParams.sysKey" placeholder="参数键名" clearable style="width: 160px" @keyup.enter="handleQuery"/>
         </el-form-item>
         <el-form-item prop="userDefine">
            <el-select v-model="queryParams.userDefine" placeholder="自定义" clearable style='width: 100px'>
               <el-option v-for="dict in BOOLEAN" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
         </el-form-item>
         <el-form-item>
           <el-date-picker v-model="dateRange" style='width: 380px' value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"/>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
         </el-col>
         <!--
         <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
         </el-col>
         -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"/>
      </el-row>

      <el-table v-loading="loading" height="680" :data="pageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="参数键名" align="left" prop="sysKey" width="200" :show-overflow-tooltip="true" />
        <el-table-column label="参数键值" align="left" prop="sysValue" width="200" :show-overflow-tooltip="true"/>
        <el-table-column label="用户定义" align="center" prop="userDefine" width="80">
          <template #default="scope"><dict-tag :options="BOOLEAN" :value="scope.row.userDefine"/></template>
        </el-table-column>
        <el-table-column label="备注" align="left" prop="comments" width="320" :show-overflow-tooltip="true" />
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
         v-model:page="queryParams.pageNo"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form ref="editRef" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="参数键名" prop="configKey">
               <el-input v-model="form.sysKey" placeholder="请输入参数键名" />
            </el-form-item>
            <el-form-item label="参数键值" prop="configValue">
               <el-input v-model="form.sysValue" type="textarea" placeholder="请输入参数键值" />
            </el-form-item>
            <el-form-item label="是否自定义" prop="userDefine">
               <el-radio-group v-model="form.userDefine">
                 <el-radio v-for="dict in BOOLEAN" :key="Number(dict.value)" :label="Number(dict.value)">{{ dict.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="comments">
               <el-input v-model="form.comments" type="textarea" placeholder="请输入内容" />
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="SysConfig">
import {
  consoleSysConfigInfo,
  consoleSysConfigPage,
  consoleSysConfigSave,
  consoleSysConfigRemove
} from "@/api/sys";

const { proxy } = getCurrentInstance();
const { BOOLEAN } = proxy.useDict("BOOLEAN");

const pageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNo: 1,
    pageSize: 20,
    sysKey: undefined,
    userDefine: undefined
  },
  rules: {
    sysKey: [{ required: true, message: "参数键名不能为空", trigger: "blur" }],
    sysValue: [{ required: true, message: "参数键值不能为空", trigger: "blur" }]
  }
});
const { queryParams, form, rules } = toRefs(data);

function init() {
  /*
  const now = new Date();
  dateRange.value = [
    parseTime(now.setDate(now.getDate()-7), '{y}-{m}-{d}') + ' 00:00:00',
    parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59'
  ];
  */
  queryParams.value.pageNo = 1;
}

/** 查询参数列表 */
function getList() {
  loading.value = true;
  consoleSysConfigPage(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    const data = res.data;
    pageList.value = data.rows;
    total.value = data.totalCount;
  }).finally(() => {
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 表单重置 */
function reset() {
  form.value = {};
  proxy.resetForm("editRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加参数";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  consoleSysConfigInfo({id}).then(res => {
    form.value = res.data;
    open.value = true;
    title.value = "修改参数";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      consoleSysConfigSave(form.value).then(res => {
        proxy.$modal.msgSuccess(form.value.id === undefined ?"新增成功":"修改成功");
        open.value = false;
        getList();
      });
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idsMsg = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除参数编号为"' + idsMsg + '"的数据项？').then(() => {
    const param = {
      id: row.id,
      ids: row.id ? null : ids.value
    }
    consoleSysConfigRemove(param).then(res => {
      if (res.code === 1) {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      } else {
        proxy.$modal.msgError('删除失败: ' + res.msg);
      }
    })
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/config/export", {
    ...queryParams.value
  }, `config_${new Date().getTime()}.xlsx`);
}

init();
getList();
</script>
