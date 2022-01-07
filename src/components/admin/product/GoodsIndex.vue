<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav >
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>商品列表</template>
    </breadcrumb-nav>

    <el-card style="margin-top: 20px ;height: 100%">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.name" clearable @clear="loadGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="loadGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" style="margin-top: 20px" border stripe>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品分类" prop="category_name" >
        </el-table-column>
        <el-table-column label="库存" prop="number"></el-table-column>
        <el-table-column label="商品价格（元）" prop="price" ></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">
             上架
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="goUpdatePage(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination style="margin-top: 20px"
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
    /**
     * 更新商品状态
     * @param status
     */
    updateProductStatus(status,id){
      console.log("更新商品状态",status)
      this.$axios.put('api/shop/product?XDEBUG_SESSION_START=PHPSTORM',{'status':parseInt(status),'id':parseInt(id)})
          .then(resp =>{
            let result = resp.data
            console.log(result)
            if (result.status !== 200) {
              return this.$message.error('更新商品状态失败')
            }
            this.$message({
              message: '更新商品状态成功',
              type: 'success'
            })
            this.loadGoodsList()
          })
    },
    /**
     * 加载商品列表
     */
    loadGoodsList () {
      this.$axios
        .get('api/shop/product', {
          params: this.queryInfo
        }).then(resp => {
          if (resp && resp.status === 200) {
            let result = resp.data

            if (result.code !== 200) {
              return this.$message.error('获取商品数据失败')
            }
            this.goodsList = result.data.data
            this.total = result.data.total
            console.log('加载商品列表',this.total)
            console.log('加载商品列表',this.goodsList)
          }
        })
    },

    /**
     * 每页显示的数据条数发送变化
     * @param newSize
     */
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.loadGoodsList()
    },

    /**
     * 当前页码发生变化
     * @param newPage
     */
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.loadGoodsList()
    },

    /**
     * 删除商品
     * @param row
     */
    removeGoods (row) {
      this.$confirm('此操作将永久删除'+row.productName+', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
            this.$axios.delete('api/shop/product/'+row.productId+'?XDEBUG_SESSION_START=PHPSTORM').then(res => {
              let result = res.data
              console.log('删除商品', result)
              if (result.status !== 200) {
                return this.$message.error('删除失败')
              }
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loadGoodsList()
              this.$router.push('GoodsIndex')
      }).catch(() => {
      })
    })},


    /**
     *  跳转到添加商品的界面
     */
    goAddPage () {
      this.$router.push('/admin/GoodsAdd')
    },
    /**
     *  跳转到编辑商品的界面
     * @param id
     */
    goUpdatePage (id) {
      this.$router.push({ name: 'GoodsEditor', params: {id:id,title:"编辑图片"}})
    }

  }
}
</script>

<style scoped>

</style>
