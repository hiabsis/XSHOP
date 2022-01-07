<template>
  <!-- 卡片视图区域 -->
  <el-card>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="模糊查询" v-model="queryInfo.data" clearable @clear="loadMenu">
          <el-button slot="append" icon="el-icon-search" @click="searchCategory"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <menu-add @click="add" :menuOptions=menuOptions ref="add"  @menu-list="updateMenuList"> </menu-add>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <menu-table :menu-list="menuList" :menuOptions=menuOptions  @menu-list="updateMenuList"/>
    {{search}}
    <!-- 分页区域 -->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.page"
            :page-sizes="[2,5,7,10]"
            :page-size="queryInfo.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </el-card>
</template>

<script>

import MenuAdd from './MenuAdd'
import MenuTable from './MenuTable'

export default {
  name: 'CategoryCard',
  components: {
    MenuAdd,
    MenuTable
  },
  data () {
    return {
      queryInfo: { // 查询条件
        page: 1,
        size: 10,
        'XDEBUG_SESSION_START':'PHPSTORM'
      },
      //
      menuList: [],
      menuOptions:[],
      total: 0 ,// 总数据条数
      search:null
    }
  },
  created () {
    this.loadMenu()
    this.loadMenuOptions()
  },
  methods: {

    /**
     * 查询菜单
     */
    searchCategory () {
      this.$axios.get('api/admin/menu/search', {
        params: this.queryInfo
      }).then(resp => {
        console.log('查询菜单',resp)
        if (resp && resp.status === 200) {
          let result = resp.data
          if (result.status !== 200) {
            return this.$message.error('商品列表获取失败', 'error')
          }
          this.menuList = result.data.children
          this.total = result.data.count
          this.search = this.menuList
        }
      })
    },
    /**
     * 获取菜单的顶级菜单
     */
    loadMenuOptions(){

      this.$axios.get('api/admin/menu/page').then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data
          if (result.code !== 200) {
            return this.$message.error('商品上级菜单失败', 'error')
          }
          this.menuOptions = result.data.children;
          console.log('获取菜单的顶级菜单',resp,this.menuOptions,result)
        }
      })

    },
    /**
     * 获取菜单列表
     */
    loadMenu () {
      this.$axios.get('api/admin/menu/page', {
        params: this.queryInfo
      }).then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data
          if (result.code !== 200) {
            return this.$message.error('菜单列表获取失败', 'error')
          }
          this.menuList = result.data.children
          this.total =result.data.count
          console.log('获取菜单列表',resp,result)
        }
      })
    },

    /**
     * 点击添加事件
     */
    add () {
      this.$refs.add.addDialogVisible = true
    },
    /**
     * 监听子组件触发的事件
     */
    updateMenuList () {
      this.loadMenu()
      this.loadMenuOptions()
    },

    // 监听size改变
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.loadMenu()
    },

    /**
     * 监听num的改变
     * @param newPage
     */
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.loadMenu()
    }
  }
}
</script>

<style scoped>

</style>
