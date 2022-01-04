<template>
  <div>

    <el-upload ref="pic"
               list-type="picture-card"
               action=""
               :limit="limitSize===null?1:limitSize"
               :auto-upload="false"
               :on-change="changeUpload"
               :file-list="files"
               :on-remove="handleImgRemove"
               :before-upload="beforeUpload"
               :on-success="handleAvatarSuccess" :show-file-list="true">
<!--      <img :src="inputForm.pic" class="avatar">-->
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip" class="el-upload__tip" v-if="inputForm.pic === undefined">请上传.jpg或.png的图片文件</div>
    </el-upload>

    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>

      <div class="cropper-content cropper"  >
        <div class="cut">
          <div class="cropper" style="text-align:center">
            <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
                        :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
                        :original="option.original" :autoCrop="option.autoCrop" :fixed="option.fixed"
                        :fixedNumber="option.fixedNumber" :centerBox="option.centerBox" :infoTrue="option.infoTrue"
                        :max-img-size="option.max" :high="option.high"
                        :auto-crop-width="imgWeight===null?option.autoCropWidth:imgWeight" :auto-crop-height="imgHeight===null?option.autoCropHeight:imgHeight"
                        :fixedBox="option.fixedBox"></vueCropper>
          </div>
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

export default {
  name: 'UploadModel',
  props: {
    parentCategory: null,
    imgWeight:null,
    imgHeight:null,
    limitSize:null,
    resourceType: null,
    files: {
      Type:Array,
      default:function(){
        return [];
      },
    },
  },

  data() {
    return {
      uploadFileName:'1.png',
      dialogVisible: false,
      picList : [],
      inputForm:[],
      option:{
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 1000,
        autoCropHeight: 1000,
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        // fixedNumber: [10, 10], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: true, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        size: 1,
        canMove: true,
        high: true,
        max: 99999,
      }
    }
  },

  methods: {
    beforeUpload(){
      if (this.files.length === this.limitSize){
        this.$message.error('超过文件最大上传数量');
        return false
      }
    },
    // 处理移除图片的操作
    handleImgRemove(file) {
      let removeUrl = file.url
      let index = this.files.findIndex(item => {
        return item.url === removeUrl
      })
      console.log('handleImgRemove',removeUrl)
      this.files.splice(index, 1)
      this.$emit('fileRemove',removeUrl)
    },
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

      this.uploadFileName = file.name;
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
        this.$axios.post("api/system/file/img/upload",fd,{
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params:{'fileName':this.uploadFileName,'XDEBUG_SESSION_START':'PHPSTORM'},
        }).then( res => {
          console.log("图片上传",res.data.data)
          if (res.status === 200){
            this.$emit('fileUploadSuccess',res.data.data.resourceId,this.resourceType,res.data.data.resourceAccessPath)
            if (this.files === null){
              this.files = [];
            }
            this.files.push({'name':this.uploadFileName,'url':'api/'+res.data.data.resourceAccessPath,'id':res.data.data.resourceId})
          }else {
            this.$message.error(res.data);
          }
          this.dialogVisible = false;



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
  height: 500px;

}

</style>

