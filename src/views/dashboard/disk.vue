<template>
  <div id="echartsDisk" :style="{width: '180px', height: '160px'}"></div>
</template>

<script setup>
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    default: null,
  }
});

const initFlag = ref(false);
let myChart = undefined;

watch(() => props.data, val => {
  if (initFlag.value) {
    setData();
  }
}, {
  immediate: true
});

onMounted(() =>{
  initFlag.value = true;
  setData();
})

function setData() {
  if (!myChart) {
    init();
  } else {
    let maxDisk = {};
    for(let i = 0; i < props.data.length; i++) {
      const d = props.data[i];
      if (!maxDisk.totalSpace || maxDisk.totalSpace < d.totalSpace) {
        maxDisk = d;
      }
    }
    const total = (maxDisk.totalSpace / (1024 * 1024 * 1024)).toFixed(2);
    const used = (maxDisk.usedSpace / (1024 * 1024 * 1024)).toFixed(2);

    myChart.setOption({
      series: [
        {
          max: total,
          data: [
            {
              value: used
            }
          ]
        }
      ]
    });
  }
}

function init() {
  if (myChart) {
    return;
  }
  let maxDisk = {};
  for(let i = 0; i < props.data.length; i++) {
    const d = props.data[i];
    if (!maxDisk.totalSpace || maxDisk.totalSpace < d.totalSpace) {
      maxDisk = d;
    }
  }
  const total = (maxDisk.totalSpace / (1024 * 1024 * 1024)).toFixed(2);
  const used = (maxDisk.usedSpace / (1024 * 1024 * 1024)).toFixed(2);

  var echartsDiskDom = document.getElementById('echartsDisk');
  myChart = echarts.init(echartsDiskDom);
  var option = {
    series: [
      {
        name: '磁盘使用率',
        type: 'gauge', // 仪表盘
        max: total,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#67e0e3'],
              [0.7, '#37a2da'],
              [1, '#fd666d']
            ]
          }
        },
        pointer: {
          length: 48,
          itemStyle: {
            color: 'inherit'
          }
        },
        axisTick: {
          distance: -6,
          length: 6,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        splitLine: {
          distance: 20,
          length: 3,
          lineStyle: {
            color: '#fff',
            width: 4
          }
        },
        axisLabel: {
          color: 'inherit',
          distance: -40,
          fontSize: 8
        },
        detail: {
          color: 'inherit',
          valueAnimation: true,
          formatter: '{value} GB',
          fontSize: 20
        },
        data: [
          {
            value: used
          },
        ]
      }
    ]
  };
  option && myChart.setOption(option);
}

</script>
