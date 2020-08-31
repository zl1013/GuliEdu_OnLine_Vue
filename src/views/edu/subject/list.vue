<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>
<script>
import subject from '@/api/edu/subject'
export default {
    data() {
    return { 
      filterText: '',
      subjectList: [],//所有分类数据
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val)
    }
  },
  created() {
    this.getAllSubjectList()
  },
  methods: {
    getAllSubjectList(){
        subject.getSubjectList()
        .then(res => {
            this.subjectList = res.data.list
        })
    },
    //优化前端过滤功能
    filterNode(value, data) {
       if (!value) return true
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>