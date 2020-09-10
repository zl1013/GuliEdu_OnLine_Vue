import request from '@/utils/request'

export default {

   //生成统计数据
    createStatisticsDate(day){
        return request({
            url: `/statistics/daily/registerCount/${day}`, 
            method: 'get'
          })
    },
    getStatisticsData(searchObj){
        return request({
            url: `/statistics/daily/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`, 
            method: 'get',
          })
    }

}

