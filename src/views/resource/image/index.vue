<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
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
        <el-form-item style="float: right">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" height="680" :data="pageList">
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="图片类型" align="center" prop="imageType" min-width="120">
          <template #default="scope"><dict-tag :options="IMAGE_TYPE" :value="scope.row.imageType"/></template>
        </el-table-column>
        <el-table-column label="图片名称" align="left" prop="imageName" min-width="200" :show-overflow-tooltip="true" />
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
         v-model:page="queryParams.current"
         v-model:limit="queryParams.size"
         @pagination="getList"
      />

     <edit ref="editRef" @change="getList"/>
   </div>
</template>

<script setup name="ImageLibrary">
import {imageLibraryPage, imageLibraryRemove} from "@/api/image";
import Edit from "./components/edit"

const { proxy } = getCurrentInstance();
const { IMAGE_TYPE } = proxy.useDict("IMAGE_TYPE");

const pageList = ref([]);
const loading = ref(false);
const total = ref(0);
const dateRange = ref([]);
const queryParams = ref({
  current: 1,
  size: 20,
  imageType: undefined,
  imageName: undefined
});

function init() {
  queryParams.value.current = 1;
}

/** 查询参数列表 */
function getList() {
  loading.value = true;
  imageLibraryPage(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    const data = res.data;
    pageList.value = data.rows;
    total.value = data.total;
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
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

function handleAdd() {
  proxy.$refs["editRef"].handleEdit();
}
function handleUpdate(row) {
  proxy.$refs["editRef"].handleEdit(row);
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      imageLibrarySave(form.value).then(res => {
        proxy.$modal.msgSuccess(form.value.id === undefined ?"新增成功":"修改成功");
        open.value = false;
        getList();
      });
    }
  });
}

init();
getList();
</script>
