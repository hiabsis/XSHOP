<template>
  <!-- 卡片视图区域 -->
  <el-card>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="分类名称" v-model="queryInfo.categoryName" clearable @clear="loadCategory">
          <el-button slot="append" icon="el-icon-search" @click="searchCategory"></el-button>
        </el-input>
      </el-col>

      <el-col :span="4">
        <category-add @click="addCategory" :parentCategory=topCategoryList ref="categoryAdd"  @category-list="updateCategoryList"> </category-add>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <category-table :category-list="categoryList" :parentCategory=topCategoryList  @category-list="updateCategoryList"/>

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
import CategoryAdd from './CategoryAdd'
import CategoryTable from './CategoryTable'

export default {
  name: 'CategoryCard',
  components: {
    CategoryAdd,
    CategoryTable
  },
  data () {
    return {
      queryInfo: { // 查询条件
        categoryName: null,
        parentId:null,
        page: 1,
        size: 10
      },
      //
      categoryList: [],
      topCategoryList:[],
      total: 0 // 总数据条数
    }
  },
  created () {
    this.loadCategory()
    this.getTopCategory()
  },
  methods: {

    // 查询商品分类
    searchCategory () {
      this.$axios.get('api/shop/product/category', {
        params: this.queryInfo
      }).then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data
          if (result.status !== 200) {
            return this.$message.error('商品列表获取失败', 'error')
          }
          let res = []
          for (let i = 0; i < result.data.data.length; i++) {
            let node = result.data.data[i]
            res[i] = {
              'id': node.id,
              'label': node.category_name,
              'detail': node
            }
          }
          this.categoryList = res

          this.total = parseInt(result.data.count)
        }
      })
    },
    // 获取商品分类的顶级分类
    getTopCategory(){
      this.$axios.get('api/shop/product/category', {
        params: {'parentId':-1,'XDEBUG_SESSION_START':'PHPSTORM'}
      }).then(resp => {

        if (resp && resp.status === 200) {
          let result = resp.data

          if (result.code !== 200) {
            return this.$message.error('商品上级分类失败', 'error')
          }
          this.topCategoryList = result.data.data
          this.topCategoryList.push({'categoryId':'-1','categoryName':'顶级菜单'})
        }
      })

    },
    // 获取商品分类列表
    loadCategory () {
      this.$axios.get('api/shop/product/category/tree', {
        params: this.queryInfo
      }).then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data
          if (result.code !== 200) {
            return this.$message.error('商品分类列表获取失败', 'error')
          }
          this.categoryList = result.data.children
          this.total = result.data.total
        }
      })
    },

    // 点击添加分类事件
    addCategory () {
      this.$refs.categoryAdd.addDialogVisible = true
    },
    // 监听子组件触发的事件
    updateCategoryList () {
      this.loadCategory()
      this.getTopCategory()
    },

    // 监听size改变
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.loadCategory()
    },

    // 监听num的改变
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.loadCategory()
    }
  }
}
</script>

<style scoped>

</style>
