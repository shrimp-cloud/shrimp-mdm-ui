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
          <el-form-item label="签名方式" prop="signType">
            <el-select v-model="form.signType" placeholder="签名方式" clearable style='width: 660px'>
              <el-option key="RSA2" label="RSA2" value="RSA2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="字符编码" prop="charset">
            <el-select v-model="form.charset" placeholder="字符编码" clearable style='width: 660px'>
              <el-option key="UTF-8" label="UTF-8" value="UTF-8"/>
              <el-option key="GBK" label="GBK" value="GBK"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="页面跳转路径" prop="returnUrl">
            <el-input v-model="form.returnUrl" placeholder="请输入 页面跳转同步通知页面路径" />
          </el-form-item>
          <el-form-item label="支付宝网关" prop="gatewayUrl">
            <el-input v-model="form.gatewayUrl" placeholder="请输入 支付宝网关" />
          </el-form-item>
          <el-form-item label="通知路径" prop="notifyUrl">
            <el-input v-model="form.notifyUrl" placeholder="请输入 服务器异步通知路径" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="支付宝公钥" prop="alipayPublicKey">
        <el-input v-model="form.alipayPublicKey" type="textarea" rows="4" placeholder="请输入 支付宝公钥" />
      </el-form-item>
      <el-form-item label="应用公钥" prop="appPublicKey">
        <el-input v-model="form.appPublicKey" type="textarea" rows="4" placeholder="请输入 应用公钥" />
      </el-form-item>
      <el-form-item label="商户私钥" prop="merchantPrivateKey">
        <el-input v-model="form.merchantPrivateKey" type="textarea" rows="4" placeholder="请输入 商户私钥" />
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

<script setup name="AlipayConfigEdit">
import {alipayConfigInfo, alipayConfigCreate, alipayConfigUpdate} from "@/api/alipay";

defineExpose({handleEdit})
const emit = defineEmits(['change']);
const { proxy } = getCurrentInstance();
const { BOOLEAN } = proxy.useDict("BOOLEAN");
const open = ref(false);
const title = ref("");

const form = ref({});
const rules = ref({
  appId: [{ required: true, message: "应用ID 不能为空", trigger: "blur" }],
  tenantCode: [{ required: true, message: "租户编码 不能为空", trigger: "blur" }],
  merchantPrivateKey: [{ required: true, message: "商户私钥 不能为空", trigger: "blur" }],
  alipayPublicKey: [{ required: true, message: "支付宝公钥 不能为空", trigger: "blur" }],
  appPublicKey: [{ required: true, message: "应用公钥 不能为空", trigger: "blur" }],
  notifyUrl: [{ required: true, message: "通知路径 不能为空", trigger: "blur" }],
  returnUrl: [{ required: true, message: "页面跳转路径 不能为空", trigger: "blur" }],
  signType: [{ required: true, message: "签名方式 不能为空", trigger: "blur" }],
  charset: [{ required: true, message: "编码 不能为空", trigger: "blur" }],
  gatewayUrl: [{ required: true, message: "支付宝网关 不能为空", trigger: "blur" }],
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
    alipayConfigInfo({id:row.id}).then(res => {
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
        alipayConfigUpdate(form.value).then(res => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          emit("change", true);
        });
      } else {
        alipayConfigCreate(form.value).then(res => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          emit("change", true);
        });
      }
    }
  });
}
</script>
