<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item prop="dictType">
          <el-input v-model="queryParams.dictType" placeholder="字典项" clearable style="width: 160px" @keyup.enter="handleQuery"/>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
           <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
         </el-form-item>
      </el-form>

     <el-row :gutter="12">
       <el-col :span="12">
         <el-table
             v-loading="loading"
             highlight-current-row
             height="680"
             @current-change="getSysDictList"
             :data="pageList">
           <el-table-column label="ID" align="center" prop="id" width="80"/>
           <el-table-column label="字典项" align="left" prop="dictType" width="200" :show-overflow-tooltip="true" />
           <el-table-column label="描述" align="left" prop="description" width="160" :show-overflow-tooltip="true" />
           <el-table-column label="枚举数" align="left" prop="count" width="80" :show-overflow-tooltip="true"/>
           <el-table-column label="操作" align="center" fixed='right' width="80" class-name="small-padding fixed-width">
             <template #default="scope">
               <el-button type="text" icon="Edit" @click="handleUpdate(scope.row)"/>
               <el-button type="text" icon="Delete" @click="handleDelete(scope.row)"/>
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
       </el-col>

       <!-- 枚举信息 -->
       <el-col :span="12" v-if="select.dictType">
         <el-row>
           <el-col :span="12">
             <p>字典：{{select.dictType}} : {{select.description}}</p>
           </el-col>
           <el-col :span="12" style="position: absolute; right: 0;">
             <el-button type="primary" plain icon="Plus" @click="handleAddDict">添加属性</el-button>
           </el-col>
         </el-row>
         <el-table v-loading="loading" height="630" :data="dictList">
           <el-table-column label="字典键" align="left" prop="dictKey" width="200" :show-overflow-tooltip="true" />
           <el-table-column label="字典值" align="left" prop="dictValue" width="200" :show-overflow-tooltip="true"/>
           <el-table-column label="描述" align="left" prop="description" width="120" :show-overflow-tooltip="true"/>
           <el-table-column label="排序" align="left" prop="sort" width="80" :show-overflow-tooltip="true"/>
           <el-table-column label="操作" align="center" fixed='right' width="80" class-name="small-padding fixed-width">
             <template #default="scope">
               <el-button type="text" icon="Edit" @click="handleUpdateDict(scope.row)"/>
               <el-button type="text" icon="Delete" @click="handleDeleteDict(scope.row)"/>
             </template>
           </el-table-column>
         </el-table>
       </el-col>
     </el-row>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form ref="editRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="字典项" prop="dictType">
               <el-input v-model="form.dictType"/>
            </el-form-item>
            <el-form-item label="描述" prop="description">
               <el-input v-model="form.description" placeholder="请输入描述" />
            </el-form-item>
           <el-form-item label="备注" prop="comments">
             <el-input v-model="form.comments" placeholder="请输入备注" />
           </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>

     <el-dialog :title="titleDict" v-model="openDict" width="600px" append-to-body>
       <el-form ref="editRefDict" :model="formDict" :rules="rulesDict" label-width="80px">
         <el-form-item label="字典项" prop="dictType">
           <el-input disabled v-model="formDict.dictType"/>
         </el-form-item>
         <el-form-item label="字典键" prop="dictKey">
           <el-input v-model="formDict.dictKey" placeholder="请输入字典键" />
         </el-form-item>
         <el-form-item label="字典值" prop="dictValue">
           <el-input v-model="formDict.dictValue" placeholder="请输入字典值" />
         </el-form-item>
         <el-form-item label="描述" prop="description">
           <el-input v-model="formDict.description" placeholder="请输入描述" />
         </el-form-item>
         <el-form-item label="排序" prop="sort">
           <el-input v-model="formDict.sort" type="number" placeholder="请输入排序" />
         </el-form-item>
       </el-form>
       <template #footer>
         <div class="dialog-footer">
           <el-button type="primary" @click="submitFormDict">确 定</el-button>
           <el-button @click="cancelDict">取 消</el-button>
         </div>
       </template>
     </el-dialog>
   </div>
</template>

