<template>
   <div class="app-container">
     <el-row :gutter="20">
       <el-col :span="12">
         <el-card class="box-card el-card-define">
           <template #header>
             <div class="card-header">
               <span>字典项</span>
             </div>
           </template>
           <dict ref="dictRef" @select="selectDict"/>
         </el-card>
       </el-col>
       <el-col :span="12">
         <el-card class="box-card  el-card-define">
           <template #header>
             <div class="card-header">
               <span>{{ dictTitle }}</span>
             </div>
           </template>
           <item ref="itemRef"/>
         </el-card>
       </el-col>
     </el-row>
   </div>
</template>

<script setup name="SysDict">
import Dict from "./components/dict"
import Item from "./components/item"

const { proxy } = getCurrentInstance();
const dictTitle = ref('字典枚举: 请选择字典项');

function selectDict(row) {
  dictTitle.value = row ? '字典枚举: ' + row.dictType + ':' + row.description : '字典枚举: 请选择字典项';
  proxy.$refs["itemRef"].init(row);
}

</script>

<style>
.el-card-define {
  min-height: 100%;
  height: 100%;
}
.el-card-define > .el-card__body {
  height: 100%;
}
</style>