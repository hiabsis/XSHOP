<template>
  <!-- 表格 -->
  <div>
    <el-table
        :data="menuList"
        style="width: 100%;margin-bottom: 20px; margin-left: 20px;margin-top: 30px ;margin-right: 20px"
        row-key="id"
        lazy
        border
        stripe
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="detail.name_zh"
          label="菜单名称"
      >
        <template slot-scope="scope">
          <i :class="scope.row.detail.icon">
            {{scope.row.detail.name_zh}}
          </i>

        </template>
      </el-table-column>

      <el-table-column
          label="图标"
          prop="detail.icon"
      >

      </el-table-column>
      <el-table-column
          prop="detail.path"
          label="路由"
      >
      </el-table-column>
      <el-table-column
          prop="detail.component"
          label="组件"
      >
      </el-table-column>

      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">
          <menu-editor @click="update" :menuOptions=menuOptions ref="update" :menu="scope.row"  @menu-list="updateMenuList"> </menu-editor>
          <category-remove :row="scope.row" ref="category-remove" @menu-list="updateMenuList"></category-remove>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>


import CategoryRemove from './MenuRemove'
import MenuEditor from "./MenuEditor";
export default {
  name: 'CategoryTable',
  components: {

    CategoryRemove,
    MenuEditor
  },
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    menuOptions:null
  },
  data() {
    return {
    }
  },
  created() {

  },
  methods: {
    // 点击添加事件
    update () {
      this.$refs.update.addDialogVisible = true
    },
    /**
     * 跳转到菜单添加页面
     */
    goRoute(name){
      console.log('跳转到菜单添加页面')
      this.$router.push({ name: name})
    },
    getImageAccessPath(row,type){
      let resources = row.detail.resources;

      if (undefined === resources || null === resources || resources.length <1){
        return '#'
      }
      for (let i=0;i<resources.length;i++){
        if (resources[i].resourceType === type){
          return  'http://localhost:8080'+resources[i].fileAccessPath
        }
      }
      return  '#'

    },
    // 判断类型
    statusFormatter(row) {
      let status = row.detail.categoryStatus
      if (status === '1') {
        return '正常'
      } else {
        return '禁用'
      }
    },
    updateMenuList() {
      this.$emit('menu-list')
    },


  }

}
</script>

<style scoped>
.checkIcon {
  color: lightgreen;
  font-size: 17px;
}

.closeIcon {
  color: red;
  font-size: 17px;
}

</style>
