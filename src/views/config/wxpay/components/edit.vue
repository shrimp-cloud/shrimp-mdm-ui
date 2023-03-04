<template>
  <el-dialog :title="title" v-model="open" width="1080px" append-to-body draggable :close-on-click-modal="false">
    <el-form ref="editRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="租户编码" prop="tenantCode">
            <el-input v-model="form.tenantCode" placeholder="请输入 租户编码" />
          </el-form-item>
          <el-form-item label="应用ID" prop="appId">
            <el-input v-model="form.appId" placeholder="请输入 应用ID" />
          </el-form-item>
          <el-form-item label="商户ID" prop="mchId">
            <el-input v-model="form.mchId" placeholder="请输入 商户ID" />
          </el-form-item>
          <el-form-item label="沙箱环境" prop="useSandboxEnv">
            <el-select v-model="form.useSandboxEnv" placeholder="沙箱环境" clearable style='width: 600px'>
              <el-option v-for="dict in BOOLEAN" :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="同步通知" prop="returnUrl">
            <el-input v-model="form.returnUrl" placeholder="请输入 同步通知页面路径" />
          </el-form-item>
          <el-form-item label="异步通知地址" prop="notifyUrl">
            <el-input v-model="form.notifyUrl" placeholder="请输入 异步通知地址" />
          </el-form-item>
          <el-form-item label="退款回调地址" prop="refundNotifyUrl">
            <el-input v-model="form.refundNotifyUrl" placeholder="请输入 退款回调地址" />
          </el-form-item>
          <el-form-item label="验证签名" prop="verifySign">
            <el-input v-model="form.verifySign" placeholder="请输入 验证签名" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="商户密钥" prop="mchKey">
        <el-input v-model="form.mchKey" type="textarea" rows="2" placeholder="请输入 商户密钥" />
      </el-form-item>
      <el-form-item label="证书Key" prop="privateKey">
        <el-input v-model="form.privateKey" type="textarea" rows="2" placeholder="请输入 证书Key" />
      </el-form-item>
      <el-form-item label="证书Cert" prop="privateCert">
        <el-input v-model="form.privateCert" type="textarea" rows="2" placeholder="请输入 证书Cert" />
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

<script setup name="WxpayConfigEdit">
import {wxpayConfigInfo, wxpayConfigCreate, wxpayConfigUpdate} from "@/api/wxpay";

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const { BOOLEAN } = proxy.useDict("BOOLEAN");
const open = ref(false);
const title = ref("");

const form = ref({});
const rules = ref({
  appId: [{ required: true, message: "应用ID 不能为空", trigger: "blur" }],
  mchId: [{ required: true, message: "商户ID 不能为空", trigger: "blur" }],
  tenantCode: [{ required: true, message: "租户编码 不能为空", trigger: "blur" }],
  useSandboxEnv: [{ required: true, message: "沙箱环境标识 不能为空", trigger: "blur" }],

  notifyUrl: [{ required: true, message: "通知路径 不能为空", trigger: "blur" }],
  returnUrl: [{ required: true, message: "页面跳转路径 不能为空", trigger: "blur" }],
  refundNotifyUrl: [{ required: true, message: "退款回调地址 不能为空", trigger: "blur" }],

  mchKey: [{ required: true, message: "商户密钥 不能为空", trigger: "blur" }],
  privateKey: [{ required: true, message: "证书Key 不能为空", trigger: "blur" }],
  privateCert: [{ required: true, message: "证书Cert 不能为空", trigger: "blur" }],
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
    wxpayConfigInfo({id:row.id}).then(res => {
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
      if (form.value.id) {
        wxpayConfigUpdate(form.value).then(res => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emit("change", true);
        });
      } else {
        wxpayConfigCreate(form.value).then(res => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emit("change", true);
        });
      }
    }
  });
}
</script>
