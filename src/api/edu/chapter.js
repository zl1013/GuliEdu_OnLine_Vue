import request from '@/utils/request'

export default {

   //根据课程id查询所有章节
   getAllChapter(courseId){
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`, 
            method: 'get',
          })
    },
    //添加章节
    addChapter(chapter){
        return request({
            url: '/eduservice/chapter/addChapter', 
            method: 'post',
            data: chapter
          })
    },
    //根据id查询章节
    getChapterById(chapterId){
        return request({
            url: `/eduservice/chapter/getChapterById/${chapterId}`, 
            method: 'get',
          })
    },
    //修改章节
    updateChapter(chapter){
        return request({
            url: '/eduservice/chapter/updateChapter', 
            method: 'put',
            data: chapter
          })
    },
    //根据章节id删除章节
    deleteChapter(chapterId){
        return request({
            url: `/eduservice/chapter/deleteChapter/${chapterId}`, 
            method: 'delete',
          })
    }
}

