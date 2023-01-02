<template>
  <div class="app-container">
    <el-table :data="dataList" height="200" style="margin: 0px">
      <el-table-column label="属性名" align="left" prop="name" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="属性值" align="left" prop="value" width="400" :show-overflow-tooltip="true" />
    </el-table>
  </div>
</template>

<script setup name="DaskboardSystemProperties">
const dataList = ref([]);

const props = defineProps({
  data: {
    type: Object,
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
  dataList.value = [];
  const keys = Object.keys(props.data);
  for (let i = 0; i < keys.length; i++) {
    const row = {};
    row.name = keys[i];
    row.value = props.data[row.name];
    dataList.value.push(row);
  }
}

</script>
