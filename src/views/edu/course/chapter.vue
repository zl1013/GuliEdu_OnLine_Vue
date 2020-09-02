<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                  <el-button type="text"  @click.native="openVideo(chapter.id)">添加小节 </el-button>
                  <el-button type="text"  @click.native="openEditChapter(chapter.id)">编辑</el-button>
                  <el-button type="text" @click.native="deleteChapter(chapter.id)">删除</el-button>
                </span>
            </p>
            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click.native="openEditVideo(video.id)">编辑</el-button>
                            <el-button type="text" @click.native="deleteVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>
    <!-- <ul>
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        {{chapter.title}}
        <ul>
          <li v-for="video in chapter.children" :key="video.id">
            {{video.title}}
          </li>  
        </ul>
      </li>
    </ul> -->

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled:false,
      chapterVideoList:[],
      courseId:'',//课程id
      chapter:{
        courseId:'',
        id:'',
        title:'',
        sort:'0'
      },
      video:{
        id:'',
        title:'',
        sort:'0',
        isFree:false
      },
      dialogChapterFormVisible:false, //章节弹窗
      dialogVideoFormVisible:false  //小节弹窗
    }
  },
  created() {
    //获取路由id值
    if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getAllChapter()
    }
  },
  methods: {
//==========================小节操作==========================
  openEditVideo(videoId){
      this.dialogVideoFormVisible = true
      video.getVideo(videoId)
      .then(res => {
        this.video = res.data.video
      })
  },
  deleteVideo(videoId){
    this.$confirm('此操作将永久删除该课时记录 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      })
      .then(() => {
        //调用删除方法
        video.deleteVideo(videoId)
        .then(res => {
          if(res.code === 20000){
            this.$message({
            message: res.message,
            type: 'success'
          });
          }else{
            this.$message.error(res.message);
          }
          this.getAllChapter()
        })
      }).catch(res =>{
        this.$message({
          showClose: true,
          message: '取消删除'
        });
    })
  },
  //添加小节
  openVideo(chapterId){
    //弹框
    this.dialogVideoFormVisible = true
    //设置章节ID
    this.video.chapterId = chapterId
    this.video.courseId = this.courseId
      this.video.title = ''
      this.video.sort = '0'
      this.video.isFree = false

  },
  addVideo(){
    //设置课程id
    this.video.courseId = this.courseId
    video.addVideo(this.video)
    .then(res => {
      //提示信息
        if(res.code == 20000){
          this.$message({
            type: 'success',
            message: res.message
          });
          //关闭弹窗
          this.dialogVideoFormVisible = false
          //界面刷新   
          this.getAllChapter()
        }else{
          this.$message.error(res.message);
        }
    })
  },
  updateVideo(){
    video.updateVideo(this.video)
    .then(res => {
        if(res.code === 20000){
          this.$message({
            message: res.message,
            type: 'success'
          });
          //关闭弹窗
          this.dialogVideoFormVisible = false
          //界面刷新
          this.getAllChapter()
        }else{
          this.$message.error(res.message);
        }
        this.getAllChapter()
      })
  },

  saveOrUpdateVideo(){
    if(!this.video.id){
      this.addVideo()
    }else{
      this.updateVideo()
    }
  },


//==========================章节操作==========================
    openEditChapter(id){
      //弹窗
      this.dialogChapterFormVisible = true
      //调用方法
      this.getChapterById(id)
    },
    openChapterDialog(){
      //弹框
      this.dialogChapterFormVisible = true
      //表单数据清空
      this.chapter.id = ''
      this.chapter.title = ''
      this.chapter.sort = '0'
    },
    //根据课程id查询所有章节
    getAllChapter(){
       chapter.getAllChapter(this.courseId)
       .then( res => {
         this.chapterVideoList = res.data.list
       })
    },
    //添加章节
    addChapter(){
      chapter.addChapter(this.chapter)
      .then(res => {
        //提示信息
        if(res.code == 20000){
          this.$message({
            type: 'success',
            message: res.message
          });
          //关闭弹窗
          this.dialogChapterFormVisible = false
          //界面刷新
          this.getAllChapter()
        }else{
          this.$message.error(res.message);
        }
      })

    },
    //根据id查询章节
    getChapterById(chapterId){
      chapter.getChapterById(chapterId)
      .then(res => {
          this.chapter = res.data.chapter
      })
    },
    //修改章节
    updateChapter(){
      chapter.updateChapter(this.chapter)
      .then(res => {
        if(res.code === 20000){
          this.$message({
            message: res.message,
            type: 'success'
          });
          //关闭弹窗
          this.dialogChapterFormVisible = false
          //界面刷新
          this.getAllChapter()
        }else{
          this.$message.error(res.message);
        }
        this.getAllChapter()
      })
    },
    //根据章节id删除章节
    deleteChapter(id){
      this.$confirm('此操作将永久删除章节记录 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        })
        .then(() => {
          //调用删除方法
          chapter.deleteChapter(id)
          .then(res => {
            if(res.code === 20000){
              this.$message({
              message: res.message,
              type: 'success'
            });
            }else{
              this.$message.error(res.message);
            }
            this.getAllChapter()
          })
        }).catch(res =>{
          this.$message({
            showClose: true,
            message: '取消删除'
          });
        })
      },
    saveOrUpdate(){
      this.chapter.courseId = this.courseId
      if(!this.chapter.id){
        this.addChapter()
      }else{
        this.updateChapter()
      }
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId})
    },
    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/'  + this.courseId})
    }
  }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  /* float: left; */
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>