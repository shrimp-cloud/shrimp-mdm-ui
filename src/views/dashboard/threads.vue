<template>
  <div class="app-container">
    <el-table :data="dataList" height="200" style="margin: 0px">
      <el-table-column label="线程ID" align="left" prop="threadId" width="80" :show-overflow-tooltip="true" />
      <el-table-column label="线程名" align="left" prop="threadName" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="线程状态" align="left" prop="threadState" width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="阻塞个数" align="left" prop="blockedCount" width="200" :show-overflow-tooltip="true"/>
    </el-table>
  </div>
</template>

<script setup name="DaskboardThreads">
const { proxy } = getCurrentInstance();
const dataList = ref([]);

const props = defineProps({
  data: {
    type: Array,
    default: null,
  },
});

const initFlag = ref(false);

watch(() => props.data, val => {
  if (initFlag.value) {
    init();
  }
}, {
  immediate: true
});

onMounted(() =>{
  initFlag.value = true;
  init();
})

function init() {
  if (!props.data || props.data.length === 0) {
    return;
  }
  dataList.value = props.data;
}

</script>
