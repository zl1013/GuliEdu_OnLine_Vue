<template>
  <div class="chart-container">
     <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
    //引入调用teacher.js文件
    import teacherApi from '@/api/edu/teacher.js'
export default {
    data(){//定义变量和初始值
        return{
            teacher:{
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: ''
            },
            saveBtnDisabled:false   //保存按钮是否禁用
        }
    },
    created(){
        this.init()
    },
    watch: {    //监听
    $route(to, from) {  //路由变化方式、路由发生变化，方法就会执行
      console.log('watch $route')
      this.init()
    }
  },
    methods:{
        init(){
            if (this.$route.params && this.$route.params.id) {
                const id = this.$route.params.id
                this.getInfo(id)
            }else{  //
                this.teacher = {}
            }
        },
        getInfo(id){
            teacherApi.getTeacherInfo(id)
            .then(res => {
                this.teacher = res.data.teacher
            })
        },
        //判断是修改还是添加
        saveOrUpdate(){
            //根据teacher是否有id值，修改有id，添加没有id
            if(!this.teacher.id){
                this.add()
            }else{
                this.update()
            }
        
        },
        //修改
        update(){
            teacherApi.update(this.teacher)
            .then(res => {
                this.$message({
                    message: res.message,
                    type: 'success'
                    });
                //路由跳转
                this.$router.push({ path: '/teacher/list'})
            })
        },
        //添加
        add(){
            teacherApi.add(this.teacher)
            .then(res => {
                this.$message({
                    message: res.message,
                    type: 'success'
                    });
                //路由跳转
                this.$router.push({ path: '/teacher/list'})
            })
        }

    }
    
}
</script>