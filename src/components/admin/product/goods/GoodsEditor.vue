<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>编辑商品</template>
    </breadcrumb-nav>
    <!-- 卡片视图 -->
    <el-card style="text-align: left">
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>

      </el-steps>
      <br/>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">

            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>

            <el-form-item label="分类" prop="category_id">

              <treeselect :normalizer="normalizer" v-model="selectCategoryID" :options="categoryList"
                          placeholder="请选择分类"/>
            </el-form-item>


            <el-form-item label="价格" prop="price">
              <el-input v-model="addForm.price" type="number" min="0"
                        onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" step="0.01"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="number">
              <el-input v-model="addForm.number" type="number" min="0"
                        onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>

            </el-form-item>
            <el-form-item label="简介" prop="desc">
              <el-input v-model="addForm.desc"  type="textarea" style="row: 8"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="desc" :span="24" >
              <el-select v-model="addForm.status" placeholder="请选择" :span="24" style="width:100%">
                <el-option
                    v-for="item in [{'label':'上架','value':1},{'label':'下架','value':2}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品属性" name="1" style="margin-top: 20px ;margin-left: 10px" @row-dblclick="dbclick">
            <el-button type="primary" size="mini" plain style="margin-bottom: 10px;margin-top: 5px"
                       @click="addProductInfo">添加
            </el-button>

            <el-table :data="addForm.info" border stripe>
              <el-table-column label="参数名称" prop="name">
                <template slot-scope="scope">
                  <el-form :model="scope.row">
                    <el-form-item>
                      <el-input v-if="scope.row.isOK" v-model="scope.row.name"></el-input>
                      <span v-else>{{ scope.row.name }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="参数值" prop="value">
                <template slot-scope="scope">
                  <el-form :model="scope.row">
                    <el-form-item>
                      <el-input v-if="scope.row.isOK" v-model="scope.row.value"></el-input>
                      <span v-else>{{ scope.row.value }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                  <el-form :model="scope.row">
                    <el-form-item>
                      <el-select v-model="scope.row.type" v-if="scope.row.isOK" placeholder="请选择">
                        <el-option
                            label="单属性"
                            value=1>
                        </el-option>
                        <el-option
                            label="多属性 使用;分割不同的值"
                            value=2>
                        </el-option>
                      </el-select>
                      <span v-else>{{ scope.row.type === 1 ? "单属性" : "多属性" }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="dbclick(scope.row)">
                    <span v-if="scope.row.isOK || undefined === scope.row.isOK ">
                      保存
                    </span>
                    <span v-else>
                      编辑
                    </span>
                  </el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeProductInfo(scope.row)">
                    <span>
                      删除
                    </span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>

          <el-tab-pane label="商品图片" name="2">

            <el-form-item label="轮播图" prop="">

              <UploadModel :imgWeight=400 :imgHeight=600 :limitSize=1 :resourceType=1
                           :files="getImgFiles(addForm.resources,1)"
                           @fileUploadSuccess='fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>
            </el-form-item>
            <el-form-item label="封面图" prop="">

              <UploadModel :imgWeight=150 :imgHeight=150 :limitSize=1 :resourceType=2
                           :files="getImgFiles(addForm.resources,2)"
                           @fileUploadSuccess='fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>
            </el-form-item>

            <el-form-item label="详情图" prop="">
              <UploadModel :imgWeight=560 :imgHeight=560 :limitSize=4 :resourceType=3
                           :files="getImgFiles(addForm.resources,3)"
                           @fileUploadSuccess='fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>
            </el-form-item>


            <!-- action表示图片上传的地址 -->

          </el-tab-pane>
          <el-tab-pane label="商品内容" name="3">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.detail" class="editor"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="addBtn" @click="updateGoods">更新商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import BreadcrumbNav from '../../../common/BreadcrumbNav'

import Treeselect from '@riophae/vue-treeselect'

import '@riophae/vue-treeselect/dist/vue-treeselect.css'


export default {
  name: 'ListAdd',
  components: {
    BreadcrumbNav,
    Treeselect,
  },
  data() {
    return {
      productInfo: [

      ],
      pic:{
        'mainPic':[],
        'listPic':[],
        'indexPic':[]
      },
      inputAttribute: [],
      selectCategoryID: null,
      activeIndex: '0',
      // 封面图信息
      mainPic: null,
      addForm: {
        "info": [],
        "resources": []
      },
      addFormRules: {
        name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ],
        resources: [
          {required: true, message: '请上传商品图片', trigger: 'blur'}
        ],
        info: [
          {required: true, message: '设置商品属性', trigger: 'blur'}
        ],
      },
      categoryList: [],
    }
  },
  computed: {


    // 三级分类的id
    cateId() {
      if (this.selectCategoryID == null || this.selectCategoryID === '') {
        return null
      }
      return this.selectCategoryID
    }
  },
  created() {
    console.log("添加商品页面",this.$route.params)
    this.loadCategory()


    if (undefined !== this.$route.params.id && null !==  this.$route.params.id){
      this.getDetails(this.$route.params.id)
      this.selectCategoryID = this.addForm.category_id
      this.productInfo = this.addForm.info
      // 获取商品的轮播图
      this.getFileInfo(this.$route.params.id,1)
      // 获取商品的推荐图
      this.getFileInfo(this.$route.params.id,2)
      this.getFileInfo(this.$route.params.id,3)
    }
  },
  watch: {
    'selectCategoryID': 'handleTreeChange'
  },
  methods: {
    /**
     * 格式化数据给组件
     * @param data
     * @param type
     * @returns {*[]}
     */
    getImgFiles(data, type) {
      let res = []
      for (let i=0;i<data.length;i++){
        if (data[i].resourceType === type){
          res.push( {'name':'update.png','url':'api'+data[i].fileAccessPath,'id':data[i].resourceId})
        }
      }
      console.log('格式化数据给组件',type,res,data)
      return res;
    },
    /**
     * 获取文件信息
     * @param id
     * @param type
     */
    getFileInfo(id,type){
      console.log('获取文件信息')
      this.$axios.get('api/system/file/info',{
        params:{
          'id':id,
          'type':type,
          'XDEBUG_SESSION_START':'PHPSTORM'
        }
      }).then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data
          if (this.addForm.resources === null || this.addForm.resources=== undefined ){
            this.addForm.resources = []
          }
          if (result.status !== 200) {
            return this.$message.error('获取文件信息失败')
          }

          console.log('获取文件信息',resp.data.data)
          for (let i=0;i<resp.data.data.length;i++){
            this.addForm.resources.push(resp.data.data[i])
          }
          this.addForm.resources.concat(resp.data.data)
          console.log('获取文件信息',this.addForm.resources)
        }
      })
    },
    /**
     * 获取商品详情
     * @param id
     */
    getDetails(id) {
      console.log("获取商品详情")
      this.$axios
          .get("http://localhost:8080/shop/product/"+id)
          .then(res => {
            console.log(res)
            this.addForm = res.data.data;
          })
          .catch(err => {
            return Promise.reject(err);
          });
    },

    /**
     * 文件上传成功
     * @param resourceId
     * @param resourceType
     * @param fileAccessPath
     */
    fileUploadSuccess(resourceId, resourceType, fileAccessPath) {

      if (this.addForm.resources === null || this.addForm.resources === undefined){
        this.addForm.resources = []
      }
        this.addForm.resources.push({
          'resourceId': resourceId,
          'resourceType': resourceType,
          'fileAccessPath': fileAccessPath
        })
      console.log('文件上传成功', resourceId, resourceType, this.addForm.resources)
    },
    /**
     * 文件删除
     * @param resourceUrl
     */
    fileRemove(resourceUrl) {
      if (this.addForm.resources !== null && this.addForm.resources !== undefined) {
        let index = this.addForm.resources.findIndex(item => ('api' + item.fileAccessPath) === resourceUrl);
        console.log('文件记录', index, resourceUrl, this.addForm.resources[index].fileAccessPath)
        this.addForm.resources.splice(index, 1);
      }
    },

    removeProductInfo(row) {
      const index = this.addForm.info.findIndex(item => {
        if (item.name === row.name && item.value === row.value) {
          return true
        }
      });
      this.addForm.info.splice(index, 1)
    },
    addProductInfo() {
      console.log("add")
      let info = {
        "name": "",
        "value": "",
        "type": 1,
        isOK: true,
      }
      this.addForm.info.push(info)
    },
    dbclick(row) {
      row.isOK = !row.isOK
    },
    clear() {
      this.$message.warning('封面图只能选择1张,取消上传')
      this.$refs.mainUpload.abort(this.$refs.mainUpload.fileList)
      this.$refs.mainUpload.clearFiles()
    },

    inputDate(e, key) {
      if (e.target.value == null || e.target.value === '') {
        return
      }
      let item = {
        'k': key,
        'v': e.target.value
      }
      for (let i = 0; i < this.addForm.sku.detail.length; i++) {
        let cur = this.addForm.sku.detail[i]
        if (cur.k === key) {
          this.addForm.sku.detail[i].v = e.target.value
          return
        }
      }
      this.addForm.sku.detail.push(item)
    },
    handleSelect(item) {
      console.log(item)
    },

    /**
     * 格式分类的树化节点
     * @param node
     * @returns {{children, id, label}}
     */
    normalizer(node) {
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
    /**
     * 获取所有商品分类
     */
    loadCategory() {
      this.$axios.get('api/shop/product/category/tree').then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data
          if (result.status !== 200) {
            return this.$message.error('商品列表获取失败')
          }
          this.categoryList = result.data.children
          for (let i = 0; i < this.categoryList.length; i++) {
            this.categoryList[i].disable = true
          }
          this.total = this.categoryList.length
        }
      })
    },
    // 树形选择器发生变化
    handleTreeChange() {
      console.log('树形选择器发生变化 ' + this.selectCategoryID)
      this.addForm.category_id = this.selectCategoryID
    },
    // tab标签页发生切换
    beforeTabLeave(activeName, oldActiveName) {


      if (oldActiveName === '0' && (this.addForm.category_id == null || this.addForm.category_id === '')) {
        this.$message.error('请先选择商品分类')
        return false
      }
      if (this.activeIndex === '1') {

        if (this.addForm.info.length < 1) {
          this.$message.error('商品属性不能为空 ')
          return false
        }
        for (let i = 0; i < this.productInfo.length; i++) {
          if (this.productInfo[i].name === '' || this.productInfo[i].value === '' || this.productInfo[i].type === '') {
            this.$message.error('商品属性的参数名称与参数值不能为空 ')
            return false
          }
        }
      }
      if (this.activeIndex === '2') {
        if (undefined === this.addForm.resources || null === this.addForm.resources || this.addForm.resources.length < 1) {
          this.$message.error('请上传商品详情图片,请上传商品封面图,请上传商品推荐图')
          return false
        }
      }
    },
    updateParamsList() {
      this.tabClicked()
    },
    // 点击切换左侧标签页
    tabClicked() {

    },


    /**
     * 更新商品
     */
    updateGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        console.log('按钮添加商品',this.addForm)
        this.$axios.put('api/shop/product?XDEBUG_SESSION_START=PHPSTORM', this.addForm).then(res => {
          let result = res.data
          console.log('添加商品', result)
          if (result.status !== 200) {
            return this.$message.error('添加失败')
          }
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push('GoodsIndex')
        })
      })
    }
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.addBtn {
  margin-top: 15px;
}
</style>
