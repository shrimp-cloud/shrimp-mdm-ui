<template>
  <div class="app-container">
    <h1>区域选择</h1>
    <el-form :model="form" ref="mockRef" :rules="rules" label-width="120px">
      <el-form-item label="区域" prop="area">
        <address-pickup v-model:value="form.area" :level="4" @change="changeArea"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup name="MockAdressPickup">
import AddressPickup from '@/views/components/AddressPickup';

const { proxy } = getCurrentInstance();
const form = ref({});
const rules = ref({
  area: [{ required: true, message: "区域不能为空", trigger: "blur" }],
});

function init() {
  form.value.area = 450330101;
}

function changeArea(val) {
  console.log('changeArea', val);
}

function submitForm() {
  proxy.$refs["mockRef"].validate(valid => {
    if (valid) {
      console.log('submitForm.form', form.value);
    }
  });
}

init();
</script>
