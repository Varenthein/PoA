import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home/Home'
import Opinions from '@/components/pages/Opinions/Opinions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Home
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/opinions',
      name: 'Opinions',
      component: Opinions
    }
  ]
})
