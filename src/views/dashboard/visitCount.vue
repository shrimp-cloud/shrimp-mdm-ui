<template>
  <div id="echartsVisit" :style="{width: '400px', height: '160px'}"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { consoleDashboardWeekVisitCount } from '@/api/monitor';

onMounted(() =>{
  consoleDashboardWeekVisitCount({}).then(res => {
    const datas = res.data;
    const x = [];
    const y = [];
    for (const data of datas) {
      x.push(data.createTime.substr(5, 5));
      y.push(data.count);
    }
    var echartsVisitDom = document.getElementById('echartsVisit');
    var myChart = echarts.init(echartsVisitDom);
    var option = {
      xAxis: { type: 'category', data: x, name: '日期', },
      yAxis: { type: 'value', name: '访问量',},
      series: [
        { data: y, type: 'line', smooth: true}
      ]
    };
    option && myChart.setOption(option);
  });
})
</script>
