<template>
  <div id="echartsJvmMemory" :style="{width: '180px', height: '160px'}"></div>
</template>

<script setup>
import * as echarts from 'echarts';

const props = defineProps({
  mems: {
    type: Number,
    default: 268435456,
  },
  usage: {
    type: Number,
    default: 0,
  },
});
const initFlag = ref(false);
let myChart = undefined;

watch(() => props.usage, val => {
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
    myChart.setOption({
      series: [
        {
          max: props.mems / 1048576,
          data: [
            {
              value: Math.ceil(props.usage / 1048576)
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
  var echartsJvmMemoryDom = document.getElementById('echartsJvmMemory');
  myChart = echarts.init(echartsJvmMemoryDom);
  var option = {
    series: [
      {
        name: '内存使用率',
        type: 'gauge', // 仪表盘
        max: props.mems / 1048576,
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
          formatter: '{value} MB',
          fontSize: 20
        },
        data: [
          {
            value: Math.ceil(props.usage / 1048576)
          },
        ]
      }
    ]
  };
  option && myChart.setOption(option);
}

</script>
