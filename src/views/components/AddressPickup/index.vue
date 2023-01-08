<template>
  <el-select v-if="level >= 1" v-model="area.provinceCode" clearable placeholder="----省----" @change="choseAddress" @clear="clear(1)" style="width: 150px">
    <el-option v-for="item in select.province" :key="item.areaCode" :label="item.name" :value="item.areaCode" />
  </el-select>
  <span v-if="level > 1">-</span>
  <el-select v-if="level >= 2" v-model="area.cityCode" clearable placeholder="----市----" @change="choseAddress" @clear="clear(2)" style="width: 150px">
    <el-option v-for="item in select.city" :key="item.areaCode" :label="item.name" :value="item.areaCode" />
  </el-select>
  <span v-if="level > 2">-</span>
  <el-select v-if="level >= 3" v-model="area.countyCode" clearable placeholder="----区/县----" @change="choseAddress" @clear="clear(3)" style="width: 150px">
    <el-option v-for="item in select.county" :key="item.areaCode" :label="item.name" :value="item.areaCode" />
  </el-select>
  <span v-if="level > 3">-</span>
  <el-select v-if="level >= 4" v-model="area.townCode" clearable placeholder="----乡/镇----" @change="choseAddress" @clear="clear(4)" style="width: 150px">
    <el-option v-for="item in select.town" :key="item.areaCode" :label="item.name" :value="item.areaCode" />
  </el-select>
</template>

<script setup name="AddressPickup">
import { commonAreaChoice } from "@/api/sys";

const emit = defineEmits(['change']);

const props = defineProps({
  value: [Number],
  level: {
    type: Number,
    default: 4,
  }
});

const data = reactive({
  level: undefined,
  select: {
    province:[],
    city:[],
    county:[],
    town:[],
  },
  area: {
    provinceCode: undefined,
    provinceName: undefined,
    cityCode: undefined,
    cityName: undefined,
    countyCode: undefined,
    countyName: undefined,
    townCode: undefined,
    townName: undefined,
    fullCode: undefined,
    fullName: undefined,
    fullLevel: 4,
    selectLevel: 4,
  },
});
const {level, select, area } = toRefs(data);

watch(() => props.value, val => {
  init();
}, {
  immediate: true
});

function init() {
  level.value = props.level;
  area.value.fullLevel = props.level;
  const value = props.value ? props.value + '' : '';
  let param = '0,'; // 0 用于标识 根节点
  if (value.length >= 2 && props.level >= 1) {
    area.value.provinceCode = Number(value.substring(0,2));
    param += area.value.provinceCode + ","
  }
  if (value.length >= 4 && props.level >= 2) {
    area.value.cityCode = Number(value.substring(0,4));
    param += area.value.cityCode + ","
  }
  if (value.length >= 6 && props.level >= 3) {
    area.value.countyCode = Number(value.substring(0,6));
    param += area.value.countyCode + ","
  }
  if (value.length >= 9 && props.level >= 4) {
    area.value.townCode = Number(value.substring(0,9));
  }
  param = param.substring(0, param.length -1);
  getSelect(param);
};

function choseAddress(val) {
  if (!val) {
    return;
  }
  const lth = (val + '').length;
  if (lth <= 2) {
    select.value.city = [];
    area.value.cityCode = undefined;
  }
  if (lth <= 4) {
    select.value.county = [];
    area.value.countyCode = undefined;
  }
  if (lth <= 6) {
    select.value.town = [];
    area.value.townCode = undefined;
  }
  if (lth <= 9) {
    // do nothing
  }
  change();
  if (lth < 9) {
    getSelect(val);
  }
}

function getSelect(param) {
  commonAreaChoice({parentAreaCodes:param}).then(res => {
    if (res.code !== 1) {
      proxy.$modal.msgError("获取位置信息失败:" + res.msg);
      return;
    }
    if (res.data.province) {
      select.value.province = res.data.province;
      select.value.city = [];
      select.value.county = [];
      select.value.town = [];
    }
    if (res.data.city) {
      select.value.city = res.data.city;
      select.value.county = [];
      select.value.town = [];
    }
    if (res.data.county) {
      select.value.county = res.data.county;
      select.value.town = [];
    }
    if (res.data.town) {
      select.value.town = res.data.town;
    }
  })
}

function clear(level) {
  if (!level) {
    return;
  }
  // 清空省
  if (level === 1) {
    select.value.city = [];
    select.value.county = [];
    select.value.town = [];
    area.value.provinceCode = undefined;
    area.value.cityCode = undefined;
    area.value.countyCode = undefined;
    area.value.townCode = undefined;
  }
  // 清空市
  if (level === 2) {
    select.value.county = [];
    select.value.town = [];
    area.value.cityCode = undefined;
    area.value.countyCode = undefined;
    area.value.townCode = undefined;
  }

  // 清空县/区
  if (level === 3) {
    select.value.town = [];
    area.value.countyCode = undefined;
    area.value.townCode = undefined;
  }
  // 清空乡/镇
  if (level === 4) {
    area.value.townCode = undefined;
  }
  change();
}

function change() {
  area.value.fullName = '';
  if (area.value.provinceCode) {
    for (const val of select.value.province) {
      if (val.areaCode === area.value.provinceCode) {
        area.value.provinceName = val.name;
      }
    }
    area.value.fullCode = area.value.provinceCode;
    area.value.fullName += area.value.provinceName;
    area.value.selectLevel = 1;
  } else {
    area.value.provinceName = undefined;
  }
  if (area.value.cityCode) {
    for (const val of select.value.city) {
      if (val.areaCode === area.value.cityCode) {
        area.value.cityName = val.name;
      }
    }
    area.value.fullCode = area.value.cityCode;
    area.value.fullName += area.value.cityName;
    area.value.selectLevel = 2;
  } else {
    area.value.cityName = undefined;
  }
  if (area.value.countyCode) {
    for (const val of select.value.county) {
      if (val.areaCode === area.value.countyCode) {
        area.value.countyName = val.name;
      }
    }
    area.value.fullCode = area.value.countyCode;
    area.value.fullName += area.value.countyName;
    area.value.selectLevel = 3;
  } else {
    area.value.countyName = undefined;
  }
  if (area.value.townCode) {
    for (const val of select.value.town) {
      if (val.areaCode === area.value.townCode) {
        area.value.townName = val.name;
      }
    }
    area.value.fullCode = area.value.townCode;
    area.value.fullName += area.value.townName;
    area.value.selectLevel = 4;
  } else {
    area.value.townName = undefined;
  }

  emit("change", area.value);
}
</script>
