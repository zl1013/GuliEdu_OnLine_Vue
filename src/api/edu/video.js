import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video){
        return request({
            url: '/eduservice/video/addVideo', 
            method: 'post',
            data: video
          })
    },
    //根据id查询小节
    getVideo(videoId){
        return request({
            url: `/eduservice/video/getVideo/${videoId}`, 
            method: 'get',
          })
    },
    //修改小节
    updateVideo(video){
        return request({
            url: '/eduservice/video/updateVideo', 
            method: 'put',
            data: video
          })
    },
    //根据小节id删除小节
    deleteVideoByid(videoId){
        return request({
            url: `/eduservice/video/deleteVideo/${videoId}`, 
            method: 'delete',
          })
    },
    //根据id删除视频
    deleteVideo(videoSourceId){
      return request({
        url: `/eduvod/video/deleteVideo/${videoSourceId}`, 
        method: 'delete',
      })
    }
}

