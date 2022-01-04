<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <breadcrumb-nav>
      <template v-slot:firstMenu>商品管理</template>
      <template v-slot:secondMenu>添加商品</template>
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

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">

            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="addForm.productName"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="categoryId">
              <treeselect :normalizer="normalizer" v-model="selectCategoryID" :options="categoryList"
                          placeholder="请选择分类"/>
            </el-form-item>


            <el-form-item label="商品价格" prop="productPrice">
              <el-input v-model="addForm.productPrice" type="number" min="0"
                        onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" step="0.01"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="productNumber">
              <el-input v-model="addForm.productNumber" type="number" min="0"
                        onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>

            </el-form-item>
            <el-form-item label="商品简介" prop="productDesc">
              <el-input v-model="addForm.productDesc"></el-input>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品属性" name="1" style="margin-top: 20px ;margin-left: 10px" @row-dblclick="dbclick">
            <el-button type="primary" size="mini" plain style="margin-bottom: 10px;margin-top: 5px"
                       @click="addProductInfo">添加
            </el-button>
            {{productInfo}}
            <el-table :data="productInfo" border stripe>
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
                    <span v-if="scope.row.isOK">
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
            <el-form-item label="封面图" prop="">

              <UploadModel :imgWeight=150 :imgHeight=150 :limitSize=1 :resourceType=2 @fileUploadSuccess = 'fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>

            </el-form-item>
            <el-form-item label="详情图" prop="">
              <UploadModel :imgWeight=560 :imgHeight=560 :limitSize=4 :resourceType=3 @fileUploadSuccess = 'fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>
            </el-form-item>



            <!-- action表示图片上传的地址 -->

          </el-tab-pane>
          <el-tab-pane label="商品内容" name="3">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.productDetail" class="editor"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览弹窗 -->
    <el-dialog
        title="图片预览"
        :visible.sync="previewDialogVisible"
        width="50%">
      <img :src="previewImgUrl" class="previewImg">
    </el-dialog>
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
        {
          "name": "所属游戏",
          "value": "王",
          "type": 1,
          isOK: false,
        },
        {
          "name": "尺寸",
          "value": "王",
          "type": 1,
          isOK: false,
        }
      ],
      // 输入的属性和值
      img_type: 2, // 图片类型
      form: {add: ''},
      inputAttribute: [],
      selectCategoryID: null,
      activeIndex: '0',
      // 封面图信息
      mainPic: null,
      addForm: {
        // 商品详情
        "productStatus": 1,

        "categoryId": 16,
        "productDesc": "测试数据-e简介",
        "productNumber": 100,
        "productPrice": 100.0,
        "productDetail": "",
        "productName": "3",
        "productInfo": [],
        "resources": []
      },
      addFormRules: {
        productName: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        productPrice: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        productNumber: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '请选择商品分类', trigger: 'blur'}
        ],
        resources: [
          {required: true, message: '请上传商品图片', trigger: 'blur'}
        ],
        productInfo: [
          {required: true, message: '设置商品属性', trigger: 'blur'}
        ],
      },
      categoryList: [],
      categoryProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'api/system/file/img/upload',
      uploadFileLimit: 1,
      imgUploadHeaders: { // 上传图片控件的header
        Authorization: sessionStorage.getItem('token')
      },
      previewImgUrl: '',
      previewDialogVisible: false
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
    this.loadCategory()
  },
  watch: {
    // 监听
    'selectCategoryID': 'handleTreeChange'
  },
  methods: {
    //文件上传成功
    fileUploadSuccess(resourceId, resourceType,fileAccessPath) {
      console.log('文件上传成功', resourceId, resourceType, this.addForm.resources)
      if (resourceType === 2){
        this.mainPic = {'resourceId': resourceId, 'resourceType': resourceType,'fileAccessPath':fileAccessPath}
      }else  if (resourceType === 3) {
        this.addForm.resources.push({'resourceId': resourceId, 'resourceType': resourceType,'fileAccessPath':fileAccessPath})
      }

    },
    //文件删除
    fileRemove(resourceUrl) {
      if (this.mainPic.fileAccessPath === resourceUrl){
        this.mainPic = null
        return
      }
      if (this.addForm.resources !== null && this.addForm.resources !== undefined) {
        let index = this.addForm.resources.findIndex(item => ('api'+item.fileAccessPath) === resourceUrl);
        console.log('文件记录', index,resourceUrl,this.addForm.resources[index].fileAccessPath)
        this.addForm.resources.splice(index, 1);
      }
    },

    removeProductInfo(row) {
      const index = this.productInfo.findIndex(item => {
        if (item.name === row.name && item.value === row.value) {
          return true
        }
      });
      this.productInfo.splice(index, 1)
    },
    addProductInfo() {
      console.log("add")
      let info = {
        "name": "",
        "value": "",
        "type": 1,
        isOK: true,
      }
      this.productInfo.push(info)
      console.log(this.productInfo)
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

    // 格式化节点
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
    // 获取所有商品分类
    loadCategory() {
      this.$axios.get('api/shop/product/category/tree').then(resp => {
        if (resp && resp.status === 200) {
          let result = resp.data

          if (result.status !== 200) {
            return this.$message.error('商品列表获取失败')
          }
          this.categoryList = result.data.children
          this.total = this.categoryList.length
        }
      })
    },
    // 树形选择器发生变化
    handleTreeChange() {
      console.log('树形选择器发生变化 ' + this.selectCategoryID)
      this.addForm.categoryId = this.selectCategoryID
    },
    // tab标签页发生切换
    beforeTabLeave(activeName, oldActiveName) {


      if (oldActiveName === '0' && (this.addForm.categoryId == null || this.addForm.categoryId === '')) {
        this.$message.error('请先选择商品分类')
        return false
      }
      if (this.activeIndex === '1') {

        if (this.productInfo.length < 1) {
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
        if (undefined === this.addForm.resources || null === this.addForm.resources || this.addForm.resources.length<1){
          this.$message.error('请上传商品详情图片' )
          return  false
        }

        if (this.mainPic === null || this.mainPic === undefined ) {
          this.$message.error('请上传商品封面图')
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






    // 点击按钮添加商品
    addGoods() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        this.addForm.productInfo = this.productInfo
        this.addForm.resources.push(this.mainPic)
        console.log(this.addForm)
        this.$axios.post('api/shop/product?XDEBUG_SESSION_START=PHPSTORM', this.addForm).then(res => {
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
