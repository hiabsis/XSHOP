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
    // 删除菜单
    deleteCategory(row) {
      this.$confirm('此操作将永久删除 ' + row.label + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            let ids = []
            this.getRemoveIds(row, ids)
            this.$axios
                .post("api/admin/menu/remove/" + row.id+"?XDEBUG_SESSION_START=PHPSTORM",{ids:ids})
                .then(resp => {
                  if (resp && resp.status === 200) {
                    this.$emit('menu-list')
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

    getRemoveIds($data, $res) {
      $res.push($data.id)
      if ($data.children !== null && $data.children.length > 0) {
        for (let i = 0; i < $data.children.length; i++) {
          this.getRemoveIds($data.children[i], $res)
        }
      }
    },

  }
}
</script>

<style scoped>

</style>
