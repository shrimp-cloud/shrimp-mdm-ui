<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable :close-on-click-modal="false">
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
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="SysConfigEdit">
import {consoleSysConfigInfo, consoleSysConfigSave} from "@/api/sysConfig";

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const { BOOLEAN } = proxy.useDict("BOOLEAN");
const open = ref(false);
const title = ref("");

const form = ref({});
const rules = ref({
  sysKey: [{ required: true, message: "参数键名不能为空", trigger: "blur" }],
  sysValue: [{ required: true, message: "参数键值不能为空", trigger: "blur" }]
});

/** 表单重置 */
function reset() {
  form.value = {};
  proxy.resetForm("editRef");
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

// 新增/修改按钮操作
function handleEdit(row) {
  reset();
  if (!row || !row.id) {
    open.value = true;
    title.value = "添加";
  } else {
    consoleSysConfigInfo({id:row.id}).then(res => {
      form.value = res.data;
      open.value = true;
      title.value = "修改";
    });
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["editRef"].validate(valid => {
    if (valid) {
      consoleSysConfigSave(form.value).then(res => {
        proxy.$modal.msgSuccess(form.value.id === undefined ?"新增成功":"修改成功");
        open.value = false;
        emit("change", true);
      });
    }
  });
}
</script>
