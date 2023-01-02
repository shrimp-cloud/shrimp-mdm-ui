
<template>
  <div ref="chartRef" class="chart" :style="{width: '400px', height: '160px'}"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";
// 通过ref获得DOM
let chartRef = ref();
let myChart;
onUnmounted(() => {
  myChart.dispose();
  myChart = null;
});
onMounted(() => {
  myChart = echarts.init(chartRef.value);
  const option = {
    tooltip: {
      trigger: "item",
    },
    color: ["#ffd666", "#ffa39e", "#409EFF"],
    // 饼图数据配置
    series: [
      {
        name: "用户占比",
        type: "pie",
        radius: "70%",
        data: [
          { value: 43340, name: "PC 端" },
          { value: 7003, name: "手机端" },
          { value: 4314, name: "平板" },
        ],
      },
    ],
  };
  myChart.setOption(option);
});
</script>
