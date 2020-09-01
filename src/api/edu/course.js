import request from '@/utils/request'

export default {

   //添加课程信息
    addCourseInfo(courseInfo){
        return request({
            url: '/eduservice/course/addCourseInfo', 
            method: 'post',
            data: courseInfo
          })
    },
    //查询所有讲师
    getTeacherList(){
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get',
        })
    },
    //根据课程id查询课程信息
    getCourseInfoById(courseId){
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //根据课程id修改课程信息
    updateCourseInfoById(courseInfo){
        return request({
            url: '/eduservice/course/updateCourseInfo',
            method: 'post',
            data: courseInfo
        })
    },
    //查询信息
    getPublishCourseInfo(courseId){
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`, 
            method: 'get'
          })
    },
    //课程发布
    publish(courseId){
        return request({
            url: `/eduservice/course/publish/${courseId}`, 
            method: 'get'
          })
    }

}

