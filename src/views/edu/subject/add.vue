<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="'/download/template.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
            
            ref="upload"
            :auto-upload="false"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :disabled="importBtnDisabled"
            :limit="1"
            :action="BASE_API+'/eduservice/subject/addSubject'"
            name="file"
            accept="application/vnd.ms-excel">
            <!--ref="upload" 唯一标示，相当于id -->
            <!--accept="application/vnd.ms-excel"> 上传文件类型 -->
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
    data(){
        return{
            BASE_API: process.env.VUE_APP_BASE_API,   // 接口API地址
            OSS_PATH: process.env.OSS_PATH,   // 阿里云OSS地址
            importBtnDisabled: false,         // 按钮是否禁用,
            loading: false
        }

    },
    created(){

    },
    methods:{
        //提交
        submitUpload(){
            //使用vue的表单提交
            this.fileUploadBtnText = '正在上传'
            this.importBtnDisabled = true
            this.loading = true
            //js: document.getElementById("upload").submit()
            this.$refs.upload.submit()
        },
        //上传成功
        //res接收接口返回数据
        fileUploadSuccess(res){
            //提示信息
            this.loading = false
            this.$message({
            type: 'success',
            message: res.message
            })
            //跳转课程分类列表
            //路由跳转
            this.$router.push({path:'/subject/list'})
        },
        //上传失败
        //res接收接口返回数据
        fileUploadError(res){
            this.loading = false
            this.$message({
            type: 'error',
            message: res.message
    })
        }

    }
    
}
</script>