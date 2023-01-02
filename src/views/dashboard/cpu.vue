<template>
  <div id="echartsCpu" :style="{width: '180px', height: '160px'}"></div>
</template>

<script setup>
import * as echarts from 'echarts';

const props = defineProps({
  cpus: {
    type: Number,
    default: 1,
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
          max: props.cpus * 100,
          data: [
            {
              value: props.usage * 100
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
  var echartsCpuDom = document.getElementById('echartsCpu');
  myChart = echarts.init(echartsCpuDom);
  var option = {
    series: [
      {
        name: 'CPU使用率',
        type: 'gauge', // 仪表盘
        max: props.cpus * 100,
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
          formatter: '{value}%',
          fontSize: 20
        },
        data: [
          {
            value: props.usage * 100
          },
        ]
      }
    ]
  };
  option && myChart.setOption(option, true);
}
</script>
