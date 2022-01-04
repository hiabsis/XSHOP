<!--
 * @Description: 首页组件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2020-02-27 13:36:12
 -->
<template>
  <div class="home" id="home" name="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="item in carousel" :key="item.productId">
          <router-link :to="{ path: '/goods/details', query: {productID:item.productId} }">
            <img style="height:460px;"
                 src="https://statics.igg.com/game/1993/goods/2021/06/01/054414_60b60f7e918505146.jpg"/>
          </router-link>

        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="main-box">
<!--      加载商品  -->
      <div class="main">
        <ProductListCard v-for="item in this.indexCategoryList" :key="item.id" :data='item' :activeCategoryId ='item.children[0].id'>
        </ProductListCard>
      </div>
    </div>
  </div>
</template>
<script>
import ProductListCard from "../components/ProductListCard";

export default {
  components: {ProductListCard},
  data() {
    return {
      carousel: "", // 轮播图数据
      indexCategoryList: [], // 首页商品展示信息


    };
  },
  watch: {
  },
  created() {
    // 获取轮播图数据
    this.$axios
        .get("api/shop/product/carousel/info", {})
        .then(res => {
          this.carousel = res.data.data;
        })
        .catch(err => {
          return Promise.reject(err);
        });
    // 获取首页展示的商品分类
    this.getIndexCategory();
  },
  methods: {

    // 获取首页展示的商品分类
    getIndexCategory() {
      this.$axios
          .get("api/shop/product/category/index")
          .then(res => {
            console.log("获取首页展示的商品分类 ")
            console.log(res.data.data.children)
            this.indexCategoryList = res.data.data.children;

          })
          .catch(err => {
            return Promise.reject(err);
          });
    }
  }
};
</script>
<style scoped>
@import "../assets/css/index.css";
</style>
