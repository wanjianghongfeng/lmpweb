export default [
  {
    name: 'indexStatistics', // 获取政府首页人员数统计
    url: '/business/governmentHome/personStatistics',
    methods: ['get']
  },
  {
    name: 'indexNewAlarm', // 获取政府首页最新一条告警信息
    url: '/business/governmentHome/newestAlarm',
    methods: ['get']
  },
  {
    name: 'analysisModel', // 获取政府首页建立的分析模型
    url: '/business/governmentHome/analysisModel',
    methods: ['get']
  },
  {
    name: 'addAnalysisModel', // 新增分析模型
    url: '/business/governmentHome/analysisModel',
    methods: ['post']
  },
  {
    name: 'editAnalysisModel', // 编辑分析模型
    url: '/business/governmentHome/analysisModel/:id',
    methods: ['put']
  },
  {
    name: 'indexAlarmList', // 编辑分析模型
    url: '/business/governmentHome/analysisModel/alarms/:id',
    methods: ['get']
  }
]
