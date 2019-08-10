import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue'
import { find, intersection, flattenDeep } from 'lodash'
import { MessageBox } from 'element-ui'

Vue.use(Router);
const router=new Router({
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import('@/views/Layout.vue'),
      children: [
        {
          path: 'index',
          name: 'index',
          component: () => import('@/views/index/index.vue')
        },
        {
          path: 'system',
          name: 'system',
          redirect: {name: 'organization'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'organization',
              name: 'organization',
              component: () => import('@/views/system/organization.vue')
            },
            {
              path: 'role',
              name: 'role',
              component: () => import('@/views/system/role.vue')
            },
            {
              path: 'user',
              name: 'user',
              component: () => import('@/views/system/user.vue')
            },
            {
              path: 'organizationType',
              name: 'organizationType',
              component: () => import('@/views/system/organizationType.vue')
            },
            {
              path: 'operationLog',
              name: 'operationLog',
              component: () => import('@/views/system/operationLog.vue')
            }
          ]
        }
      ]},
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {skipAuth: true }
    },
    {
      path: '*',
      redirect: {name: 'login'},
    }
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || ''
  let user=null;
  let authorities=[];
  if(localStorage.getItem('user')!=='null'&&localStorage.getItem('user')!=='undefined'&&localStorage.getItem('user')){
    user = JSON.parse(localStorage.getItem('user'))
    try {
      authorities= user.purviews.split(",");
    }
    catch(err){
      authorities= [];
    }
  }
  if (to.meta.skipAuth) {
    next()
  } else if (!to.meta.skipAuth && (!token)) {
    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
  } else if (!to.meta.skipAuth && !authorities.length) {
    MessageBox({
      message: '您没有任何权限！',
      title: '提示',
      type: 'error'
    })
    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
  } else {
    next();
  }
})

/**
 * 获取基于权限的路由地址
 * @param {Route} a route Object
 * @return {Promise} a Promise Object
 */
function getPermitRoute(to) {
  return new Promise((resolve) => {
    const authorities = store.getters.authorities
    // const permitApis = map(filter(permissions, pp => pp.check && pp.apiName), p => p.apiName)
    if (to.name === 'login') resolve(null)

    const menuAuthorities = flattenDeep(to.matched.map(v => v.meta.authorities || []))
    if (intersection(menuAuthorities, authorities).length) {
      resolve(null)
    } else {
      const mainRoutesParent = find(routes, r => r.name === 'root')
      const mainRoutes = mainRoutesParent.children
      // const flattenRoutes = flattenDeep(map(mainRoutes.children, child => child.children || child))
      const firstRoute = find(mainRoutes, r => intersection(r.meta.authorities, authorities).length)

      if (firstRoute) {
        resolve({
          name: firstRoute.name
        })
      } else {
        MessageBox({
          message: '您没有任何权限！',
          title: '提示',
          type: 'error'
        })

        resolve({
          name: 'login',
          query: {
            redirect: to.name !== 'login' ? to.fullPath : ''
          }
        })
      }
    }
  })
}

export default router
