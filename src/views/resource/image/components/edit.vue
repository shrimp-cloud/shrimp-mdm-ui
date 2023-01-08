<template>
  <el-dialog :title="title" v-model="open" width="600px" append-to-body draggable :close-on-click-modal="false">
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
         <image-upload :fileSize="1" :limit="1" busnessType="imglab" v-model:modelValue="form.imageUrl"/>
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

<script setup name="ImageLibraryEdit">
import {imageLibraryInfo, imageLibrarySave} from "@/api/image";

const { proxy } = getCurrentInstance();
const { IMAGE_TYPE } = proxy.useDict("IMAGE_TYPE");

defineExpose({handleEdit})
const emit = defineEmits(['change']);

const open = ref(false);
const loading = ref(false);
const title = ref("");
const form = ref({});
const rules = ref({
  imageType: [{ required: true, message: "图片类型不能为空", trigger: "blur" }],
  imageName: [{ required: true, message: "图片名称不能为空", trigger: "blur" }],
  imageUrl: [{ required: true, message: "图片不能为空", trigger: "blur" }]
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

// 新增/修改按钮操作
function handleEdit(row) {
  reset();
  if (!row || !row.id) {
    open.value = true;
    form.value.sort = 99;
    title.value = "新增";
  } else {
    imageLibraryInfo({id:row.id}).then(res => {
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
      imageLibrarySave(form.value).then(res => {
        proxy.$modal.msgSuccess(form.value.id === undefined ?"新增成功":"修改成功");
        open.value = false;
        emit("change", true);
      });
    }
  });
}

</script>
