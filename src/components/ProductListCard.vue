<template>
  <div class="appliance" id="promo-menu">

    <div class="box-hd">
      <div class="title">{{ data.label }}</div>
      <div class="more" id="more">
        <div class="myMenu" id="myMenu">
          <ul>

            <li v-for="item in data.children"
                :key="item.id"
                :class="activeCategoryId === item.id ? 'active':''"
                @mouseover="mouseover($event,item)">
              <router-link to>
                <!--                {{item}}-->
                <slot>{{ item.label }}</slot>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="box-bd">
      <div class="promo-list">
        <ul>
          <li>
            <img :src="'api'+img.fileAccessPath" v-for="img in getCategoryShowImg(5)" :key="img.resourceId"
                 @click="routerProducts(img)"/>
          </li>
        </ul>
      </div>
      <div class="list">

        <MyList :list="products" :parentId=data.id :isMore="true"></MyList>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'data',
    'activeCategoryId'
  ], // 一级商品分类 , 商品的名称
  name: "productListCard",
  data() {
    return {
      products: [],
    }
  },
  mounted() {
    console.log(this.data)
    console.log('mount')
    this.getProductsByCategoryId(this.activeCategoryId)
  },
  methods: {
    /**
     * 跳转页面
     * @param data
     */
    routerProducts(data) {
      console.log(data,'routerProducts')
      this.$router.push({path: '/products', query: {category: data.categoryId}});
    },
    getCategoryShowImg(type) {
      let res = [];
      for (let i = 0; i < this.data.detail.resources.length; i++) {
        if (this.data.detail.resources[i].resourceType === type) {
          this.data.detail.resources[i].categoryId = this.data.id
          res.push(this.data.detail.resources[i])
        }
      }
      return res;
    },
    mouseover(e, val) {
      this.activeCategoryId = val.id;
      // 获取商品信息
      this.getProductsByCategoryId(this.activeCategoryId)
    },
    // 获取商品信息DD
    getProductsByCategoryId(categoryId) {
      console.log("categoryId",categoryId)
      this.$axios
          .get("api/shop/product?page=1&size=7&categoryId=" + categoryId)
          .then(res => {
            console.log("获取商品信息 v3 ")
            console.log(res)
            this.products = res.data.data.data;
            console.log(res.data.data.data)
            console.log(this.products)
          })
          .catch(err => {
            return Promise.reject(err);
          })
    }
  },
  watch: {}
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

@import "../assets/css/index.css";
</style>
