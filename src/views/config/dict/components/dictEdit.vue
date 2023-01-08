<template>
    <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable :close-on-click-modal="false">
       <el-form ref="editRef" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="字典类型" prop="dictType">
             <el-input v-model="form.dictType" placeholder="请填写字典类型，英文大写和下划线" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
             <el-input v-model="form.description" placeholder="请输入描述" />
          </el-form-item>
         <el-form-item label="备注" prop="remark">
           <el-input v-model="form.remark" placeholder="请输入备注" />
         </el-form-item>
       </el-form>
       <template #footer>
          <div class="dialog-footer">
             <el-button type="primary" @click="submitForm">确 定</el-button>
             <el-button @click="cancel">取 消</el-button>
          </div>
       </template>
    </el-dialog>
</template>

<script setup name="DictEdit">
import {consoleDictSave} from "@/api/dict";

defineExpose({handleEdit});
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const open = ref(false);
const title = ref("");
const form = ref({});
const rules = ref({
  dictType: [{ required: true, message: "字典项不能为空", trigger: "blur" }],
  description: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});

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

function handleEdit(row) {
  reset();
  if (!row || !row.id) {
    open.value = true;
    title.value = "添加字典";
  } else {
    form.value = JSON.parse(JSON.stringify(row));
    open.value = true;
    title.value = "修改字典";
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      consoleDictSave(form.value).then(res => {
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
