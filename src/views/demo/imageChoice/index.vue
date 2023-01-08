<template>
  <div class="app-container">
    <h3>请从图库选择图片: </h3>

    <image-choise @select="getImage"/>

    <h3 v-if="!form.imageUrl">未选择图片！</h3>
    <h3 v-if="form.imageUrl">已选择的图片：</h3>
    <image-preview :src="form.imageUrl" :height="240" :width="240"/>
  </div>
</template>
<script setup name="MockImageChose">
import ImageChoise from '@/views/components/ImageChoise';

const { proxy } = getCurrentInstance();

const data = reactive({
  form: {},
  rules: {
    imageUrl: [{ required: true, message: "图片不能为空", trigger: "blur" }],
  }
});
const { form, rules } = toRefs(data);

function init() {
  form.value.imageUrl = 'https://static.wkclz.com/images/avatar.jpg';
}

function getImage(val) {
  form.value.imageUrl = val.imageUrl;
  form.value.imageName = val.imageName;
}

init();
</script>
