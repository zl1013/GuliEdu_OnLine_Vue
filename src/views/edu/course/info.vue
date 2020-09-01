<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">
    <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
    </el-form-item>
    <!-- 所属分类：级联下拉列表 -->
    <!-- 一级分类 -->
    <el-form-item label="课程类别">
        <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="一级分类" @change="subjectLevelOneChanged">
            <el-option
                v-for="subject in subjectNestedList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>
    <!-- 二级分类 -->

        <el-select 
            v-model="courseInfo.subjectId" 
            placeholder="二级分类">
            <el-option
                v-for="subject in subSubjectList"
                :key="subject.value"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>
    </el-form-item>
    <!-- 课程讲师 -->
    <el-form-item label="课程讲师">
    <el-select
        v-model="courseInfo.teacherId"
        placeholder="请选择">
        <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
    </el-form-item>
    <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
    </el-form-item>

    <!-- 课程简介-->
    <!-- <el-form-item label="课程简介">
        <el-input v-model="courseInfo.description" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
    </el-form-item> -->

    <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
    </el-form-item>
    
    <!-- 课程封面-->
    <el-form-item label="课程封面">
        <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
        </el-upload>
    </el-form-item>
    <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
    </el-form-item>
    <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
    </el-form-item>
    </el-form>
  </div>


</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymcea'//引入组件
export default {
    //声明组件
    components: { Tinymce },
  data() {
    return {
      BASE_API:process.env.VUE_APP_BASE_API,
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo:{
        title: '',
        subjectParentId: '',//一级分类ID
        subjectId: '',//二级分类ID
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://guliedu--online.oss-cn-beijing.aliyuncs.com/cover/cover.jpg',
        price: 0
      },
      courseId:'',
      teacherList:[],//封装所有讲师数据
      subjectNestedList:[],//封装所有一级分类数据
      subSubjectList:[]//封装所有二级分类数据
    }
  },
  created() {

      //获取路由id值
    if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getTeacherList()
        //调用根据id查询课程信息
        this.getCourseInfoById()    
    }else{
        //初始化courseInfo数据
        this.courseInfo = {
            title: '',
            subjectParentId: '',//一级分类ID
            subjectId: '',//二级分类ID
            teacherId: '',
            lessonNum: 0,
            description: '',
            cover: 'https://guliedu--online.oss-cn-beijing.aliyuncs.com/cover/cover.jpg',
            price: 0
        },
      //初始化讲师数据
      this.getTeacherList()
        //初始化一级分类数据
        this.getSubjectList()
    
    }      
  },
  methods: {
    getCourseInfoById(){
        course.getCourseInfoById(this.courseId)
        .then(res => {
            this.courseInfo = res.data.courseInfoVo
            //查询所有分类
            subject.getSubjectList()
            .then(res => {
                //获取所有一级分类
                this.subjectNestedList = res.data.list
                //遍历所有分类，包含一级和二级
                  for (let index = 0; index < this.subjectNestedList.length; index++) {
                    //每个一级分类
                    const element = this.subjectNestedList[index];
                    if(element.id === this.courseInfo.subjectParentId){
                        this.subSubjectList = element.children
                    }  
                }
            })
        })
    },
    updateCourseInfoById(){
        course.updateCourseInfoById(this.courseInfo)
    },
    beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
    },
    handleAvatarSuccess(res){
        this.courseInfo.cover = res.data.url
    },
    subjectLevelOneChanged(value){
        //框架底层做了封装，value值即为点击项的id值
        //点击某个一级分类，触发change，显示对应的二级分类
        //遍历所有分类，包含一级和二级
        for (let index = 0; index < this.subjectNestedList.length; index++) {
            //每个一级分类
            const element = this.subjectNestedList[index];
            if(element.id === value){
                this.subSubjectList = element.children
                //把二级分类的ID值清空
                this.courseInfo.subjectId = ''
            }  
        }
    },
    getSubjectList(){
        subject.getSubjectList()
        .then(res => {
            this.subjectNestedList = res.data.list
        })
    },
    getTeacherList(){
        course.getTeacherList()
        .then(res => {
            this.teacherList = res.data.list
        })
      },
      add(){
        course.addCourseInfo(this.courseInfo)
            .then( res => {
                //提示
                this.$message({
                type: 'success',
                message: res.message
                });
                //跳转第二步
                this.$router.push({ path: '/course/chapter/' + res.data.courseId})
        })
      },
      update(){
        course.updateCourseInfoById(this.courseInfo)
            .then( res => {
                //提示
                this.$message({
                type: 'success',
                message: res.message
                });
                //跳转第二步
                this.$router.push({ path: '/course/chapter/' + this.courseId})
        })
      },
    saveOrUpdate(){
        //判断是修改还是添加
        if(!this.courseInfo.id){
            //添加
            this.add()
        }else{
            this.update()
        }
    }
  }
}
</script>

<style scoped>
    .tinymce-container {
        line-height: 29px;
    }
</style>