import request from '@/utils/request'

export default {
    //1.讲师列表（条件查询分页）
    //current   当前页
    //limit 每页记录数
    //teacherQuery  查询条件
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            //方式一：
            // url: '/eduservice/teacher/pageTeacherCondition/'+current_+"/"+limit, 
            //方式二：
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`, 
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据，则此处需要使用data，data表示，将对象转换成json传递到接口
            data: teacherQuery
          })
    },

    //删除讲师
    removeDataById(id){
        return request({
            url: `/eduservice/teacher/${id}`,
            method:'delete'
        })
    },
    //添加讲师
    add(teacher){
        return request({
            url:'/eduservice/teacher/addTeacher',
            method:'post',
            data:teacher
        })
    },
    //根据id查询讲师
    getTeacherInfo(id){
        return request({
            url:`/eduservice/teacher/findTeacherByID/${id}`,
            method:'get' 
        })
    },
    //修改讲师
    update(teacher){
        return request({
            url:'/eduservice/teacher/updateTeacherByID',
            method:'post',
            data:teacher
        })
    }
}

