import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home/Home'
import Opinions from '@/components/pages/Opinions/Opinions'
import Products from '@/components/pages/Products/Products'
import ProductsAdd from '@/components/pages/Products/ProductsAdd'
import ProductsEdit from '@/components/pages/Products/ProductsEdit'

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
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/products/add',
      name: 'ProductsAdd',
      component: ProductsAdd
    },
    {
      path: '/products/edit/:id',
      name: 'ProductsEdit',
      component: ProductsEdit
    },
    {
      path: '/opinions',
      name: 'Opinions',
      component: Opinions
    }
  ]
})
