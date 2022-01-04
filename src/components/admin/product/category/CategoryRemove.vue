<template>
  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategory(row)">删除</el-button>
</template>

<script>
// import {deleteCategory} from '../../../../api/category/category'

export default {
  name: 'CategoryRemove',
  data() {
    return {}
  },
  props: {
    row: null,
    id: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 删除分类
    deleteCategory(row) {
      this.$confirm('此操作将永久删除 ' + row.label + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            this.$axios
                .delete("api/shop/product/category/" + row.id)
                .then(resp => {
                  if (resp && resp.status === 200) {
                    this.$emit('category-list')
                  }
                })
          }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

  }
}
</script>

<style scoped>

</style>
