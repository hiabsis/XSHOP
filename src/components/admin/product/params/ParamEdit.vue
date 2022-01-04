<template>
  <div class="editDialog">
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(attributeId)">
      编辑
    </el-button>

    <!-- 修改动态参数/静态属性的对话框 -->
    <el-dialog
      :title="'修改'"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attribute_name">
          <el-input v-model="editForm.attribute_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attribute_value">
          <el-input v-model="editForm.attribute_value"  placeholder="多值用;隔开"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParam">确 定</el-button>


      </span>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   getParamByIdRequest,
//   editParamByIdRequest
// } from 'network/goods';

export default {
  name: "ParamEdit",
  props: {
    titleText: {
      type: String,
      default: ""
    },
    attribute_id: {
      type: Number,
      default: 0
    },
    attribute_name: {
      type: String,
      default: ''
    },
    attribute_value: {
      type: String,
      default: ''
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
      editDialogVisible: false,
      editForm: {
        id: null,
        attribute_name: null,
        attribute_value:null
      },
      formRules: {
        attribute_name: [
          {required: true, message: '请输入' + this.titleText + '名称', trigger: 'blur'}
        ],
        attribute_value:[
          {required: true, message: '请输入请输入属性值', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // // 点击按钮展示修改的对话框
    // showEditDialog(attrId) {
    //   this.editDialogVisible = true;
    //   this.editForm.attribute_name = this.attribute_name;
    //   this.editForm.attribute_value = this.attribute_value;
    // },

    // 监听修改对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },

    // 修改参数信息
    editParam() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.editForm.id = this.attribute_id;
        this.$axios.put('/shop/product/attribute',this.editForm).then(res => {
          let result = res.data;
          if (result.status !== 200) {
            this.$message.error('修改失败');
            return;
          }
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.$emit('param-list');
          this.editDialogVisible = false;
        })
      })
    },
  }
}
</script>

<style scoped>
.editDialog {
  display: inline-block;
  margin-right: 5px;
}
</style>
