<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>分类参数</template>
    </breadcrumb-nav>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="selectCategory" style="position: relative; text-align: left; left: 20px;" >
<!--        <div >选择商品分类：</div>-->
        <treeselect  :normalizer="normalizer" style="width: 200px" v-model="categoryId"  :options="categoryList"    placeholder="选择商品分类"></treeselect>
          <!-- 选择商品分类的级联选择框 -->
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">

        <el-tab-pane label="动态参数" name="1">
          <!-- 标签页组件 -->
          <param-tab-pane
            :table-data="manyTableData"
            :title-text="titleText"
            :is-btn-disabled="isBtnDisabled"
            :category-id="categoryId"
            :active-name="activeName"
            @param-list="updateParamsList"/>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="2">
          <param-tab-pane

            :table-data="onlyTableData"
            :title-text="titleText"
            :is-btn-disabled="isBtnDisabled"
            :category-id="categoryId"
            :active-name="activeName"
            @param-list="updateParamsList"/>
        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>

<script>

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// 导入公共组件
import BreadcrumbNav from '../../common/BreadcrumbNav'

// 导入子组件
import ParamTabPane from './params/ParamTabPane'

// import {
//   getCategoriesListRequest,
//   getCategoryParamsRequest
// } from 'network/goods';

export default {
  name: 'Params',
  components: {
    BreadcrumbNav,
    ParamTabPane,
    Treeselect
  },
  data () {
    return {
      value: null,
      categoryId: null,
      categoryList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectedKeys: [], // 级联选择框中选中项的数组
      activeName: '1',
      manyTableData: [], // 动态参数数据
      onlyTableData: [] // 静态属性数据
    }
  },
  created () {
    this.loadCategory()
  },
  computed: {
    isBtnDisabled () {
      // todo 检查是否为根
      if (this.categoryId == null || this.categoryId === '') {
        return true
      }
      return false
    },

    titleText () {
      return this.activeName === '1' ? '动态属性' : '静态属性'
    }
  },
  watch: {
    // 监听deptId
    'categoryId': 'categoryChange'
  },
  methods: {
    // 格式化节点
    normalizer (node) {
      // 去掉children=[]的children属性
      if (node.children == null || node.children === 'null') {
        delete node.children
      }

      return {
        id: node.id,
        // 将name转换成必填的label键
        label: node.label,
        children: node.children
      }
    },
    // 获取所有商品分类
    loadCategory () {
      this.$axios.get('/shop/product/category/tree').then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data

          if (result.status !== 200) {
            return this.alertMessage('商品列表获取失败', 'error')
          }
          this.categoryList = result.data.children
          this.total = this.categoryList.length
        }
      })
    },
    // 选择项发送变化触发的函数
    categoryChange () {
      this.loadCategoryParams()
    },

    // tab标签页点击事件的处理函数
    handleTabClick () {
      this.categoryId = parseInt(this.categoryId)
      this.loadCategoryParams()
    },
    // 加载商品分类参数
    loadCategoryParams () {
      this.categoryId = parseInt(this.categoryId)

      this.$axios.get('/shop/product/attribute', {params: {
        category_id: this.categoryId,
        attribute_type: this.activeName
      }}).then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data

          if (result.status !== 200) {
            return this.error('获取数据失败', 'error')
          }

          if (this.activeName === '1') {
            this.manyTableData = result.data.data
          } else {
            this.onlyTableData = result.data.data
          }
        }
      })
    },

    // 监听子组件触发的事件
    updateParamsList () {
      this.loadCategoryParams()
    }
  }
}
</script>

<style scoped>
.selectCategory {
  margin-top: 15px;
}
</style>
