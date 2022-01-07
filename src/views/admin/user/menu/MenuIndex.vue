<template>
  <div>
  <!-- 顶部面包屑导航 -->
  <BreadcrumbNav>
    <template v-slot:firstMenu>用户</template>
    <template v-slot:secondMenu>菜单</template>
  </BreadcrumbNav>
  <!-- 卡片视图区域 -->
  <MenuCard></MenuCard>
  </div>
</template>

<script>
import MenuCard from "./MenuCard";
export default {
  name: "MenuIndex",
  components:{
    MenuCard
  }
}
</script>

<style scoped>

</style>
