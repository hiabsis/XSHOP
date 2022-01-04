<template>
  <div class="goods" id="goods" name="goods">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>全部商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{ search }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 面包屑END -->

    <!-- 分类标签 -->
    <div class="nav">
      <div class="product-nav">
        <div class="title">品种</div>
        <div class="myMenu" id="myMenu">
          <ul>
            <li
                v-for="item in categoryList"
                :key="item.id"
                :class="activeCategoryId === item.id ? 'active':''"
                @mouseover="mouseover($event,item)"
            >
              <router-link to style="color: #424242;">
                <slot>{{ item.label }}</slot>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="nav">
      <div class="product-nav">
        <div class="title">分类</div>
        <div class="myMenu" id="myMenu2">
          <ul>
            <li v-for="item in selectCategoryList" :key="item.id" :class="clickCategoryId === item.id ? 'active':''"
                @click="getProductsByCategoryById(item.id)">
              <router-link to style="color: #424242;">
                <slot>{{ item.label }}</slot>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 分类标签 END-->
    <!-- 主要内容区 -->
    <div class="main" style="margin-top: 20px">
      <div class="list">
        <MyList :list="products" v-if="products.length>0"></MyList>
        <div v-else class="none-product">抱歉没有找到相关的商品，请看看其他的商品</div>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>
    <!-- 主要内容区END -->
  </div>


</template>

<script>

export default {
  name: "Products",
  components: {},
  data() {
    return {
      categoryList: "", //分类列表
      categoryID: [], // 分类id

      product: "", // 商品列表
      productList: "",
      total: 0, // 商品总量
      pageSize: 15, // 每页显示的商品数量
      currentPage: 1, //当前页码
      activeName: "-1", // 分类列表当前选中的id
      search: "", // 搜索条件
      activeCategoryId: -1, // 当前错在商品分类
      selectCategoryList: [], // 当前选中的分类的二级分类
      products: [], //查询到的商品信息
      params: {
        page: 1,
        size: 10,
        categoryId: undefined
      },
      clickCategoryId: -1
    };
  },
  created() {
    // 获取分类列表
    this.getCategory();
  },
  activated() {
    this.activeName = "-1"; // 初始化分类列表当前选中的id为-1
    this.total = 0; // 初始化商品总量为0
    this.currentPage = 1; //初始化当前页码为1
    // 如果路由没有传递参数，默认为显示全部商品
    if (Object.keys(this.$route.query).length === 0) {
      this.clickCategoryId = -2
      return;
    }
    // 如果路由传递了categoryID，则显示对应的分类商品
    if (this.$route.query.categoryID !== undefined) {
      // 获取该分类的父目录
      this.params.categoryId = this.$route.query.categoryID[0]
      this.$axios
          .get("api/shop/product/category",{
            params:this.params
          })
          .then(res => {
            console.log('获取该分类的父目录')

            this.activeCategoryId = res.data.data.data.parentId
            console.log()
          }
          )
      this.clickCategoryId = this.$route.query.categoryID[0]
      return;
    }
    // // 如果路由传递了search，则为搜索，显示对应的分类商品
    // if (this.$route.query.search !== undefined) {
    //   this.search = this.$route.query.search;
    // }
  },
  watch: {
    clickCategoryId:function (val){
      console.log("-1",val)
      if (val === -2){
        this.params.categoryId = undefined
        this.getProductsByCategory(this.params);
      }else {
        this.getProductsByCategory(this.params);
      }


    }
  },
  methods: {
    // 通过mouseover事件控制当前显示的商品分类
    mouseover(e, val) {
      this.activeCategoryId = val.id;
      this.selectCategoryList = val.children;
    },
    // 获取商品分类
    getCategory() {
      this.$axios
          .get("api/shop/product/category/tree")
          .then(res => {
            console.log("获取商品分类 ")
            let root = res.data.data;
            if (undefined === root || null === root) {
              this.categoryList = [];
            } else {

              this.categoryList = []
              this.categoryList = this.categoryList.concat(root.children)
            }

          })
          .catch(err => {
            return Promise.reject(err);
          });
    },
    // 获取商品信息
    getProductsByCategoryById(categoryId) {
      this.clickCategoryId = categoryId
      this.params.categoryId = categoryId

    },
    // 获取商品信息
    getProductsByCategory(params) {
      this.$axios
          .get("api/shop/product", {params: params})
          .then(res => {

            this.products = res.data.data.data
            this.total = res.data.data.total
            this.pageSize = this.params.size
            console.log(this.products)
          })
          .catch(err => {
            return Promise.reject(err)
          })
    },
    // 页码变化调用currentChange方法
    currentChange(currentPage) {
      console.log(currentPage,"currentPage")
      this.currentPage = currentPage
      this.params.page = currentPage;
      if (this.search != "") {
        this.getProductBySearch()
      } else {
        this.getProductsByCategory(this.params)
      }
    },


  }
}
</script>


<style scoped>
#myMenu li {
  float: left;
  margin-left: 30px;
}

#myMenu a:hover {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu .active a {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu2 li {
  float: left;
  margin-left: 30px;
}

#myMenu2 a:hover {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu2 .active a {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

.goods {
  background-color: #f5f5f5;
}

/* 面包屑CSS */
.el-tabs--card .el-tabs__header {
  border-bottom: none;
}

.goods .breadcrumb {
  height: 50px;
  background-color: white;
}

.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  line-height: 30px;
  font-size: 16px;
  margin: 0 auto;
}

/* 面包屑CSS END */

/* 分类标签CSS */
.goods .nav {
  background-color: white;
}

.categories {
  margin-left: 5px;
  margin-right: 5px;
}

.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
}

.nav .product-nav .title {
  width: 50px;
  font-size: 16px;
  font-weight: 700;
  float: left;
}

/* 分类标签CSS END */

/* 主要内容区CSS */
.goods .main {
  margin: 0 auto;
  max-width: 1225px;
}

.goods .main .list {
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
  overflow: auto;
}

.goods .main .pagination {
  height: 50px;
  text-align: center;
}

.goods .main .none-product {
  color: #333;
  margin-left: 13.7px;
}

/* 主要内容区CSS END */
</style>
