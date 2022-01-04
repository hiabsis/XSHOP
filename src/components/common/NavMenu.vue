<template>
  <el-menu

      :default-active="'/index'"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="red"
      style="min-width: 1300px">
    <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
      {{ item.navItem }}
    </el-menu-item>
    <el-menu-item>
      <search-bar></search-bar>
    </el-menu-item>
    <a href="#nowhere" style="color: #222;float: right;padding: 20px;">更多功能</a>
    <i class="el-icon-menu" style="float:right;font-size: 45px;color: #222;padding-top: 8px"></i>
    <span style="position: absolute;padding-top: 20px;right: 43%;font-size: 20px;font-weight: bold">XSHOP</span>

  </el-menu>
</template>

<script>
import SearchBar from '../home/SearchBar'
export default {
  name: 'NavMenu',
  components: {SearchBar},
  data () {
    return {
      navList: [
        {name: '/index', navItem: '首页'},
        // {name: '/jotter', navItem: '笔记本'},
        // {name: '/library', navItem: '图书馆'},
        {name: '/admin', navItem: '后台管理'}
      ]
    }
  }
}
</script>

<style scoped>
a{
  text-decoration: none;
}

.menu {
  position: fixed;
  margin-left: 40%;
  left: -600px;
  top: 0px;
}

span {
  pointer-events: none;
}
</style>
