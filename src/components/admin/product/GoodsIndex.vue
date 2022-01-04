<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav >
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>商品列表</template>
    </breadcrumb-nav>

    <el-card style="margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.productName" clearable @clear="loadGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="loadGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" style="margin-top: 20px" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="productName"></el-table-column>
        <el-table-column label="商品数量" prop="productNumber" width="150px"></el-table-column>
        <el-table-column label="商品价格（元）" prop="productPrice" width="150px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 15, 20, 30]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
  </div>
</template>

<script>
import BreadcrumbNav from '../../common/BreadcrumbNav'

export default {
  name: 'List',
  components: {
    BreadcrumbNav
  },
  data () {
    return {
      queryInfo: {
        product_name: null,
        page: 1,
        size: 10
      },
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.loadGoodsList()
  },
  methods: {
    // 加载商品列表
    loadGoodsList () {
      this.$axios
        .get('api/shop/product', {
          params: this.queryInfo
        }).then(resp => {
          if (resp && resp.status === 200) {
            let result = resp.data

            if (result.code !== 200) {
              return this.$message.error('获取商品数据失败', 'error')
            }
            this.goodsList = result.data.data
            this.total = result.data.total
            console.log('加载商品列表',this.total)
          }
        })
    },

    // 每页显示的数据条数发送变化
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.loadGoodsList()
    },

    // 当前页码发生变化
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.loadGoodsList()
    },

    // 删除商品
    removeGoods (id) {
      console.log(id)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // removeGoodsByIdRequest(id).then(res => {
        //   let result = res.data
        //
        //   if (result.meta.status !== 200) {
        //     return this.alertMessage('删除失败', 'error')
        //   }
        //
        //   this.alertMessage('删除成功', 'success')
        //
        //   // this.$emit('param-list');
        //   this.loadGoodsList()
        // })
      }).catch(() => {
        this.alertMessage('已取消删除', 'info')
      })
    },

    // 跳转到添加商品的界面
    goAddPage () {
      this.$router.push('/admin/GoodsAdd')
    }
  }
}
</script>

<style scoped>

</style>
