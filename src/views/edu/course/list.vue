<template>
  <div class="chart-container">
    
<!--课程列表-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="状态">
          <el-option :value= "1" label="已发布"/>
          <el-option :value= "0" label="未发布"/>
          <el-option :value= "2" label="所有"/>
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

<!-- 表格 -->
    <el-table
     border
      :data="tableData">
      <el-table-column
        label="序号"
        width="150"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" />
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="150"/>
      <el-table-column prop="viewCount" label="浏览数量" width="150"/>
      <el-table-column prop="gmtCreate" label="添加时间" width="300"/>
      <el-table-column label="操作" width="450" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" >编辑课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

       <!-- 分页 -->
    <el-pagination
      :current-page="page" 
      :page-size="limit"  
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getCourseList"
    />

  </div>
</template>
<script>

    import course from '@/api/edu/course.js'
export default {
    //写核心代码位置
    //方式一：
    // data:{
    // },
    //方式二：（建议）
    data(){//定义变量和初始值
        return{
            tableData:null,  //查询之后接口返回集合
            page:1, //当前页
            limit:5,   //每页记录数
            total:0, //总记录数
            courseQuery:{
              title: '',
              status: ''
            } //条件封装对象
        }
    },
    created(){//页面渲染之前执行，一般调用methods定义的方法
        this.getCourseList()
    },
    methods:{
      //创建具体的方法，调用js定义的方法
        //讲师列表的方法
        getCourseList(page = 1){
            this.page = page
            course.getCourseList(this.page,this.limit,this.courseQuery)
            .then(res => {
                //response接口返回的数据
                this.tableData = res.data.courses
                this.total = res.data.total
            }) //请求成功
            .catch(error => {
                console.log(error)
            })   //请求失败
        },
        resetData(){
            //清空表单输入项数据
            this.courseQuery = {}
            //查询所有课程数据
            this.getCourseList()
        },
        removeDataById(id){
            this.$confirm('此操作将永久删除该课程记录 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    //调用删除方法
                    course.removeDataById(id)
                    .then( res => {
                        this.$message({
                            message: res.message,
                            type: 'success'
                            });
                        this.getCourseList()
                })
            });
        }
    }   
}
</script>