<template>
  <div class="cropper">
    <el-upload ref="pic" list-type="picture-card"
               action=""
               :auto-upload="false"
               :on-change="changeUpload"
               :on-success="handleAvatarSuccess" :show-file-list="false">
      <img v-if="inputForm.pic" :src="inputForm.pic" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip" class="el-upload__tip">请上传长宽为1270*622尺寸并且格式为.jpg或.png的图片文件</div>
    </el-upload>

    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
                      :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
                      :original="option.original" :autoCrop="option.autoCrop" :fixed="option.fixed"
                      :fixedNumber="option.fixedNumber" :centerBox="option.centerBox" :infoTrue="option.infoTrue"
                      :fixedBox="option.fixedBox"></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  name: 'Test',
  data() {
    return {
      dialogVisible: false,
      inputForm:[],
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1270, 622], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isJPG = testmsg === 'jpg'
      const isPNG = testmsg === 'png'
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
        return
      }
      var reader = new FileReader();
      let data = []
      reader.onload = (e) => {
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        }
        else {
          data = e.target.result
        }
      }
      console.log(data,isLt2M,fileList)
      this.$nextTick(() => {
        this.option.img = file.url
        this.dialogVisible = true
      })
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        let fd = new FormData()
        fd.append('file', data)
        fd
        this.$axios.post("api/system/file/img/upload?XDEBUG_SESSION_START=PHPSTORM",fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(({ data }) => {
          if (data.code === 200) {
            this.inputForm.pic = data.url;  // 返回路径赋值
            this.dialogVisible = false
          } else {
            this.$message.error(data.msg);
          }
        })
      })
    },
  }
}
</script>

<style>
/* 截图 */
.cropper {
  width: auto;
  height: 300px;
}
</style>
