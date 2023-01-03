<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item prop="tenantId">
          <tenantDialog v-model:value="queryParams.tenantId"/>
        </el-form-item>
         <el-form-item prop="uri">
            <el-input v-model="queryParams.uri" placeholder="请求URI" clearable style="width: 160px;" @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item prop="ip">
            <el-input v-model="queryParams.ip" placeholder="来源IP" clearable style="width: 140px;" @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item>
            <el-date-picker v-model="dateRange" style='width: 380px' value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"/>
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-table
          v-loading="loading"
          :data="pageList"
          :row-style="{height: '10px'}"
          :cell-style="{padding: '0px'}">
         <el-table-column label="编号" align="center" prop="id" width="70"/>
         <el-table-column label="时间" align="center" prop="createTime" width="160">
           <template #default="scope"><span>{{ parseTime(scope.row.createTime) }}</span></template>
         </el-table-column>
         <el-table-column label="租户ID" align="center" prop="tenantId" width="80"/>
         <el-table-column label="鉴权ID" align="center" prop="authId" width="80"/>
         <el-table-column label="用户ID" align="center" prop="userId" width="80"/>
         <el-table-column label="昵称" align="center" prop="nickName" width="80"/>
         <el-table-column label="用户IP" align="center" prop="remoteAddr" width="130"/>
         <el-table-column label="运营商" align="center" prop="isp" width="70"/>
         <el-table-column label="位置" align="center" prop="location" width="150"/>
         <el-table-column label="用户系统" align="center" prop="userOs" width="80" :show-overflow-tooltip="true"/>
         <el-table-column label="用户平台" align="center" prop="platform" width="90"/>
         <el-table-column label="请求源" align="center" prop="origin" width="100" :show-overflow-tooltip="true"/>
         <el-table-column label="页面引用" align="center" prop="referer" width="100" :show-overflow-tooltip="true"/>
         <el-table-column label="方法" align="center" prop="method" width="70"/>
         <el-table-column label="URI" align="left" prop="requestUri" width="300" :show-overflow-tooltip="true"/>
         <el-table-column label="URL" align="center" prop="requestUrl" width="80" :show-overflow-tooltip="true"/>
         <el-table-column label="协议" align="center" prop="httpProtocol" width="80" :show-overflow-tooltip="true"/>

        <el-table-column label="accept" align="center" prop="accept" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="接收编码" align="center" prop="acceptEncoding" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="接收语言" align="center" prop="acceptLanguage" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="浏览器" align="center" prop="browserName" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="浏览器版本" align="center" prop="browserVersion" width="100" :show-overflow-tooltip="true"/>
        <el-table-column label="编码" align="center" prop="characterEncoding" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="连接状态" align="center" prop="connection" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="引擎" align="center" prop="engineName" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="引擎版本" align="center" prop="engineVersion" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="后端域名" align="center" prop="serverName" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="token" align="center" prop="token" width="80" :show-overflow-tooltip="true"/>
        <el-table-column label="UA" align="center" prop="userAgent" width="80" :show-overflow-tooltip="true"/>
      </el-table>
      <pagination
         v-show="total > 0"
         :total="total"
         v-model:page="queryParams.pageNo"
         v-model:limit="queryParams.pageSize"
         @pagination="getList"
      />
   </div>
</template>

<script setup name="AccessLog">
import TenantDialog from '@/views/components/TenantDialog/index.vue';
import { parseTime } from '@/utils/ruoyi';
import { consoleAccessLogPage } from "@/api/sys";

const { proxy } = getCurrentInstance();

const pageList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref([]);

// 查询参数
const queryParams = ref({
  pageNo: 1,
  pageSize: 20,
  tenantId: undefined,
  uri: undefined,
  ip: undefined
});

function init() {
  const now = new Date();
  dateRange.value = [
    parseTime(now.setDate(now.getDate()-7), '{y}-{m}-{d}') + ' 00:00:00',
    parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59'
  ];
  queryParams.value.pageNo = 1;
}

/** 查询登录日志列表 */
function getList() {
  loading.value = true;
  consoleAccessLogPage(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    const data = res.data;
    pageList.value = data.rows;
    total.value = data.totalCount;
  }).finally(() => {
    loading.value = false;
  });
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNo = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  init();
}

init();
getList();
</script>
