<template>
   <div class="app-container">
     <el-dialog :title="title" v-model="open" width="600px" append-to-body>
       <el-form ref="editRefDict" :model="form" :rules="rule" label-width="80px">
         <el-form-item label="字典项" prop="dictType">
           <el-input v-model="form.dictType" disabled/>
         </el-form-item>
         <el-form-item label="字典值" prop="dictValue">
           <el-input v-model="form.dictValue" placeholder="请输入字典值" />
         </el-form-item>
         <el-form-item label="字典标签" prop="dictLabel">
           <el-input v-model="form.dictLabel" placeholder="请输入字典标签" />
         </el-form-item>
         <el-form-item label="样式" prop="elType">
           <el-select v-model="form.elType" placeholder="请选择样式" clearable style='width: 480px'>
             <el-option v-for="item in elTypeArr" :key="item.value" :label="item.label" :value="item.value">
               <template #>
                 <el-button :type="item.value" plain>{{item.label}}</el-button>
               </template>
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="描述" prop="description">
           <el-input v-model="form.description" placeholder="请输入描述" />
         </el-form-item>
         <el-form-item label="排序" prop="sort">
           <el-input v-model="form.sort" type="number" placeholder="请输入排序" />
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

<script setup name="SysDict">
import {consoleDictItemSave} from "@/api/dict";

defineExpose({handleEdit})
const { proxy } = getCurrentInstance();
const emit = defineEmits(['change']);

const open = ref(false);
const title = ref("");
const form = ref({});
const rule = ref({
  dictType: [{ required: true, message: "字典项不能为空", trigger: "blur" }],
  dictValue: [{ required: true, message: "字典值不能为空", trigger: "blur" }],
  dictLabel: [{ required: true, message: "字典标签不能为空", trigger: "blur" }],
});

const elTypeArr = ref([
  {value:'', label: 'default'},
  {value:'primary', label: 'primary'},
  {value:'success', label: 'success'},
  {value:'info', label: 'info'},
  {value:'warning', label: 'warning'},
  {value:'danger', label: 'danger'},
])

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
// 新增/修改按钮操作
function handleEdit(row) {
  reset();
  form.value = JSON.parse(JSON.stringify(row));
  if (!row || !row.id) {
    open.value = true;
    title.value = "添加";
  } else {
    open.value = true;
    title.value = "修改";
  }
}

function submitForm() {
  proxy.$refs["editRefDict"].validate(valid => {
    if (valid) {
      consoleDictItemSave(form.value).then(res => {
        if (res.code !== 1) {
          proxy.$modal.msgError("保存失败:" + res.msg);
        } else {
          proxy.$modal.msgSuccess(form.value.id === undefined ?"新增成功":"修改成功");
          open.value = false;
          emit("change", true);
        }
      });
    }
  });
}
</script>
