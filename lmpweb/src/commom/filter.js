
import moment from 'moment'

const filterList = []

export default {
  install(Vue) {
    // 底库类型库格式化
    Vue.filter('libaryFormat', (value) => {
      const target = store.state.libaryMap[value]
      return target ? target.name : ''
    })

    Vue.filter('moment', (date, format = 'YYYY-MM-DD', inputFormat = '') => {
      console.log(format)
      if (inputFormat) {
        return date ? moment(date, inputFormat).format(format) : '-'
      }
      return date ? moment(date).format(format) : '-'
    })

    Vue.filter('analysisType', (value) => {
      if(value===1) return '独居老人告警'
      if(value===2) return '上访人员告警'
      if(value===3) return '假释人员告警'
      if(value===4) return '房屋居住人口超限告警'
    })
  }
}
