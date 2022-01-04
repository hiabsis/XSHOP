<!--分类标签 -->
<template>
  <!-- 分类标签 -->
  <div class="nav">
    <div class="product-nav">
      <div class="title">分类</div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :name="''+item.category_id"
        />
      </el-tabs>
    </div>
  </div>
  <!-- 分类标签 END-->
</template>

<script>
export default {
  name: "Category"
}
</script>

<style scoped>

</style>
