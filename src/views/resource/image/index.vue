<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item prop="imageType">
          <el-select v-model="queryParams.imageType" placeholder="图片类型" clearable style='width: 100px'>
            <el-option v-for="dict in IMAGE_TYPE" :key="dict.value" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
         <el-form-item prop="imageName">
            <el-input v-model="queryParams.imageName" placeholder="图片名称" clearable style="width: 160px" @keyup.enter="handleQuery"/>
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
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"/>
      </el-row>

      <el-table v-loading="loading" height="680" :data="pageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="图片类型" align="center" prop="imageType" width="120">
          <template #default="scope"><dict-tag :options="IMAGE_TYPE" :value="scope.row.imageType"/></template>
        </el-table-column>
        <el-table-column label="图片名称" align="left" prop="imageName" width="200" :show-overflow-tooltip="true" />
        <el-table-column prop="avatar" label="图片" align="center" width="100">
          <template #default="scope">
            <el-image style='width: 40px; height: 40px' :src='scope.row.imageUrl' :preview-src-list=[scope.row.imageUrl]></el-image>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="left" prop="sort" width="80" :show-overflow-tooltip="true"/>
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
           <el-form-item label="图片类型" prop="imageType">
             <el-radio-group v-model="form.imageType">
               <el-radio v-for="dict in IMAGE_TYPE" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
             </el-radio-group>
           </el-form-item>
           <el-form-item label="图片名称" prop="imageName">
             <el-input v-model="form.imageName" placeholder="请输入图片名称" />
           </el-form-item>
           <el-form-item label="排序" prop="sort">
             <el-input v-model="form.sort" placeholder="排序" type="number"/>
           </el-form-item>
           <el-form-item label="图片" prop="imageUrl">
             <image-upload
                 :fileSize="1"
                 :limit="1"
                 busnessType="imglab"
                 v-model:modelValue="form.imageUrl"
             />
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

<script setup name="ImageLibrary">
import {
  consoleImageLibraryPage,
  consoleImageLibraryInfo,
  consoleImageLibrarySave,
  consoleImageLibraryRemove
} from "@/api/sys";

const { proxy } = getCurrentInstance();
const { IMAGE_TYPE } = proxy.useDict("IMAGE_TYPE");

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
    imageType: undefined,
    imageName: undefined
  },
  rules: {
    imageType: [{ required: true, message: "图片类型不能为空", trigger: "blur" }],
    imageName: [{ required: true, message: "图片名称不能为空", trigger: "blur" }],
    imageUrl: [{ required: true, message: "图片不能为空", trigger: "blur" }]
  }
});
const { queryParams, form, rules } = toRefs(data);

function init() {
  queryParams.value.pageNo = 1;
}

/** 查询参数列表 */
function getList() {
  loading.value = true;
  consoleImageLibraryPage(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    const data = res.data;
    pageList.value = data.rows;
    total.value = data.totalCount;
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
  form.value.sort = 99;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value;
  consoleImageLibraryInfo({id}).then(res => {
    form.value = res.data;
    open.value = true;
    title.value = "修改参数";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      consoleImageLibrarySave(form.value).then(res => {
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
    consoleImageLibraryRemove(param).then(res => {
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
