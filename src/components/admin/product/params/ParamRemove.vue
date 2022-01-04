<template>
  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParam(attr_id)">删除</el-button>
</template>

<script>
  // import {removeParamByIdRequest} from 'network/goods';

  export default {
    name: "ParamRemove",
    props: {
      attr_id: {
        type: Number,
        default: 0
      },
      attr_name: {
        type: String,
        default: ''
      },
      categoryId: {
        type: Number,
        default: 0
      }
    },
    methods: {
      // 删除参数
      removeParam(attrId) {
        console.log("删除参数")
        console.log(attrId)
        this.$confirm('此操作将永久删除'+this.attr_name+',是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$axios.delete('/shop/product/attribute/'+attrId).then(res => {
            let result = res.data;
            console.log(res)
            console.log("delete")
            if (result.status !== 200) {
              return this.$message.error('删除失败',);
            }
            this.$message({
              message: '删除成功',
              type: 'success'
            });

            this.$emit('param-list');

          });
        }).catch(() => {
          this.alertMessage('已取消删除', 'info');
        });
      }
    }
  }
</script>

<style scoped>

</style>