<script setup name="SysDict">
import {
  consoleDictTypePage,
  consoleDictTypeSave,
  consoleDictTypeRemove,
  consoleDictList,
  consoleDictSave,
  consoleDictRemove
} from "@/api/sys";

const { proxy } = getCurrentInstance();

const pageList = ref([]);
const dictList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const title = ref("");

const openDict = ref(false);
const titleDict = ref("");

const data = reactive({
  select: {},
  form: {},
  formDict: {},
  queryParams: {
    pageNo: 1,
    pageSize: 20,
    dictType: undefined,
  },
  rules: {
    dictType: [{ required: true, message: "字典项不能为空", trigger: "blur" }],
    description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
  },
  rulesDict: {
    dictKey: [{ required: true, message: "字典键不能为空", trigger: "blur" }],
    dictValue: [{ required: true, message: "字典值不能为空", trigger: "blur" }],
  }
});
const { select, form, formDict, queryParams, rules, rulesDict } = toRefs(data);

function init() {
  queryParams.value.pageNo = 1;
}

/** 查询参数列表 */
function getList() {
  loading.value = true;
  consoleDictTypePage(queryParams.value).then(res => {
    const data = res.data;
    pageList.value = data.rows;
    total.value = data.totalCount;

    // 清除选中
    dictList.value = [];
    select.value = {};
  }).finally(() => {
    loading.value = false;
  });
}

function getSysDictList(row) {
  if (!row) {
    return;
  }
  loading.value = true;
  select.value.dictType = row.dictType ? row.dictType: select.value.dictType;
  select.value.description = row.description ? row.description: select.value.description;
  consoleDictList({dictType: row.dictType}).then(res => {
    dictList.value = res.data;
  }).finally(() => {
    loading.value = false;
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}
function cancelDict() {
  openDict.value = false;
  resetDict();
}

/** 表单重置 */
function reset() {
  form.value = {};
  proxy.resetForm("editRef");
}
function resetDict() {
  formDict.value = {
    dictType: select.value.dictType,
  };
  proxy.resetForm("editRefDict");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1;
  getList();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备";
}
function handleAddDict() {
  resetDict();
  openDict.value = true;
  titleDict.value = "添加属性";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  form.value = row;
  open.value = true;
  title.value = "修改设备";
}

function handleUpdateDict(row) {
  resetDict();
  formDict.value = row;
  openDict.value = true;
  titleDict.value = "修改属性";
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      consoleDictTypeSave(form.value).then(res => {
        if (res.code !== 1) {
          proxy.$modal.msgError("保存失败:" + res.msg);
        } else {
          proxy.$modal.msgSuccess(form.value.id === undefined ?"新增成功":"修改成功");
          open.value = false;
          getList();
        }
      });
    }
  });
}
function submitFormDict() {
  proxy.$refs["editRefDict"].validate(valid => {
    if (valid) {
      consoleDictSave(formDict.value).then(res => {
        if (res.code !== 1) {
          proxy.$modal.msgError("保存失败:" + res.msg);
        } else {
          proxy.$modal.msgSuccess(formDict.value.id === undefined ?"新增成功":"修改成功");
          openDict.value = false;
          getSysDictList({dictType: formDict.value.dictType});
        }
      });
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idsMsg = row.id;
  proxy.$modal.confirm('是否确认删除参数编号为"' + idsMsg + '"的数据项？').then(() => {
    const param = {
      id: row.id,
    }
    consoleDictTypeRemove(param).then(res => {
      if (res.code === 1) {
        getList();
        proxy.$modal.msgSuccess("删除成功");
      } else {
        proxy.$modal.msgError('删除失败: ' + res.msg);
      }
    })
  }).catch(() => {});
}

function handleDeleteDict(row) {
  const idsMsg = row.id;
  proxy.$modal.confirm('是否确认删除参数编号为"' + idsMsg + '"的数据项？').then(() => {
    const param = {
      id: row.id,
    }
    consoleDictRemove(param).then(res => {
      if (res.code === 1) {
        getSysDictList({dictType: row.dictType});
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
