<template>
  <!-- 表格 -->
  <div>

    <el-table
        :data="categoryList"
        style="width: 100%;margin-bottom: 20px; margin-left: 20px;margin-top: 30px ;margin-right: 20px"
        row-key="id"
        lazy
        border
        stripe
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="detail.categoryName"
          label="分类名称"
      >

      </el-table-column>

      <el-table-column
          label="图标"
          prop="detail.categoryName"
      >
        <template slot-scope="scope">
          <el-image

              style="width: 100px; height: 100px"
              :src="getImageAccessPath(scope.row,4)"
              fit="scale-down"></el-image>
        </template>

      </el-table-column>
      <el-table-column
          prop="detail.categorySort"
          label="排序"
      >
      </el-table-column>
      <el-table-column
          prop="detail.categoryStatus"
          label="状态" style="text-align: center">
        <template slot-scope="scope">
          <el-switch

              v-model="scope.row.detail.categoryStatus"
              @click = "updateData(scope.row.detail.categoryStatus)"
              active-value='1' inactive-value="0"
              active-text="显示"
              inactive-text="隐藏">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
          prop="detail.categoryType"
          label="类型" style="text-align: center">
        <template slot-scope="scope">
          <i v-if="scope.row.detail.categoryType === '1'"><span>首页推送</span></i>
          <i v-else>普通标签</i>
        </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
      >
        <template slot-scope="scope">

          <category-edit :row="scope.row.detail" ref="category-edit" :parentCategory='parentCategory' :addCategoryForm="scope.row.detail"
                         @category-list="updateCategoryList"></category-edit>
          <category-remove :row="scope.row" ref="category-remove" @category-list="updateCategoryList"></category-remove>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import CategoryEdit from './CategoryEdit'
import CategoryRemove from './CategoryRemove'

export default {
  name: 'CategoryTable',
  components: {
    CategoryEdit,
    CategoryRemove
  },
  props: {
    categoryList: {
      type: Array,
      default() {
        return []
      }
    },
    parentCategory:null
  },
  data() {
    return {
      categoryImage: [],
      // 为table指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', // 指定当前列是模板列
          template: 'isok'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ]
    }
  },
  created() {

  },
  methods: {

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
    updateCategoryList() {
      this.$emit('category-list')
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
