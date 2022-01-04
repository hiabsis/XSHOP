<template>
  <div class="editDialog">
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog()">编辑</el-button>
    <!-- 编辑的对话框 -->

    <el-dialog

        title="编辑"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose">
      <el-form :model="addCategoryForm" :rules="categoryFormRules" ref="addCategoryFormRef" label-width="100px">
        <el-form-item label="上级分类">
          <el-select v-model="addCategoryForm.parentId" placeholder="请选择">
            <el-option style="width:100%"
                       v-for="item in parentCategory"
                       :key="item.categoryId"
                       :label="item.categoryName"
                       :disabled="item.categoryId === addCategoryForm.categoryId"
                       :value="item.categoryId">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="addCategoryForm.categoryName"></el-input>
        </el-form-item>

        <el-form-item label="分类图标">

          <!--      传如上床图片的大小, 图片数量限制, 成功后的操作--需要返回图片的类型和图片的 移除图片的操作 加入图片-->
          <UploadModel :imgWeight=150 :imgHeight=150 :limitSize=1 :resourceType=4
                       :files="getImgFiles(addCategoryForm.resources,4)" @fileUploadSuccess='fileUploadSuccess'
                       @fileRemove="fileRemove"></UploadModel>


        </el-form-item>
        <el-form-item label="分类大图">
          <UploadModel :imgWeight=234 :imgHeight=300 :limitSize=2 :resourceType=5 @fileUploadSuccess='fileUploadSuccess'
                       :files="getImgFiles(addCategoryForm.resources,5)"
                       @fileRemove="fileRemove"></UploadModel>

        </el-form-item>
        <el-form-item label="排序" prop="categorySort">
          <el-input v-model="addCategoryForm.categorySort"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '');"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="categoryStatus">
          <el-radio v-model="addCategoryForm.categoryStatus" label="1">显示</el-radio>
          <el-radio v-model="addCategoryForm.categoryStatus" label="0">隐藏</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="categoryType">
          <el-radio v-model="addCategoryForm.categoryType" label="1">首页推荐</el-radio>
          <el-radio v-model="addCategoryForm.categoryType" label="0">普通标签</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   getCategoryByIdRequest,
//   editCategoryByIdRequest
// } from 'network/goods';

export default {
  name: 'CategoryEdit',
  props: {
    row: null,
    id: {
      type: Number,
      default: 0
    },
    parentCategory: null,
    addCategoryForm: null
  },
  data() {
    return {
      typeOptions: [
        {
          value: 0,
          label: '普通标签'
        }, {
          value: 1,
          label: '首页推送'
        }
      ],
      editDialogVisible: false,
      categoryFormRules: {
        categoryName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ]
      },

    }
  },
  methods: {
    getImgFiles(data, type) {
      let res = []
      for (let i=0;i<data.length;i++){
        if (data[i].resourceType === type){

          res.push( {'name':'update.png','url':'api'+data[i].fileAccessPath,'id':data[i].id})
        }
      }
      return res;
    },
    //文件上传成功
    fileUploadSuccess(resourceId, resourceType,fileAccessPath) {

      this.addCategoryForm.resources.push({'resourceId': resourceId, 'resourceType': resourceType,'fileAccessPath':fileAccessPath})
    },
    //文件删除
    fileRemove(resourceUrl) {

      if (this.addCategoryForm.resources !== null && this.addCategoryForm.resources !== undefined) {
        let index = this.addCategoryForm.resources.findIndex(item => ('api'+item.fileAccessPath) === resourceUrl);

        this.addCategoryForm.resources.splice(index, 1);

      }

    },
    // 编辑
    showEditDialog() {
      this.editCategoryForm = this.row
      this.editDialogVisible = true

    },

    // 监听编辑的弹框的关闭事件
    editDialogClose() {
      this.$refs.addCategoryFormRef.resetFields()
    },

    // 点击按钮确定编辑
    editCategory() {

      this.$refs.addCategoryFormRef.validate(valid => {
        if (!valid) return

        if (this.editCategoryForm.category_status) {
          this.editCategoryForm.category_status = 1
        } else {
          this.editCategoryForm.category_status = 0
        }

        this.$axios
            .put('/api/shop/product/category?XDEBUG_SESSION_START=PHPSTORM', this.editCategoryForm).then(resp => {
          if (resp && resp.status === 200) {

            this.$emit('category-list')
            this.$message({
              message: '修改分类成功',
              type: 'success'
            })
            // 隐藏弹窗
            this.editDialogVisible = false

            // 重新获取角色列表
            this.$emit('category-list')
          }
        })

      })
    }
  }
}
</script>

<style scoped>
.editDialog {
  display: inline-block;
  margin-right: 5px;
}
</style>
