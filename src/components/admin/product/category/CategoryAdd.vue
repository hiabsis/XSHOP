<template>
  <div>

    <el-button type="primary" @click="showAddDialog">添加分类</el-button>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addCategoryDialogClose">

      <el-form :model="addCategoryForm" :rules="categoryFormRules" ref="addCategoryFormRef" label-width="100px">
        <el-form-item label="上级分类">
          <el-select v-model="addCategoryForm.parentId" placeholder="请选择">
            <el-option style="width:100%"
                v-for="item in parentCategory"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="addCategoryForm.categoryName"></el-input>
        </el-form-item>

        <el-form-item label="分类图标" >
          <!--      传如上床图片的大小, 图片数量限制, 成功后的操作--需要返回图片的类型和图片的 移除图片的操作 -->
         <UploadModel :imgWeight=150 :imgHeight=150 :limitSize=1 :resourceType=4 @fileUploadSuccess = 'fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>

        </el-form-item>
        <el-form-item label="分类大图" >
          <UploadModel :imgWeight=234 :imgHeight=300 :limitSize=2 :resourceType=5 @fileUploadSuccess = 'fileUploadSuccess' @fileRemove="fileRemove"></UploadModel>
        </el-form-item>
        <el-form-item label="排序" prop="categorySort">
          <el-input v-model="addCategoryForm.categorySort" oninput="this.value = this.value.replace(/[^0-9]/g, '');"></el-input>
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>

    </el-dialog>
  </div>

</template>

<script>

export default {
  name: 'CategoryAdd',
  components: {},
  data () {
    return {
      // define the default value
      value: null,
      // define options
      addDialogVisible: false, // 控制添加分类对话框的显示与隐藏
      addCategoryForm: {
        categoryName: null,
        categoryCode: null,
        parentId: null,
        categoryStatus:'1',
        categorySort:'1',
        resources:[]
      },
      iconInfo:null,
      // 表单校验规则
      categoryFormRules: {
        categoryName: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
        categoryCode: [
          {required: true, message: '请输入分类分类编码', trigger: 'blur'}
        ]
      }

    }
  },
  props: {
    parentCategory: null
  },
  created() {
    this.addCategoryForm = {
      categoryName: null,
      parentId: null,
      categoryStatus:'1',
      categorySort:1,
      categoryType:'1',
      resources:[]
    };
  },
  methods: {
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
    // 点击添加分类的按钮，展示对话框
    showAddDialog () {
      this.addDialogVisible = true
    },

    // 选择项发送变化触发的函数
    parentCategoryChange () {
      // 如果selectedKeys.length大于0，说明选中了父级分类。等于0，说明没有选择父级分类
      let selectedKeys = this.selectedKeys
      if (selectedKeys.length > 0) {
        this.addCategoryForm.parent_id = selectedKeys[selectedKeys.length - 1]
        // this.addCategoryForm.cat_level = selectedKeys.length;
        return
      }
      this.addCategoryForm.cat_pid = 0
      this.addCategoryForm.cat_level = 0
    },

    // 点击按钮添加新的分类
    addCategory () {
      if (this.addCategoryForm.parent_id == null || this.addCategoryForm.parent_id === '') {
        this.addCategoryForm.parent_id = '0'
      }
      this.$refs.addCategoryFormRef.validate(valid => {
        if (!valid) return

        this.$axios
          .post('api/shop/product/category?XDEBUG_SESSION_START=PHPSTOR', this.addCategoryForm).then(resp => {
            if (resp && resp.status === 200) {

              let result = resp.data
              if (result.status !== 200) {
                this.$message.error(result.data)
                return
              }
              this.addCategoryForm = []
              this.$emit('category-list')
              this.$message({
                message: '添加分类成功',
                type: 'success'
              })
              this.$emit('category-list')
              this.addDialogVisible = false
            }
          })
      })
    },

    // 监听对话框的关闭事件，重置表单数据
    addCategoryDialogClose () {
      this.$refs.addCategoryFormRef.resetFields()
      this.selectedKeys = []
      this.addCategoryForm.parentId = 0
      this.addCategoryForm.categoryName = 0
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
