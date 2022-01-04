//用来显示富文本
<template>
  <div class="ql-container ql-snow">
    <div class="ql-editor">
      <div v-html="data">{{data.productDetail}}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductInfo",
  props:['data']
}
</script>

<style scoped>
@import "../assets/css/VueQuillEditor.css";
</style>
