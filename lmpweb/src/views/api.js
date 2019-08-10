export default [{
  name: 'login', // 登录
  url: '/uaa/oauth/token',
  methods: ['post']
}, {
  name: 'userInfo', // 获取用户信息 1--WEB用户
  url: '/uaa/current/1',
  methods: ['get']
}, {
  name: 'logouting', // 登出
  url: '/logouting',
  methods: ['get']
},  {
  name: 'organTree', // 机构列表
  url: '/system/organ/treeList',
  methods: ['get']
},  {
  name: 'changePwd', // 修改密码
  url: '/system/user/modifyPwd/:userId',
  methods: ['put']
}]
