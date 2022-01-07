<template>
  <div>
    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showAddDialog()">编辑</el-button>

    <!-- 添加菜单的对话框 -->
    <el-dialog
        title="编辑"
        :visible.sync="addDialogVisible"
        @close="addCategoryDialogClose">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="一级菜单" name="first">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="菜单名称" prop="name_zh" class="required label-center-align">
              <el-input v-model="form.name_zh" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon" class="label-center-align">
              <el-input v-model="form.icon" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="input65283" class="label-center-align">
              <el-input v-model="form.sort" type="text" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="子菜单" name="second">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="上级菜单" >
              <el-cascader :options="menuOptions"    v-model="selectMenu" :props="{ checkStrictly: true,  value: 'id',  label: 'label', }" :show-all-levels="false"></el-cascader>
            </el-form-item>
            <el-form-item label="菜单名称" prop="name_zh" class="required label-center-align">
              <el-input v-model="form.name_zh" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="path" class="required label-center-align">
              <el-input v-model="form.path" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="前端组件" prop="component" class="required label-center-align">
              <el-input v-model="form.component" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="路由名称" prop="name" class="required label-center-align">
              <el-input v-model="form.name" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon" class="label-center-align">
              <el-input v-model="form.icon" type="text" clearable></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="input65283" class="label-center-align">
              <el-input v-model="form.sort" type="number" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>

    </el-dialog>
  </div>

</template>

<script>

export default {
  name: 'MenuEditor',
  components: {},
  data() {
    return {
      form:{
        name_zh: "#",
        component: "#",
        path: "#",
        name: "#",
        icon: "#",
        sort: 1,
        parent_id:-1
      },
      selectMenu: '',
      activeName: 'first',
      // define the default value
      value: null,
      // define options
      addDialogVisible: false, // 控制添加菜单对话框的显示与隐藏
      iconInfo: null,
      // 表单校验规则
      rules: {
        name_zh: [{
          required: true,
          message: '字段值不可为空',
        }],
        component: [{
          required: true,
          message: '字段值不可为空',
        }],
        path: [{
          required: true,
          message: '字段值不可为空',
        }],
        name: [{
          required: true,
          message: '字段值不可为空',
        }],
      }

    }
  },
  props: {
    menuOptions: null,
    menu:null
  },
  watch: {
    selectMenu: function (){
      this.form.parent_id = parseInt(this.selectMenu[this.selectMenu.length-1])
    },
  },
  activated() {
    this.form = this.menu
  },
  created() {

  },
  methods: {

    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 点击添加菜单的按钮，展示对话框
    showAddDialog() {
      this.addDialogVisible = true
    },



    // 点击按钮添加新的菜单
    addCategory() {
      if (this.form.parent_id == null || this.form.parent_id === '') {
        this.form.parent_id = '0'
      }
      this.$refs.formRef.validate(valid => {
        if (!valid) return

        this.$axios
            .post('api/admin/menu/save', this.form).then(resp => {
          if (resp && resp.status === 200) {

            let result = resp.data
            if (result.status !== 200) {
              this.$message.error(result.data)
              return
            }
            this.form = []
            this.$emit('menu-list')
            this.$message({
              message: '添加菜单成功',
              type: 'success'
            })
            this.$emit('menu-list')
            this.addDialogVisible = false
          }
        })
      })
    },

    // 监听对话框的关闭事件，重置表单数据
    addCategoryDialogClose() {
      // this.$refs.formRef.resetFields()
      this.form = {
        name_zh: "#",
        component: "#",
        path: "#",
        name: "#",
        icon: "#",
        sort: 1,
        parent_id:-1
      }
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
