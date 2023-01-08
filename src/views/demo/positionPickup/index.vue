<template>
   <div class="app-container">
     <h1>位置获取</h1>
     <el-form :model="form" ref="mockRef" :rules="rules" label-width="120px">
       <el-form-item label="位置" prop="position">
         <position-pickup v-model:value="form.position" :zoom="12" @change="change"/>
       </el-form-item>
     </el-form>
   </div>
</template>
<script setup name="MockPositionPickup">
import PositionPickup from '@/components/AMap/positionPickup.vue';

const { proxy } = getCurrentInstance();
const form = ref({});
const rules = ref({
  position: [{ required: true, message: "位置不能为空", trigger: "blur" }],
});
function init() {
  form.value.position = '113.324596,23.106582';
}

function change(val) {
  form.value.longitude = val.longitude;
  form.value.latitude = val.latitude;
  form.value.position = form.value.longitude + ',' + form.value.latitude;
  console.log('change.form', form.value);
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
