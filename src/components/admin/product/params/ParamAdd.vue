<template>
  <div>
    <el-button style="margin-bottom: 10px; float: left;"  type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
      <slot name="title">添加参数</slot>
    </el-button>

    <!-- 添加动态参数/静态属性的对话框 -->
    <el-dialog
            :title="'添加' "
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attribute_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_name"  placeholder="多值用;隔开">
          <el-input v-model="addForm.attribute_value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // import {addParamRequest} from 'network/goods';

  export default {
    name: "ParamAdd",
    props: {
      titleText: {
        type: String,
        default: ""
      },
      isBtnDisabled: {
        type: Boolean,
        default: false
      },
      categoryId: {
        type: Number,
        default: 0
      },
      activeName: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        addDialogVisible:false,
        addForm: { // 添加表单的规则
          attribute_name: null,
          attribute_value: null,
          category_id: null,
          attribute_type:null

        },
        formRules: {
          attribute_name: [
            {required: true, message: '请输入 '+ this.titleText + "名称", trigger: 'blur'}
          ],
          attribute_value:[
            {required: true, message: '请输入属性值', trigger: 'blur'}
          ]
        },
      }
    },
    methods:{
      // 监听添加对话框的关闭
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
      },

      // 添加参数
      addParam() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return;
          this.addForm.attribute_type = parseInt(this.activeName)
          this.addForm.category_id =this.categoryId

          this.$axios.post('/shop/product/attribute',this.addForm).then(res => {
            let result = res.data;
            if (result.status !== 200) {
              this.$message.error('添加参数成功');
              return;
            }
            this.$message({
              message: '添加参数成功',
              type: 'success'
            });

            this.$emit('param-list');
            this.addDialogVisible = false;
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
