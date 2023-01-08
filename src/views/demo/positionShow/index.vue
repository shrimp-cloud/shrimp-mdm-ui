<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item prop="longitude">
          <el-input type="number" v-model="queryParams.longitude" placeholder="经度" clearable style="width: 200px"/>
        </el-form-item>
        <el-form-item prop="latitude">
          <el-input type="number" v-model="queryParams.latitude" placeholder="纬度" clearable style="width: 200px"/>
        </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="getMap">展示位置</el-button>
         </el-form-item>
      </el-form>

     <el-dialog :title="title" v-model="open" width="840px" append-to-body draggable :close-on-click-modal="false">
       <position-show :longitude="queryParams.longitude" :latitude="queryParams.latitude" :zoom="12"/>
     </el-dialog>
   </div>
</template>

<script setup name="MockPositionShow">
import PositionShow from '@/components/AMap/positionShow.vue';

const { proxy } = getCurrentInstance();

const open = ref(false);
const title = ref("");

const queryParams = ref({
  longitude: undefined,
  latitude: undefined,
});
function init() {
  queryParams.value.longitude = 113.324614;
  queryParams.value.latitude = 23.106578;
}
function getMap(row) {
  open.value = true;
  title.value = "位置";
}

init();
</script>
