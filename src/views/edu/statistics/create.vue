<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        @click="create()">生成</el-button>
    </el-form>
  </div>
</template>
<script>
import statisticsApi from '@/api/edu/statistics'
export default {
    data(){
        return{
            day:'',
            btnDisabled: false
        }
    },
    create(){

    },
    methods:{
        create(){
            statisticsApi.createStatisticsDate(this.day)
            .then(res => {
                this.$message({
                type: 'success',
                message: res.message
              })
              this.$router.push({path:'/statistics/show'})
            })
        }
    }
    
}
</script>