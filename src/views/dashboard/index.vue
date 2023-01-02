<template>
  <div class="app-container home">
    <blockquote class="text-warning" style="font-size: 14px">
      系统控制台上线啦！,广而告之,广而告之
    </blockquote>
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>CPU使用率</span>
            </div>
          </template>
          <div class="body">
            <cpu :cpus="operatingSystem.availableProcessors" :usage="operatingSystem.systemLoadAverage"/>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>服务器内存使用率</span>
            </div>
          </template>
          <div class="body">
            <server-memory :total="operatingSystem.totalMemorySize" :free="operatingSystem.freeMemorySize"/>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>JVM内存使用率</span>
            </div>
          </template>
          <div class="body">
            <jvm-memory :mems="heapMemoryUsage.init" :usage="heapMemoryUsage.used"/>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>磁盘使用率</span>
            </div>
          </template>
          <div class="body">
            <disk :data="disks"/>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>周访问趋势</span>
            </div>
          </template>
          <div class="body">
            <visit-count/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <div class="body" style="display: flex">
            <el-icon style="color: red; margin-right: 20px" size="60px"><user /></el-icon>
            <div>
              <div style="font-size: 16px; color: deepskyblue">用户数</div>
              <div style="font-size: 32px">2000</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <div class="body" style="display: flex">
            <el-icon style="color: red; margin-right: 20px" size="60px"><user /></el-icon>
            <div>
              <div style="font-size: 16px; color: deepskyblue">用户数</div>
              <div style="font-size: 32px">2000</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <div class="body" style="display: flex">
            <el-icon style="color: red; margin-right: 20px" size="60px"><user /></el-icon>
            <div>
              <div style="font-size: 16px; color: deepskyblue">用户数</div>
              <div style="font-size: 32px">2000</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <div class="body" style="display: flex">
            <el-icon style="color: red; margin-right: 20px" size="60px"><user /></el-icon>
            <div>
              <div style="font-size: 16px; color: deepskyblue">用户数</div>
              <div style="font-size: 32px">2000</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <div class="body" style="display: flex">
            <el-icon style="color: red; margin-right: 20px" size="60px"><user /></el-icon>
            <div>
              <div style="font-size: 16px; color: deepskyblue">用户数</div>
              <div style="font-size: 32px">2000</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="4">
        <el-card class="update-log">
          <div class="body" style="display: flex">
            <el-icon style="color: red; margin-right: 20px" size="60px"><user /></el-icon>
            <div>
              <div style="font-size: 16px; color: deepskyblue">用户数</div>
              <div style="font-size: 32px">2000</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>多个echart测试</span>
            </div>
          </template>
          <div class="body">
            <echart-pie />
          </div>
        </el-card>
      </el-col>
      -->
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>应用线程</span>
            </div>
          </template>
          <div class="body">
            <threads :data="threadInfos"/>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>系统属性</span>
            </div>
          </template>
          <div class="body">
            <system-properties :data="properties"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">
import { consoleServerState } from '@/api/monitor';

import Cpu from './cpu';
import JvmMemory from './jvmMemory';
import ServerMemory from './serverMemory';
import Disk from './disk';
import Threads from './threads';
import SystemProperties from './systemProperties';
import VisitCount from  './visitCount';

import EchartPie from  '@/components/EchartPie';
import * as echarts from "echarts";

const version = ref('3.8.1')
const router = useRouter();
const initFlag = ref(false);

const operatingSystem = ref({});
const heapMemoryUsage = ref({});
const properties = ref({});
const threadInfos = ref([]);
const disks = ref([]);

onMounted(() =>{
  getServerState();
  initFlag.value = true;
})

function getServerState() {
  // 只有用户停留在首页时才实时更新数据
  let path = router?.currentRoute?._value?.fullPath;
  if (path !== '/index') {
    return;
  }
  consoleServerState().then(res => {
    const data = res.data;
    operatingSystem.value = data.operatingSystem;
    heapMemoryUsage.value = data.memory.heapMemoryUsage;
    threadInfos.value = data.thread.threadInfos;
    disks.value = data.disks;
    properties.value = data.runtime.systemProperties
  })
}

setInterval(() => {
  if (initFlag) {
    getServerState();
  }
}, 1000);
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

